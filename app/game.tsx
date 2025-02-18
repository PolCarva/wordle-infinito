"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { ACCEPTED_WORDS } from "./accepted-words";
import Confetti from "react-confetti-boom";
import { GameBoard } from "./components/game/GameBoard";
import { Keyboard } from "./components/game/Keyboard";
import { GameStats } from "./components/game/GameStats";
import { GameState } from "./types";
import { getRandomWords } from "./utils/game-utils";
import { Nav } from "./components/game/Nav";
import { Menu } from "./components/game/Menu";

export default function Game() {
  const [started, setStarted] = useState(false);
  const [boardCount, setBoardCount] = useState<number | ''>(2);
  const [useRareWords, setUseRareWords] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const initializeGame = () => {
    const finalBoardCount = typeof boardCount === 'number' ? boardCount : 1;
    const words = getRandomWords(finalBoardCount, useRareWords);
    setGameState({
      boards: words.map((word) => ({
        word,
        completed: false,
        guesses: [],
      })),
      currentGuess: "",
      gameOver: false,
      won: false,
      maxAttempts: finalBoardCount + 5,
      remainingLives: 5,
      showEndModal: false,
    });
    setStarted(true);
    setError(null);
  };

  const handleGuess = useCallback(() => {
    if (!gameState || gameState.currentGuess.length !== 5) return;

    const normalizedGuess = gameState.currentGuess.toUpperCase();

    if (!ACCEPTED_WORDS.includes(normalizedGuess)) {
      setError("Palabra no encontrada");
      return;
    }

    const isCorrectGuess = gameState.boards.some(
      (board) => board.word === normalizedGuess
    );

    // Actualizar vidas (solo informativo)
    const newRemainingLives = isCorrectGuess
      ? gameState.remainingLives
      : gameState.remainingLives - 1;

    // Actualizar todos los tableros con el nuevo intento
    const newBoards = gameState.boards.map((board) => ({
      ...board,
      guesses: [...board.guesses, normalizedGuess],
      completed: board.completed || normalizedGuess === board.word,
    }));

    const allCompleted = newBoards.every((board) => board.completed);
    const attemptsExhausted =
      newBoards[0].guesses.length >= gameState.maxAttempts;

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
  }, [gameState]);

  const handleKeyPress = (key: string) => {
    if (!gameState || gameState.gameOver) return;
    if (key === "ENTER") {
      handleGuess();
    } else if (key === "BACKSPACE") {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess.slice(0, -1),
      });
      setError(null);
    } else if (gameState.currentGuess.length < 5) {
      setGameState({
        ...gameState,
        currentGuess: gameState.currentGuess + key.toUpperCase(),
      });
      setError(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameState || gameState.gameOver) return;

      if (event.key === "Enter") {
        handleGuess();
      } else if (event.key === "Backspace") {
        setGameState({
          ...gameState,
          currentGuess: gameState.currentGuess.slice(0, -1),
        });
        setError(null);
      } else if (
        /^[A-Za-zÑñ]$/.test(event.key) &&
        gameState.currentGuess.length < 5
      ) {
        setGameState({
          ...gameState,
          currentGuess: gameState.currentGuess + event.key.toUpperCase(),
        });
        setError(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, handleGuess]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    setIsDark(isDark);
    localStorage.setItem("darkTheme", String(isDark));
  };

  if (!started) {
    return (
      <div className="flex w-full min-h-svh justify-center flex-col items-center gap-4 p-4">
        <Nav
          isDark={isDark}
          onThemeToggle={toggleTheme}
        />
        <Menu 
          boardCount={boardCount}
          setBoardCount={setBoardCount}
          onStart={() => initializeGame()}
          setError={setError}
          useRareWords={useRareWords}
          setUseRareWords={setUseRareWords}
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
        <h1 className="text-4xl font-bold">Multi-Wordle</h1>
      </div>

      {gameState && <GameStats gameState={gameState} />}

      <div className="w-full max-w-[1600px]">
        <div
          className={`
            grid grid-cols-2 max-w-[800px] md:grid-cols-3 mx-auto lg:grid-cols-4 gap-2 md:gap-8

            ${
              gameState.boards.length === 1 
                ? `!grid-cols-1 lg:!grid-cols-1 !max-w-[500px]`
                : ""
            }
            ${
              gameState.boards.length === 2
                ? `!grid-cols-2 lg:!grid-cols-2`
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
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 animate-fade-out">
          <div className="bg-red-500 text-white font-bold py-2 px-4 rounded">
            {error}
          </div>
        </div>
      )}
      <div className="fixed lg:relative  bottom-0 left-0 right-0 bg-white dark:bg-gray-900 lg:!bg-transparent p-4 lg:border-t-0 border-t dark:border-gray-800">
        <Keyboard onKeyPress={handleKeyPress} gameState={gameState} />
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
                {gameState.boards.length === 1 ? "La palabra era: " : "Las palabras eran: "}
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
