"use client";

import { Button } from "@/app/components/ui/button";
import { GameState, LetterState } from "@/app/types";
import { CornerDownLeftIcon, DeleteIcon } from "lucide-react";

interface KeyboardProps {
  onKeyDown: (key: string) => void;
  gameState: GameState;
}

export function Keyboard({ onKeyDown, gameState }: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const getLetterStateInBoard = (letter: string, boardIndex: number) => {
    const board = gameState.boards[boardIndex];
    let state: LetterState = "empty";

    board.guesses.forEach((guess) => {
      const letterPositions = Array.from(guess).map((char, idx) => ({
        char,
        idx,
      }));
      letterPositions.forEach(({ char, idx }) => {
        if (char !== letter) return;
        if (board.word[idx] === letter) {
          state = "correct";
        } else if (board.word.includes(letter) && state !== "correct") {
          state = "present";
        } else if (state === "empty") {
          state = "absent";
        }
      });
    });

    return state;
  };

  const getGradientBackground = (letter: string) => {
    if (letter === "ENTER" || letter === "BACKSPACE") {
      return "bg-slate-500 dark:bg-slate-300";
    }

    const boardCount = gameState.boards.length;
    if (boardCount === 0) return "bg-slate-400";

    // Caso especial para 1 tablero
    if (boardCount === 1) {
      const state = getLetterStateInBoard(letter, 0) as LetterState;
      const color =
        state === "correct"
          ? "rgb(34 197 94)"
          : state === "present"
          ? "rgb(234 179 8)"
          : state === "absent"
          ? "rgb(156 163 175)"
          : "rgb(229 231 235)";

      return {
        backgroundImage: `linear-gradient(0deg, ${color}, ${color})`,
        backgroundSize: "100% 100%"
      };
    }

    // Caso especial para 2 tableros
    if (boardCount === 2) {
      const gradients = gameState.boards.map((_, index) => {
        const state = getLetterStateInBoard(letter, index) as LetterState;
        const color =
          state === "correct"
            ? "rgb(34 197 94)"
            : state === "present"
            ? "rgb(234 179 8)"
            : state === "absent"
            ? "rgb(156 163 175)"
            : "rgb(229 231 235)";

        return `linear-gradient(0deg, ${color}, ${color})`;
      });

      return {
        backgroundImage: gradients.join(", "),
        backgroundRepeat: "no-repeat",
        backgroundSize: "50% 100%",
        backgroundPosition: "0% 0%, 100% 0%",
      };
    }

    // Lógica para 3 o más tableros
    const getOptimalGrid = (count: number) => {
      const sqrt = Math.sqrt(count);
      const cols = Math.ceil(sqrt);
      const rows = Math.ceil(count / cols);
      return { rows, cols };
    };

    const { rows: gridRows, cols: gridCols } = getOptimalGrid(boardCount);
    const cellWidth = 100 / (gridCols - 1 || 1);
    const cellHeight = 100 / (gridRows - 1 || 1);

    const gradients = gameState.boards.map((_, index) => {
      const state = getLetterStateInBoard(letter, index) as LetterState;
      const color =
        state === "correct"
          ? "rgb(34 197 94)"
          : state === "present"
          ? "rgb(234 179 8)"
          : state === "absent"
          ? "rgb(156 163 175)"
          : "rgb(229 231 235)";

      return `linear-gradient(0deg, ${color}, ${color})`;
    });

    const positions = gameState.boards.map((_, index) => {
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;
      const x = Math.min(col * cellWidth, 100);
      const y = Math.min(row * cellHeight, 100);
      return `${x}% ${y}%`;
    });

    return {
      backgroundImage: gradients.join(", "),
      backgroundRepeat: "no-repeat",
      backgroundSize: `${100 / gridCols}% ${100 / gridRows}%`,
      backgroundPosition: positions.join(", "),
    };
  };

  const handleClick = (key: string) => {
    onKeyDown(key);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-2">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 my-1">
          {row.map((key) => {
            const style = getGradientBackground(key.toUpperCase());
            return (
              <Button
                key={key}
                onClick={() => handleClick(key)}
                className={`
                  !bg-gray-200 text-gray-800 dark:!bg-gray-400
                  ${
                    key === "ENTER" || key === "BACKSPACE"
                      ? "px-2 text-xs max-w-[13vw] min-[375px]:max-w-16 w-full"
                      : "w-8 max-w-[8.5vw] min-[375px]:max-w-none md:w-10 !px-0"
                  } h-14 font-bold`}
                style={typeof style === "string" ? {} : style}
                disabled={gameState.gameOver}
              >
                <div className="flex items-center justify-center w-full h-full">
                  {key === "BACKSPACE" ? (
                    <DeleteIcon className="h-5 w-5" />
                  ) : key === "ENTER" ? (
                    <CornerDownLeftIcon className="h-5 w-5" />
                  ) : (
                    key
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
