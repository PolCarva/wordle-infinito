"use client";

import { useState, useEffect, useCallback } from "react";

import { GameBoard } from "./components/game/GameBoard";
import { Keyboard } from "./components/game/Keyboard";
import { GameStats } from "./components/game/GameStats";
import { GameState } from "./types";
import { getRandomWords } from "./utils/game-utils";
import { Menu } from "./components/game/Menu";
import { getDictionary, getGameConfig } from "@/app/dictionaries";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/app/services/api";
import { BOARD_MAX_WIDTHS } from "@/app/constants/styles";
import { EndGameModal } from "./components/game/EndGameModal";
import { Nav } from "./components/game/Nav";
import { useTheme } from "next-themes";
import { trackEvent } from "./utils/analytics";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./components/ui/button";

interface GameProps {
  customWords?: string[];
}

interface WindowWithTemp extends Window {
  __TEMP_ACCEPTED_WORDS?: string[];
}

interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  streak: number;
  winRate: number;
  versusPlayed: number;
  versusWon: number;
  versusWinRate: number;
  versusStreak: number;
  versusBestStreak: number;
}

export default function Game({ customWords }: GameProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  
  const [started, setStarted] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("currentGame");
  });

  const [gameState, setGameState] = useState<GameState | null>(() => {
    if (typeof window === "undefined") return null;
    const savedState = localStorage.getItem("gameState");
    return savedState ? JSON.parse(savedState) : null;
  });

  // Estado para controlar la visibilidad de los tableros completados
  const [hideCompletedBoards, setHideCompletedBoards] = useState(false);

  const [boardCount, setBoardCount] = useState<number | "">(1);
  const [useRareWords, setUseRareWords] = useState(false);
  const [wordLength, setWordLength] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  const initializeGame = useCallback(async () => {
    // Si hay palabras personalizadas, usar la longitud de la primera palabra
    const wordLengthToUse = customWords && customWords.length > 0 
      ? customWords[0].length 
      : wordLength;
    
    const finalBoardCount = typeof boardCount === "number" ? boardCount : 1;
    const dictionary = await getDictionary(wordLengthToUse, useRareWords, true);
    const words = customWords || getRandomWords(finalBoardCount, dictionary);
    const config = await getGameConfig(wordLengthToUse, true);

    // Para partidas personalizadas, siempre usar 5 vidas extra
    const extraAttempts = customWords ? 5 : config.extraAttempts;
    
    // El número total de intentos debe ser la cantidad de palabras + las vidas extra
    const totalAttempts = words.length + extraAttempts;

    const newGameState = {
      boards: words.map((word, index) => ({
        word,
        completed: false,
        guesses: [],
        id: index,
      })),
      currentGuess: "",
      gameOver: false,
      won: false,
      maxAttempts: totalAttempts,
      remainingLives: extraAttempts,
      showEndModal: false,
    };

    setGameState(newGameState);
    setStarted(true);
    localStorage.setItem("currentGame", "true");
    localStorage.setItem("gameState", JSON.stringify(newGameState));
    setError(null);
  }, [boardCount, customWords, useRareWords, wordLength]);

  useEffect(() => {
    if (customWords) {
      const validateCustomWords = async () => {
        try {
          // Usar la longitud de la primera palabra personalizada
          const customWordLength = customWords[0].length;
          // Actualizar el estado de wordLength para que coincida con las palabras personalizadas
          setWordLength(customWordLength);
          
          const acceptedWords = await getDictionary(customWordLength, true, true);
          const newWords = customWords.filter(
            (word) => !acceptedWords.includes(word)
          );
          if (newWords.length > 0) {
            const tempAcceptedWords = [...acceptedWords, ...newWords];
            if (typeof window !== "undefined") {
              (window as WindowWithTemp).__TEMP_ACCEPTED_WORDS =
                tempAcceptedWords;
            }
          }
          initializeGame();
        } catch (error) {
          console.error("Error validando palabras personalizadas:", error);
          setError("Error validando palabras personalizadas");
        }
      };
      validateCustomWords();
    }
  }, [customWords, initializeGame]);

  useEffect(() => {
    if (user) {
      api
        .getStats(user.userId)
        .then((stats) => {
          setStats(stats);
          // Solo inicializar si NO hay estado guardado y hay palabras personalizadas
          if (!gameState && customWords) {
            initializeGame();
          }
        })
        .catch(console.error);
    }
  }, [user, customWords, initializeGame, gameState]);

  const updateGameStats = useCallback(
    async (won: boolean) => {
      if (!user || !stats || !gameState) return;
      
      // No actualizar estadísticas para juegos personalizados
      if (customWords) {
        console.log("Juego personalizado: no se actualizan estadísticas");
        return;
      }

      const newStats = {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: stats.gamesWon + (won ? 1 : 0),
        streak: won ? stats.streak + 1 : 0,
        winRate: Math.round(
          ((stats.gamesWon + (won ? 1 : 0)) / (stats.gamesPlayed + 1)) * 100
        ),
      };

      try {
        // Generar un token de verificación para esta actualización de estadísticas
        // Usamos un ID único para el juego (o generamos uno si no existe)
        const gameId = typeof window !== 'undefined' ? 
          localStorage.getItem('gameId') || `game_${Date.now()}` : 
          `game_${Date.now()}`;
        
        // Guardar el ID del juego para futuras referencias
        if (typeof window !== 'undefined') {
          localStorage.setItem('gameId', gameId);
        }
        
        // Datos del juego para verificación
        const gameData = {
          boards: gameState.boards.map(board => ({
            word: board.word,
            completed: board.completed,
            guessCount: board.guesses.length,
            // Añadir información adicional para depuración
            lastGuess: board.guesses.length > 0 ? board.guesses[board.guesses.length - 1] : null,
            isCorrect: board.completed && board.guesses.includes(board.word)
          })),
          won,
          timestamp: Date.now(),
          gameId, // Incluir el gameId en los datos para verificación
          // Añadir información adicional para depuración
          totalBoards: gameState.boards.length,
          completedBoards: gameState.boards.filter(board => board.completed).length,
          maxAttempts: gameState.maxAttempts,
          currentAttempt: gameState.boards[0]?.guesses.length || 0
        };
        
        // Registrar evento de analytics para finalización de juego
        trackEvent('game_completed', {
          won: won,
          boardCount: gameState.boards.length,
          wordLength: gameState.boards[0]?.word.length || 5,
          attempts: gameState.boards[0]?.guesses.length || 0
        });
        
       /*  console.log("Generando token de verificación con datos:", {
          userId: user.userId,
          gameId,
          gameDataSummary: {
            boardCount: gameData.boards.length,
            won: gameData.won,
            timestamp: new Date(gameData.timestamp).toISOString(),
            completedBoards: gameData.completedBoards,
            boardsInfo: gameData.boards.map(b => ({
              word: b.word,
              completed: b.completed,
              guessCount: b.guessCount,
              isCorrect: b.isCorrect
            }))
          }
        }); */
        
        // Generar token de verificación
        const verificationToken = api.generateGameVerificationToken(
          user.userId, 
          gameId, 
          gameData
        );
        
        /* console.log("Token generado, actualizando estadísticas..."); */
        
        // Actualizar estadísticas con el token de verificación
        const updatedStats = await api.updateStats(user.userId, newStats, verificationToken);
        console.log("Estadísticas actualizadas correctamente:", updatedStats);
        setStats(updatedStats);
      } catch (error) {
        console.error("Error actualizando estadísticas:", error);
        setError("Error al actualizar estadísticas. Por favor, inténtalo de nuevo.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, stats, gameState, setError]
  );

  const handleGuess = useCallback(async () => {
    if (!gameState) return;

    const guess = gameState.currentGuess.toUpperCase();
    // Usar la longitud de la primera palabra del tablero
    const currentWordLength = gameState.boards[0].word.length;
    const acceptedWords = await getDictionary(currentWordLength, true, true);

    if (guess.length !== currentWordLength) {
      setError(`La palabra debe tener ${currentWordLength} letras`);
      return;
    }

    // Si hay palabras personalizadas, considerarlas como válidas
    const customWordsSet = customWords ? new Set(customWords) : new Set();
    
    // Verificar si la palabra está en el diccionario o es una palabra personalizada
    if (!acceptedWords.includes(guess) && !customWordsSet.has(guess)) {
      setError("Palabra no válida");
      return;
    }

    const isCorrectGuess = gameState.boards.some(
      (board) => board.word === guess
    );

    // Actualizar vidas (solo informativo)
    const newRemainingLives = isCorrectGuess
      ? gameState.remainingLives
      : gameState.remainingLives - 1;

    // Actualizar todos los tableros con el nuevo intento
    const newBoards = gameState.boards.map((board) => ({
      ...board,
      guesses: [...board.guesses, guess],
      completed: board.completed || guess === board.word,
    }));

    const allCompleted = newBoards.every((board) => board.completed);
    const attemptsExhausted =
      newBoards[0].guesses.length >= gameState.maxAttempts;

    // Solo mostrar la modal si el juego realmente terminó
    const isGameOver = allCompleted || attemptsExhausted;

    // Solo actualizar estadísticas si no es un juego personalizado
    if (isGameOver && !customWords) {
      updateGameStats(allCompleted);
    }

    const newGameState = {
      ...gameState,
      boards: newBoards,
      currentGuess: "",
      gameOver: isGameOver,
      won: allCompleted,
      remainingLives: newRemainingLives,
      showEndModal: isGameOver, // Solo mostrar la modal si el juego terminó
    };

    setGameState(newGameState);
    localStorage.setItem("gameState", JSON.stringify(newGameState));
    setError(null);
  }, [gameState, updateGameStats, customWords]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!gameState || gameState.gameOver) return;

      // Usar la longitud de la primera palabra del tablero
      const currentWordLength = gameState.boards[0].word.length;

      if (event.key === "Enter") {
        if (gameState.currentGuess.length !== currentWordLength) {
          setError(`La palabra debe tener ${currentWordLength} letras`);
          return;
        }

        handleGuess();
      }

      if (event.key === "Backspace") {
        setGameState((prev) => ({
          ...prev!,
          currentGuess: prev!.currentGuess.slice(0, -1),
        }));
        return;
      }

      if (gameState.currentGuess.length === currentWordLength) return;

      if (/^[A-ZÑ]$/.test(event.key.toUpperCase())) {
        setGameState((prev) => ({
          ...prev!,
          currentGuess: prev!.currentGuess + event.key.toUpperCase(),
        }));
      }
    },
    [gameState, handleGuess]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleKeyDown, handleGuess]);

  const handleKeyPress = (key: string) => {
    if (!gameState || gameState.gameOver) return;

    // Usar la longitud de la primera palabra del tablero
    const currentWordLength = gameState.boards[0].word.length;

    // Normalizar las teclas para que coincidan con el evento del teclado físico
    if (key === "ENTER") {
      handleGuess();
    } else if (key === "BACKSPACE") {
      setGameState(prev => ({
        ...prev!,
        currentGuess: prev!.currentGuess.slice(0, -1)
      }));
    } else {
      // Solo agregar la letra si no excede el límite
      if (gameState.currentGuess.length < currentWordLength) {
        setGameState(prev => ({
          ...prev!,
          currentGuess: prev!.currentGuess + key
        }));
      }
    }
  };

  const handleStart = async () => {
    try {
      await initializeGame();
    } catch (error) {
      console.error("Error initializing game:", error);
      setError("Error iniciando el juego");
    }
  };


  // Actualizar localStorage cuando cambia el estado del juego
  useEffect(() => {
    if (gameState) {
      if (gameState.gameOver) {
        localStorage.removeItem("currentGame");
        localStorage.removeItem("gameState");
      } else {
        localStorage.setItem("gameState", JSON.stringify(gameState));
      }
    }
  }, [gameState]);

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Función para alternar la visibilidad de los tableros completados
  const toggleCompletedBoardsVisibility = () => {
    setHideCompletedBoards(prev => !prev);
  };

  // Mantener solo un efecto simple para limpiar el localStorage cuando se desmonte el componente
  useEffect(() => {
    return () => {
      localStorage.removeItem("currentGame");
      localStorage.removeItem("gameState");
    };
  }, []);

  if (!started) {
    return (
      <div className="flex w-full min-h-svh justify-center flex-col items-center gap-4 p-4">
        <Menu
          boardCount={boardCount}
          setBoardCount={setBoardCount}
          onStart={handleStart}
          setError={setError}
          useRareWords={useRareWords}
          setUseRareWords={setUseRareWords}
          wordLength={wordLength}
          setWordLength={setWordLength}
        />
      </div>
    );
  }

  if (!gameState) return null;

  return (
    <div className="flex w-full flex-col items-center gap-6 p-4 pb-[240px] md:pb-4">
      <Nav isDark={isDark} onThemeToggle={handleThemeToggle} />

      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold">Wordle Infinito</h1>
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="text-lg font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="flex flex-wrap gap-2">
            SOLUCIONES: {" "}
            {gameState.boards.map((board, i) => (
              <span key={i} className="mr-2">
                {board.word}
              </span>
            ))}
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div className="flex-1">
          {gameState && <GameStats gameState={gameState} />}
        </div>
        
      </div>
        {gameState.boards.some(board => board.completed) && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleCompletedBoardsVisibility}
            className="ml-2 flex items-center gap-1 sticky top-8 z-50"
            title={hideCompletedBoards ? "Mostrar tableros completados" : "Ocultar tableros completados"}
          >
            {hideCompletedBoards ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {hideCompletedBoards ? "Mostrar completados" : "Ocultar completados"}
            </span>
            {hideCompletedBoards && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                {gameState.boards.filter(board => board.completed).length}
              </span>
            )}
          </Button>
        )}

      <div className="w-full">
        <div
          className={`
            grid 
            ${gameState.boards.length <= 10 ? "grid-cols-1" : "grid-cols-2"}
            ${
              BOARD_MAX_WIDTHS[wordLength]?.[gameState.boards.length] ||
              BOARD_MAX_WIDTHS[wordLength]?.["all"] ||
              "max-w-[1600px]"
            } md:grid-cols-3 mx-auto lg:grid-cols-4 gap-2 md:gap-8

            ${
              gameState.boards.length === 1
                ? `!grid-cols-1 lg:!grid-cols-1 ${
                    BOARD_MAX_WIDTHS[wordLength]?.[1] ||
                    BOARD_MAX_WIDTHS[wordLength]?.["all"] ||
                    "max-w-[500px]"
                  }`
                : ""
            }
            ${
              gameState.boards.length === 2
                ? `!grid-cols-2 lg:!grid-cols-2 ${
                    BOARD_MAX_WIDTHS[wordLength]?.[2] ||
                    BOARD_MAX_WIDTHS[wordLength]?.["all"] ||
                    "max-w-[800px]"
                  }`
                : ""
            }
            ${
              gameState.boards.length === 3
                ? `!grid-cols-2 lg:!grid-cols-3 ${
                    BOARD_MAX_WIDTHS[wordLength]?.[3] ||
                    BOARD_MAX_WIDTHS[wordLength]?.["all"] ||
                    "max-w-[1200px]"
                  }`
                : ""
            }
          
          `}
        >
          {gameState.boards
            .filter(board => !hideCompletedBoards || !board.completed)
            .map((board, i) => (
              <GameBoard
                key={i}
                board={board}
                currentGuess={gameState.currentGuess}
                gameOver={gameState.gameOver}
                gameState={gameState}
              />
            ))}
            
          {hideCompletedBoards && gameState.boards.every(board => board.completed) && (
            <div className="col-span-full text-center p-8 bg-muted rounded-lg">
              <p className="text-lg font-medium mb-2">¡Todos los tableros están completados!</p>
              <Button 
                variant="default" 
                onClick={toggleCompletedBoardsVisibility}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Mostrar todos los tableros
              </Button>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="fixed top-5 md:top-auto bottom-4 z-50 left-1/2 transform -translate-x-1/2 animate-fade-out">
          <div className="bg-red-500 text-white font-bold py-2 px-4 rounded">
            {error}
          </div>
        </div>
      )}
      <div className="fixed lg:relative bottom-0 left-0 right-0 bg-white dark:bg-gray-900 lg:!bg-transparent p-0 md:p-4 lg:border-t-0 border-t dark:border-gray-800">
        <Keyboard onKeyDown={handleKeyPress} gameState={gameState} />
      </div>

      {gameState.showEndModal && (
        <EndGameModal
          show={gameState.showEndModal}
          won={gameState.won}
          boards={gameState.boards}
          onClose={() =>
            setGameState((prev) =>
              prev ? { ...prev, showEndModal: false } : null
            )
          }
          onPlayAgain={() => initializeGame()}
          isCustomGame={!!customWords}
        />
      )}
    </div>
  );
}
