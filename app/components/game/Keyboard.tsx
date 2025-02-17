"use client";

import { Button } from "@/app/components/ui/button";
import { GameState, LetterState } from "@/app/types";
import { CornerDownLeftIcon, DeleteIcon } from "lucide-react";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  gameState: GameState;
}

export function Keyboard({ onKeyPress, gameState }: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const getLetterStates = (letter: string): LetterState => {
    let highestState: LetterState = "empty";
    let isUsed = false;

    gameState.boards.forEach((board) => {
      board.guesses.forEach((guess) => {
        const letterPositions = Array.from(guess).map((char, idx) => ({
          char,
          idx,
        }));
        letterPositions.forEach(({ char, idx }) => {
          if (char !== letter) return;
          isUsed = true;
          if (board.word[idx] === letter) {
            highestState = "correct";
          } else if (
            board.word.includes(letter) &&
            highestState !== "correct"
          ) {
            highestState = "present";
          } else if (highestState === "empty") {
            highestState = "absent";
          }
        });
      });
    });

    return isUsed ? highestState : "empty";
  };

  const getKeyBackground = (letter: string): string => {
    if (letter === "ENTER" || letter === "BACKSPACE")
      return "bg-slate-500 dark:bg-slate-300";

    const state = getLetterStates(letter.toUpperCase());
    switch (state) {
      case "correct":
        return "bg-green-500 text-white";
      case "present":
        return "bg-yellow-500 text-white";
      case "absent":
        return "bg-gray-500 text-white dark:bg-slate-600";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="grid gap-1 max-w-[calc(100svw-10px)] mt-4">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`${
                key === "ENTER" || key === "BACKSPACE"
                  ? "px-2 text-xs w-full"
                  : "w-8 md:w-10"
              } h-14 font-bold ${getKeyBackground(key)}`}
              disabled={gameState.gameOver}
            >
              {key === "BACKSPACE" ? (
                <DeleteIcon />
              ) : key === "ENTER" ? (
                <CornerDownLeftIcon />
              ) : (
                key
              )}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
} 