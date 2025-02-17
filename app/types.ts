export type LetterState = "correct" | "present" | "absent" | "empty"

export type BoardState = {
  word: string
  completed: boolean
  guesses: string[]
}

export type GameState = {
  boards: BoardState[]
  currentGuess: string
  gameOver: boolean
  won: boolean
  maxAttempts: number
  remainingLives: number
  showEndModal: boolean
}

