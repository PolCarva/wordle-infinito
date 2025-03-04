"use client";

import { GameState } from "@/app/types";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";

interface GameStatsProps {
  gameState: GameState;
  stats?: any;
  onExitGame?: () => void;
}

export function GameStats({ gameState, stats, onExitGame }: GameStatsProps) {
  const completedBoards = gameState.boards.filter(board => board.completed).length;
  const totalBoards = gameState.boards.length;
  const currentAttempt = gameState.boards[0]?.guesses.length || 0;

  return (
    <div className="text-center mb-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg relative">
      {onExitGame && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 p-0"
          onClick={onExitGame}
          title="Salir del juego"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <p className="text-lg font-semibold">
        Aciertos: {completedBoards} de {totalBoards}
      </p>
      <p className="text-lg font-semibold">
        Intento <span className="font-bold text-primary">{currentAttempt}</span> de <span className="font-bold">{gameState.maxAttempts}</span>{" "}
        <span className="text-red-500 block md:inline">({gameState.remainingLives} vida{gameState.remainingLives === 1 ? "" : "s"} restante{gameState.remainingLives === 1 ? "" : "s"} ❤️)</span>
      </p>
    </div>
  );
} 