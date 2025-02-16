"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WORD_LIST } from "./word-list";
import { ACCEPTED_WORDS } from "./accepted-words";
import {
  CornerDownLeftIcon,
  DeleteIcon,
} from "lucide-react";
import ThemeButton from "@/components/ThemeButton";

type LetterState = "correct" | "present" | "absent" | "empty";

type BoardState = {
  word: string;
  completed: boolean;
  guesses: string[];
};

type GameState = {
  boards: BoardState[];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
  maxAttempts: number;
};

function getRandomWords(count: number): string[] {
  const words = [...WORD_LIST].map((word) => word.toUpperCase());
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * words.length);
    selected.push(words[index]);
    words.splice(index, 1);
  }
  return selected;
}

function checkGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(5).fill("absent");
  const answerChars = answer.split("");
  const guessChars = guess.split("");

  // Check for correct positions first
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = "correct";
      answerChars[i] = "";
      guessChars[i] = "";
    }
  }

  // Check for present letters
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] && answerChars.includes(guessChars[i])) {
      result[i] = "present";
      answerChars[answerChars.indexOf(guessChars[i])] = "";
    }
  }

  return result;
}

function GameBoard({
  board,
  currentGuess,
  gameOver,
  gameState,
}: {
  board: BoardState;
  currentGuess: string;
  gameOver: boolean;
  gameState: GameState;
}) {
  const rows = Array(gameState.maxAttempts)
    .fill(null)
    .map((_, i) => {
      if (i < board.guesses.length) {
        return checkGuess(board.guesses[i], board.word);
      }
      if (i === board.guesses.length && !board.completed && !gameOver) {
        return currentGuess
          .padEnd(5, " ")
          .split("")
          .map(() => "empty" as const);
      }
      return Array(5).fill("empty" as const);
    });

  return (
    <div
      className={`p-4 rounded-lg border ${
        board.completed ? "border-green-500" : "border-gray-500"
      }`}
    >
      <div className="grid gap-1">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((state, j) => {
              const letter =
                i < board.guesses.length
                  ? board.guesses[i][j]
                  : currentGuess[j];
              return (
                <div
                  key={j}
                  className={`flex w-12 items-center justify-center text-xl font-bold rounded
              ${
                state === "correct"
                  ? "bg-green-500"
                  : state === "present"
                  ? "bg-yellow-500"
                  : state === "absent"
                  ? "bg-gray-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }
              ${
                i === board.guesses.length && !board.completed
                  ? "h-12"
                  : "h-[3vh] text-xs"
              } 
              ${i > board.guesses.length ? "text-transparent" : ""}`}
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

function Keyboard({
  onKeyPress,
  gameState,
}: {
  onKeyPress: (key: string) => void;
  gameState: GameState;
}) {
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
    });
    setStarted(true);
    setError(null);
  };

  const handleGuess = useCallback(() => {
    if (!gameState || gameState.currentGuess.length !== 5) return;

    const normalizedGuess = gameState.currentGuess.toUpperCase();

    if (!ACCEPTED_WORDS.includes(normalizedGuess)) {
      setError("Not in word list");
      return;
    }

    const newBoards = gameState.boards.map((board) => {
      if (board.completed) return board;

      return {
        ...board,
        guesses: [...board.guesses, normalizedGuess],
        completed: normalizedGuess === board.word,
      };
    });

    const allCompleted = newBoards.every((board) => board.completed);
    const attemptsExhausted =
      newBoards[0].guesses.length >= gameState.maxAttempts;

    setGameState({
      ...gameState,
      boards: newBoards,
      currentGuess: "",
      gameOver: allCompleted || attemptsExhausted,
      won: allCompleted,
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
    <div className="flex w-full flex-col items-center gap-6 p-4 pt-10">
      <ThemeButton />

      <h1 className="text-4xl font-bold">Multi-Wordle</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 animate-fade-out">
          <div className="bg-red-500 text-white font-bold py-2 px-4 rounded">
            {error}
          </div>
        </div>
      )}
      <Keyboard onKeyPress={handleKeyPress} gameState={gameState} />
      {gameState.gameOver && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {gameState.won ? "¡Ganaste!" : "¡Perdiste!"}
          </h2>
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
          <Button onClick={initializeGame}>Jugar de nuevo</Button>
        </div>
      )}
    </div>
  );
}
