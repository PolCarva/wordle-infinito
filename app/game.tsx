"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ACCEPTED_WORDS } from "./accepted-words";
import ThemeButton from "@/app/components/ui/ThemeButton";
import Confetti from "react-confetti-boom";
import { GameBoard } from "./components/game/GameBoard";
import { Keyboard } from "./components/game/Keyboard";
import { GameStats } from "./components/game/GameStats";
import { GameState } from "./types";
import { getRandomWords } from "./utils/game-utils";

export default function Game() {
  const [started, setStarted] = useState(false);
  const [boardCount, setBoardCount] = useState(2);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeGame = () => {
    const words = getRandomWords(boardCount);
    setGameState({
      boards: words.map((word) => ({
        word,
        completed: false,
        guesses: [],
      })),
      currentGuess: "",
      gameOver: false,
      won: false,
      maxAttempts: boardCount + 5,
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

  if (!started) {
    return (
      <div className="flex w-full h-svh justify-center flex-col items-center gap-4">
        <ThemeButton />
        <h1 className="text-4xl font-bold mb-2">Multi-Wordle</h1>
        <div className="flex items-center gap-4">
          <label className="text-lg">Número de juegos:</label>
          <Input
            type="number"
            min="1"
            max="128"
            value={boardCount}
            onChange={(e) =>
              setBoardCount(Number.parseInt(e.target.value) || 1)
            }
            className="w-20"
          />
        </div>
        <Button onClick={initializeGame}>Empezar a Jugar</Button>
      </div>
    );
  }

  if (!gameState) return null;

  return (
    <div className="flex w-full flex-col items-center gap-6 p-4 pt-10 pb-[240px] md:pb-4">
      <ThemeButton />
      <div className="flex gap-4 fixed top-5 left-5">
        <Button
          variant="link"
          onClick={() => setStarted(false)}
          className="text-yellow-600 hover:text-yellow-700 border-yellow-600 hover:border-yellow-700"
        >
          Volver
        </Button>
        <Button
          variant="outline"
          onClick={initializeGame}
          className="text-yellow-600  hover:text-yellow-700 border-yellow-600 hover:border-yellow-700"
        >
          Reiniciar
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold">Multi-Wordle</h1>
      </div>

      <span> {gameState?.boards.map((board) => board.word).join(", ")}</span>

      {gameState && <GameStats gameState={gameState} />}

      <div className="w-full max-w-[1600px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8">
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
      <div className="fixed lg:relative  bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 border-t dark:border-gray-800">
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
                Las palabras eran:{" "}
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
              <Button onClick={initializeGame}>Jugar de nuevo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
