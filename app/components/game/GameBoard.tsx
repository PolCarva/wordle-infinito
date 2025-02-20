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
  const wordLength = board.word.length; 

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
          .padEnd(wordLength, " ")
          .split("")
          .map(() => "empty" as const)
      );
    }
    
    if (!board.completed && !gameOver && !isLastAttempt) {
      rows.push(Array(wordLength).fill("empty" as const));
    }
    
    if (!board.completed) {
      while (rows.length < gameState.maxAttempts) {
        rows.push(Array(wordLength).fill("empty" as const));
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
                  {/* Solo mostrar la letra si no está oculta o si el juego terminó */}
                  {(!gameState.hideLetters || gameOver) ? letter : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({ letter, status, hideLetters }: { letter: string, status?: string, hideLetters?: boolean }) {
  return (
    <div className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold ${getStatusClasses(status)}`}>
      {!hideLetters ? letter : ''}
    </div>
  );
}

function Row({ word, solution, isComplete, hideLetters }: { word: string[], solution: string, isComplete: boolean, hideLetters?: boolean }) {
  return (
    <div className="grid grid-cols-5 gap-1">
      {word.map((letter, i) => (
        <Cell 
          key={i} 
          letter={letter} 
          status={isComplete ? getStatus(letter, i, solution) : undefined}
          hideLetters={hideLetters}
        />
      ))}
    </div>
  );
}

function getStatusClasses(status?: string) {
  switch (status) {
    case "correct":
      return "bg-green-500";
    case "present":
      return "bg-yellow-500";
    case "absent":
      return "bg-gray-400";
    default:
      return "bg-gray-200 dark:bg-gray-700";
  }
}

function getStatus(letter: string, index: number, solution: string) {
  if (letter === solution[index]) {
    return "correct";
  } else if (solution.includes(letter)) {
    return "present";
  } else {
    return "absent";
  }
} 