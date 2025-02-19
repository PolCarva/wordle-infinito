import { getDictionary } from "@/app/dictionaries";
import { LetterState } from "../types";

export const getRandomWords = (count: number, useRareWords = false, wordLength = 5) => {
  const dictionary = getDictionary(wordLength, useRareWords);
  const words = [...dictionary];
  const result = [];

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * words.length);
    result.push(words.splice(index, 1)[0]);
  }

  return result;
};

export function checkGuess(guess: string, answer: string): LetterState[] {
  const length = answer.length;
  const result: LetterState[] = Array(length).fill("absent");
  const answerChars = answer.split("");
  const guessChars = guess.split("");

  for (let i = 0; i < length; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = "correct";
      answerChars[i] = "";
      guessChars[i] = "";
    }
  }

  for (let i = 0; i < length; i++) {
    if (guessChars[i] && answerChars.includes(guessChars[i])) {
      result[i] = "present";
      answerChars[answerChars.indexOf(guessChars[i])] = "";
    }
  }

  return result;
} 