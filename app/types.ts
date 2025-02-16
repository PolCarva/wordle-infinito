export type LetterState = "correct" | "present" | "absent" | "empty"

export interface BoardState {
  word: string
  completed: boolean
  guesses: string[]
}

export interface GameState {
  boards: BoardState[]
  currentGuess: string
  gameOver: boolean
  won: boolean
  maxAttempts: number
}

