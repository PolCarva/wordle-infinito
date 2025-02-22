"use client";

import { useState } from "react";
import { AuthProvider } from "../context/AuthContext";
import MainLayout from "../components/layouts/MainLayout";
import { ColorBoard } from "../components/game/ColorBoard";
import { ColorKeyboard } from "../components/game/ColorKeyboard";
import { EndGameModal } from "../components/game/EndGameModal";

const COLORS = ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "⬛️", "🟫", "⬜"];
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

function getRandomColors() {
  const solution = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    solution.push(COLORS[randomIndex]);
  }
  return solution;
}

function ColordleContent() {
  const [solution, setSolution] = useState(() => getRandomColors());
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const onColorSelect = (color: string) => {
    if (gameOver) return;
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess([...currentGuess, color]);
    }
  };

  const onDelete = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const onEnter = () => {
    if (currentGuess.length !== WORD_LENGTH) return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess([]);

    // Verificar si ganó
    if (currentGuess.every((color, i) => color === solution[i])) {
      setWon(true);
      setGameOver(true);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
    }
  };

  const handleReset = () => {
    setSolution(getRandomColors());
    setGuesses([]);
    setCurrentGuess([]);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <h1 className="text-4xl font-bold text-center">Colordle</h1>
      {process.env.NODE_ENV === "development" && (
        <p>Solución: {solution.join(" ")}</p>
      )}

      <div className="w-full max-w-sm">
        <ColorBoard
          guesses={guesses}
          currentGuess={currentGuess}
          solution={solution}
          wordLength={WORD_LENGTH}
          maxAttempts={MAX_ATTEMPTS}
        />
      </div>

      <ColorKeyboard
        onColorSelect={onColorSelect}
        onDelete={onDelete}
        onEnter={onEnter}
        disabled={gameOver}
        guesses={guesses}
        solution={solution}
      />

      <EndGameModal
        show={gameOver}
        won={won}
        solution={solution}
        boards={[
          {
            word: solution.join(""),
            completed: gameOver,
            guesses: guesses.map((g) => g.join("")),
            id: 1,
          },
        ]}
        onClose={() => setGameOver(false)}
        onPlayAgain={handleReset}
      />
    </div>
  );
}

export default function ColordlePage() {
  return (
    <AuthProvider>
      <MainLayout>
        <ColordleContent />
      </MainLayout>
    </AuthProvider>
  );
}
