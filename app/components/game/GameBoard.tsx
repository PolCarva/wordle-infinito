"use client";

import { BoardState, GameState } from "@/app/types";
import { checkGuess } from "@/app/utils/game-utils";

interface GameBoardProps {
  board: BoardState;
  currentGuess: string;
  gameOver: boolean;
  gameState: GameState;
}

export function GameBoard({ board, currentGuess, gameOver, gameState }: GameBoardProps) {
  const getVisibleRows = () => {
    const rows = [];
    const isLastAttempt = board.guesses.length === gameState.maxAttempts - 1;
    
    if (board.completed) {
      const correctGuessIndex = board.guesses.findIndex(guess => guess === board.word);
      for (let i = 0; i <= correctGuessIndex; i++) {
        rows.push(checkGuess(board.guesses[i], board.word));
      }
      return rows;
    }
    
    for (let i = 0; i < board.guesses.length; i++) {
      rows.push(checkGuess(board.guesses[i], board.word));
    }
    
    if (!board.completed && !gameOver) {
      rows.push(
        currentGuess
          .padEnd(5, " ")
          .split("")
          .map(() => "empty" as const)
      );
    }
    
    if (!board.completed && !gameOver && !isLastAttempt) {
      rows.push(Array(5).fill("empty" as const));
    }
    
    if (!board.completed) {
      while (rows.length < 5) {
        rows.push(Array(5).fill("empty" as const));
      }
    }
    
    return rows;
  };

  const rows = getVisibleRows();
  const winningRowIndex = board.completed ? 
    board.guesses.findIndex(guess => guess === board.word) : 
    -1;

  return (
    <div className={`p-2 md:p-4 max-w-[800px] rounded-lg border ${board.completed ? "border-green-500" : "border-gray-500"}`}>
      <div className="grid gap-1">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((state, j) => {
              const letter =
                i < board.guesses.length
                  ? board.guesses[i][j]
                  : i === board.guesses.length
                  ? currentGuess[j]
                  : "";
              return (
                <div
                  key={j}
                  className={`flex items-center justify-center text-sm lg:text-xl font-semibold lg:font-bold rounded
                    ${
                      state === "correct"
                        ? "bg-green-500"
                        : state === "present"
                        ? "bg-yellow-500"
                        : state === "absent"
                        ? "bg-gray-400"
                        : "bg-gray-200 dark:bg-gray-700"
                    }
                    ${
                      i === board.guesses.length || i === winningRowIndex
                        ? "w-full h-full aspect-square text-base md:text-xl"
                        : "w-full h-[2vh] md:h-[3vh] text-[10px] md:text-xs"
                    }`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
} 