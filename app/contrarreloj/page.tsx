'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import MainLayout from '../components/layouts/MainLayout';
import { GameBoard } from '../components/game/GameBoard';
import { Keyboard } from '../components/game/Keyboard';
import { ErrorToast } from '../components/ui/ErrorToast';
import { api } from '../services/api';
import { BoardState, GameState } from '../types';
import { getRandomWords } from '../utils/game-utils';
import { TimeTrialEndModal } from "../components/game/TimeTrialEndModal";

const WORD_LENGTH = 5;
const GAME_DURATION = 60*5;
const MAX_ATTEMPTS = 6;
const INITIAL_WORDS = 100;

function ContrarrelojContent() {
  const [gameState, setGameState] = useState<GameState>({
    maxAttempts: MAX_ATTEMPTS,
    boards: [],
    currentGuess: "",
    gameOver: false,
    won: false,
    remainingLives: MAX_ATTEMPTS,
    showEndModal: false
  });
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dictionary, setDictionary] = useState<string[]>([]);
  const [acceptedWords, setAcceptedWords] = useState<string[]>([]);

  // Cargar diccionarios
  useEffect(() => {
    const loadDictionaries = async () => {
      const [words, accepted] = await Promise.all([
        api.getWords(WORD_LENGTH),
        api.getWords(WORD_LENGTH, true)
      ]);
      setDictionary(words.map((w: string) => w.toUpperCase()));
      setAcceptedWords(accepted.map((w: string) => w.toUpperCase()));
    };
    loadDictionaries();
  }, []);

  // Timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setGameState(prev => ({ ...prev, showEndModal: true }));
    }
  }, [timeLeft, isPlaying]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-ZÑ]$/.test(key)) {
        handleKeyDown(key);
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [isPlaying, gameState.currentGuess]);

  const startGame = () => {
    if (dictionary.length === 0) return;

    const words = getRandomWords(INITIAL_WORDS, dictionary);
    const boards: BoardState[] = words.map((word, index) => ({
      word: word.toUpperCase(),
      completed: false,
      guesses: [],
      id: index + 1
    }));

    setGameState({
      maxAttempts: MAX_ATTEMPTS,
      boards,
      currentGuess: "",
      gameOver: false,
      won: false,
      remainingLives: MAX_ATTEMPTS,
      showEndModal: false
    });
    
    setCurrentBoardIndex(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
  };

  const handleKeyDown = (key: string) => {
    if (!isPlaying) return;
    setError(null);

    const currentBoard = gameState.boards[currentBoardIndex];
    
    if (key === 'BACKSPACE') {
      setGameState(prev => ({ ...prev, currentGuess: prev.currentGuess.slice(0, -1) }));
      return;
    }

    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== WORD_LENGTH) {
        setError('La palabra debe tener 5 letras');
        return;
      }

      if (!acceptedWords.includes(gameState.currentGuess)) {
        setError('Palabra no válida');
        return;
      }

      const newGuesses = [...currentBoard.guesses, gameState.currentGuess];
      const isCorrect = gameState.currentGuess === currentBoard.word;

      const newBoards = [...gameState.boards];
      newBoards[currentBoardIndex] = {
        ...currentBoard,
        guesses: newGuesses,
        completed: isCorrect || newGuesses.length >= MAX_ATTEMPTS
      };

      if (isCorrect || newGuesses.length >= MAX_ATTEMPTS) {
        setCurrentBoardIndex(prev => prev + 1);
      }

      setGameState(prev => ({
        ...prev,
        boards: newBoards,
        currentGuess: ""
      }));

    } else if (gameState.currentGuess.length < WORD_LENGTH) {
      setGameState(prev => ({ ...prev, currentGuess: prev.currentGuess + key }));
    }
  };

  const wordsGuessed = gameState.boards.filter(board => 
    board.completed && board.guesses[board.guesses.length - 1] === board.word
  ).length;

  const getKeyboardState = () => {
    if (!gameState.boards[currentBoardIndex]) return gameState;
    
    // Solo usar el tablero actual para el estado del teclado
    return {
      ...gameState,
      boards: [gameState.boards[currentBoardIndex]]
    };
  };

  const getGameSummary = () => {
    const playedWords = gameState.boards.slice(0, currentBoardIndex + 1);
    return playedWords.map(board => ({
      word: board.word,
      solved: board.completed && board.guesses[board.guesses.length - 1] === board.word
    }));
  };

  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold mb-4">{formatTime(timeLeft)}</div>
          {!isPlaying && (
            <button
              onClick={startGame}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-primary/90"
            >
              {timeLeft === GAME_DURATION ? 'Empezar' : 'Jugar de nuevo'}
            </button>
          )}
          <div className="text-xl mt-4">Palabras adivinadas: {wordsGuessed}</div>
        </div>

        {gameState.boards.length > 0 && (
          <div className="flex flex-col items-center gap-8 w-full">
            <GameBoard
              gameState={gameState}
              board={gameState.boards[currentBoardIndex]}
              currentGuess={gameState.currentGuess}
              gameOver={false}
            />
            <Keyboard
              onKeyDown={handleKeyDown}
              gameState={getKeyboardState()}
            />
          </div>
        )}
      </div>
      <ErrorToast message={error} />
      <TimeTrialEndModal
        show={gameState.showEndModal}
        wordsGuessed={wordsGuessed}
        summary={getGameSummary()}
        onClose={() => setGameState(prev => ({ ...prev, showEndModal: false }))}
        onPlayAgain={startGame}
      />
    </div>
  );
}

export default function ContrarrelojPage() {
  return (
    <AuthProvider>
      <MainLayout>
        <ContrarrelojContent />
      </MainLayout>
    </AuthProvider>
  );
} 