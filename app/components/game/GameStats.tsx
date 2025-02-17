"use client";

import { GameState } from "@/app/types";

export function GameStats({ gameState }: { gameState: GameState }) {
  const completedBoards = gameState.boards.filter(board => board.completed).length;
  const totalBoards = gameState.boards.length;
  const currentAttempt = gameState.boards[0]?.guesses.length || 0;

  return (
    <div className="text-center mb-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <p className="text-lg font-semibold">
        Aciertos: {completedBoards} de {totalBoards}
      </p>
      <p className="text-lg font-semibold">
        Intento {currentAttempt} de {gameState.maxAttempts} (quedan {gameState.remainingLives} vidas)
      </p>
    </div>
  );
} 