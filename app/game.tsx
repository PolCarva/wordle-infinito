"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import Confetti from "react-confetti-boom";
import { GameBoard } from "./components/game/GameBoard";
import { Keyboard } from "./components/game/Keyboard";
import { GameStats } from "./components/game/GameStats";
import { GameState } from "./types";
import { getRandomWords } from "./utils/game-utils";
import { Nav } from "./components/game/Nav";
import { Menu } from "./components/game/Menu";
import { trackEvent } from "./utils/analytics";
import { getDictionary, getGameConfig } from "@/app/dictionaries";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/app/services/api";

interface GameProps {
  customWords?: string[];
}

interface WindowWithTemp extends Window {
  __TEMP_ACCEPTED_WORDS?: string[];
}

export default function Game({ customWords }: GameProps) {
  const [started, setStarted] = useState(false);
  const [boardCount, setBoardCount] = useState<number | "">(1);
  const [useRareWords, setUseRareWords] = useState(false);
  const [wordLength, setWordLength] = useState(5);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const { user } = useAuth();
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    streak: 0
  });

  const initializeGame = useCallback(async () => {
    const finalBoardCount = typeof boardCount === "number" ? boardCount : 1;
    const dictionary = await getDictionary(wordLength, useRareWords);
    const words = customWords || getRandomWords(finalBoardCount, dictionary);
    const config = await getGameConfig(wordLength);

    trackEvent("game_started", {
      board_count: words.length,
      is_custom: !!customWords,
      use_rare_words: useRareWords,
      word_length: wordLength,
    });

    setGameState({
      boards: words.map((word, index) => ({
        word,
        completed: false,
        guesses: [],
        id: index
      })),
      currentGuess: "",
      gameOver: false,
      won: false,
      maxAttempts: finalBoardCount + config.extraAttempts,
      remainingLives: config.extraAttempts,
      showEndModal: false,
    });
    setStarted(true);
    setError(null);
  }, [boardCount, customWords, useRareWords, wordLength]);

  useEffect(() => {
    if (customWords) {
      const validateCustomWords = async () => {
        try {
          const acceptedWords = await getDictionary(wordLength, true);
          const newWords = customWords.filter(
            (word) => !acceptedWords.includes(word)
          );
          if (newWords.length > 0) {
            const tempAcceptedWords = [...acceptedWords, ...newWords];
            (window as WindowWithTemp).__TEMP_ACCEPTED_WORDS = tempAcceptedWords;
          }
        } catch (error) {
          console.error('Error validating custom words:', error);
        }
      };

      validateCustomWords();
      setBoardCount(customWords.length);
      initializeGame();

      return () => {
        delete (window as WindowWithTemp).__TEMP_ACCEPTED_WORDS;
      };
    }
  }, [customWords, initializeGame, wordLength]);

  useEffect(() => {
    if (user) {
      api.getStats(user.userId)
        .then(stats => setStats(stats))
        .catch(console.error);
    }
  }, [user]);

  const updateGameStats = useCallback(async (won: boolean) => {
    if (!user) return;

    const newStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (won ? 1 : 0),
      streak: won ? stats.streak + 1 : 0
    };

    try {
      const updatedStats = await api.updateStats(user.userId, newStats);
      setStats(updatedStats);
    } catch (error) {
      console.error('Error actualizando estadísticas:', error);
    }
  }, [user, stats]);

  const handleGuess = useCallback(async () => {
    if (!gameState) return;

    const guess = gameState.currentGuess.toUpperCase();
    const acceptedWords = await getDictionary(wordLength, true);

    if (guess.length !== wordLength) {
      setError(`La palabra debe tener ${wordLength} letras`);
      return;
    }

    if (!acceptedWords.includes(guess)) {
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

    if (allCompleted || attemptsExhausted) {
      updateGameStats(allCompleted);
    }

    setGameState({
      ...gameState,
      boards: newBoards,
      currentGuess: "",
      gameOver: allCompleted || attemptsExhausted,
      won: allCompleted,
      remainingLives: newRemainingLives,
      showEndModal: true,
    });
    setError(null);
  }, [gameState, wordLength, updateGameStats]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!gameState || gameState.gameOver) return;

      if (event.key === "Enter") {
        if (gameState.currentGuess.length !== wordLength) {
          setError(`La palabra debe tener ${wordLength} letras`);
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

      if (gameState.currentGuess.length === wordLength) return;

      if (/^[A-ZÑ]$/.test(event.key.toUpperCase())) {
        setGameState((prev) => ({
          ...prev!,
          currentGuess: prev!.currentGuess + event.key.toUpperCase(),
        }));
      }
    },
    [gameState, wordLength, handleGuess]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleKeyDown, handleGuess]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    setIsDark(isDark);
    localStorage.setItem("darkTheme", String(isDark));
  };

  const handleKeyPress = (key: string) => {
    if (!gameState || gameState.gameOver) return;
    handleKeyDown({ key } as KeyboardEvent);
  };

  const handleStart = async () => {
    try {
      await initializeGame();
    } catch (error) {
      console.error('Error initializing game:', error);
      setError('Error iniciando el juego');
    }
  };

  if (!started) {
    return (
      <div className="flex w-full min-h-svh justify-center flex-col items-center gap-4 p-4">
        <Nav isDark={isDark} onThemeToggle={toggleTheme} />
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
    <div className="flex w-full flex-col items-center gap-6 p-4 pt-16 pb-[240px] md:pb-4">
      <Nav
        onBack={() => setStarted(false)}
        onReset={() => initializeGame()}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />

      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold">Wordle Infinito</h1>
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="text-sm text-gray-500">
          {gameState.boards.map((board, i) => (
            <span key={i} className="mr-2">
              {board.word}
            </span>
          ))}
        </div>
      )}
      {gameState && <GameStats gameState={gameState} />}

      <div className="w-full">
        <div
          className={`
            grid grid-cols-2 max-w-[1600px] md:grid-cols-3 mx-auto lg:grid-cols-4 gap-2 md:gap-8

            ${
              gameState.boards.length === 1
                ? `!grid-cols-1 lg:!grid-cols-1 !max-w-[500px]`
                : ""
            }
            ${
              gameState.boards.length === 2
                ? `!grid-cols-2 lg:!grid-cols-2 max-w-[800px]`
                : ""
            }
            ${
              gameState.boards.length === 3
                ? `!grid-cols-2 lg:!grid-cols-3`
                : ""
            }
          
          `}
        >
          {gameState.boards.map((board, i) => (
            <GameBoard
              key={i}
              board={board}
              currentGuess={gameState.currentGuess}
              gameOver={gameState.gameOver}
              gameState={gameState}
            />
          ))}
        </div>
      </div>
      {error && (
        <div className="fixed top-5 md:top-auto bottom-4 z-50 left-1/2 transform -translate-x-1/2 animate-fade-out">
          <div className="bg-red-500 text-white font-bold py-2 px-4 rounded">
            {error}
          </div>
        </div>
      )}
      <div className="fixed lg:relative bottom-0 left-0 right-0 bg-white dark:bg-gray-900 lg:!bg-transparent p-2 md:p-4 lg:border-t-0 border-t dark:border-gray-800">
        <Keyboard onKeyDown={handleKeyPress} gameState={gameState} />
      </div>
      {gameState.gameOver && gameState.showEndModal && (
        <div className="fixed inset-0 flex items-center z-50 justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">
              {gameState.won ? "¡Ganaste!" : "¡Perdiste!"}
            </h2>
            {gameState.won && (
              <Confetti
                launchSpeed={1.5}
                spreadDeg={180}
                effectCount={3}
                effectInterval={500}
                mode="boom"
                particleCount={150}
                colors={[
                  "#E74C3C",
                  "#2ECC71",
                  "#3498DB",
                  "#F1C40F",
                  "#9B59B6",
                  "#1ABC9C",
                ]}
              />
            )}
            <p className="text-xl mb-4">
              {gameState.won
                ? "¡Felicidades! Has adivinado todas las palabras."
                : "Suerte para la próxima."}
            </p>
            {!gameState.won && (
              <div className="mb-4">
                {gameState.boards.length === 1
                  ? "La palabra era: "
                  : "Las palabras eran: "}
                {gameState.boards.map((board) => board.word).join(", ")}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                className="bg-red-600 text-white hover:text-white hover:bg-red-700"
                onClick={() =>
                  setGameState((prev) =>
                    prev ? { ...prev, showEndModal: false } : null
                  )
                }
              >
                Cerrar
              </Button>
              <Button onClick={() => initializeGame()}>Jugar de nuevo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
