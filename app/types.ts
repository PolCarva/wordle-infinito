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

export interface User {
    userId: string;
    username?: string;
    email: string;
    imageUrl?: string;
    stats: {
        gamesPlayed: number;
        gamesWon: number;
        streak: number;
        winRate: number;
        versusPlayed: number;
        versusWon: number;
        versusWinRate: number;
    };
}

