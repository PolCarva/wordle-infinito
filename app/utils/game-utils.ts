import { WORD_LIST } from "../word-list";
import { LetterState } from "../types";

export function getRandomWords(count: number): string[] {
  const words = [...WORD_LIST].map((word) => word.toUpperCase());
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * words.length);
    selected.push(words[index]);
    words.splice(index, 1);
  }
  return selected;
}

export function checkGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(5).fill("absent");
  const answerChars = answer.split("");
  const guessChars = guess.split("");

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = "correct";
      answerChars[i] = "";
      guessChars[i] = "";
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guessChars[i] && answerChars.includes(guessChars[i])) {
      result[i] = "present";
      answerChars[answerChars.indexOf(guessChars[i])] = "";
    }
  }

  return result;
} 