import { getDictionary } from "@/app/dictionaries";
import { LetterState } from "../types";

export function getRandomWords(count: number, dictionary: string[]): string[] {
    const shuffled = [...dictionary].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

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