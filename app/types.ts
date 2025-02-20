export type LetterState = "correct" | "present" | "absent" | "empty"

export interface BoardState {
  word: string
  completed: boolean
  guesses: string[]
  id: number
}

export interface GameState {
  maxAttempts: number
  boards: BoardState[]
  currentGuess: string
  gameOver: boolean
  won: boolean
  remainingLives: number
  showEndModal: boolean
  hideLetters?: boolean
}

