'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from "../context/AuthContext";
import MainLayout from "../components/layouts/MainLayout";
import { GameBoard } from "../components/game/GameBoard";
import { Keyboard } from "../components/game/Keyboard";
import { GameState } from "../types";
import { api } from '../services/api';
import { EndGameModal } from "../components/game/EndGameModal";
import { ErrorToast } from "../components/ui/ErrorToast";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

function getInitialState(): GameState {
  return {
    maxAttempts: MAX_ATTEMPTS,
    boards: [{
      word: "",
      completed: false,
      guesses: [],
      id: 1
    }],
    currentGuess: "",
    gameOver: false,
    won: false,
    remainingLives: MAX_ATTEMPTS,
    showEndModal: false
  };
}

function BoluldleContent() {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [dictionary, setDictionary] = useState<string[]>([]);
  const [boluldeDictionary, setBoluldeDictionary] = useState<string[]>([]);
  const [currentWordDesc, setCurrentWordDesc] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDictionaries = async () => {
      try {
        // Cargar el diccionario combinado que incluye palabras normales y del boludle
        const { words: boluWords, description } = await api.getBoluWords();
        const allWords = await api.getWords(WORD_LENGTH, true);
        
        // Combinar y eliminar duplicados
        const combinedDictionary = Array.from(new Set([...allWords, ...boluWords]));
        
        setDictionary(combinedDictionary);
        setBoluldeDictionary(boluWords);
        
        const randomIndex = Math.floor(Math.random() * boluWords.length);
        const randomWord = boluWords[randomIndex];
        setCurrentWordDesc(description[randomIndex]);
        
        setGameState(prev => ({
          ...prev,
          boards: [{
            ...prev.boards[0],
            word: randomWord.toUpperCase()
          }]
        }));
      } catch (error) {
        console.error('Error cargando los diccionarios:', error);
      }
    };
    loadDictionaries();
  }, []);
  const handleKeyDown = (key: string) => {
    if (gameState.gameOver) return;

    if (key === 'ENTER') {
      if (gameState.currentGuess.length !== WORD_LENGTH) {
        setError(`La palabra debe tener ${WORD_LENGTH} letras`);
        return;
      }
      
      const guess = gameState.currentGuess.toUpperCase();
      if (!dictionary.includes(guess)) {
        setError("Palabra no válida");
        return;
      }

      const newGuesses = [...gameState.boards[0].guesses, guess];
      const isCorrect = guess === gameState.boards[0].word;
      const isGameOver = isCorrect || newGuesses.length >= MAX_ATTEMPTS;

      setGameState(prev => ({
        ...prev,
        boards: [{
          ...prev.boards[0],
          guesses: newGuesses,
          completed: isGameOver
        }],
        currentGuess: '',
        gameOver: isGameOver,
        won: isCorrect,
        showEndModal: isGameOver
      }));

    } else if (key === 'BACKSPACE') {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1)
      }));

    } else if (gameState.currentGuess.length < WORD_LENGTH) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key
      }));
    }
  };
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      
      if (key === 'ENTER' || key === 'BACKSPACE' || key === 'DELETE') {
        handleKeyDown(key === 'DELETE' ? 'BACKSPACE' : key);
      } else if (/^[A-ZÑ]$/.test(key)) {
        handleKeyDown(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);



  const handleReset = () => {
    // Usar el diccionario de Boludle para la nueva palabra
    const randomWord = boluldeDictionary[Math.floor(Math.random() * boluldeDictionary.length)];
    setGameState({
      ...getInitialState(),
      boards: [{
        word: randomWord.toUpperCase(),
        completed: false,
        guesses: [],
        id: 1
      }]
    });
  };


  // Limpiar el error después de un tiempo
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      <div className="flex flex-col items-center gap-8 p-4">
        <h1 className="text-4xl font-bold text-center">Boludle</h1>
        {process.env.NODE_ENV === 'development' && (
          <div className="text-lg font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p>Solución: {gameState.boards[0].word}</p>
          </div>
        )}
        <div className="w-full max-w-sm">
          <GameBoard 
            gameState={gameState}
            board={gameState.boards[0]}
            currentGuess={gameState.currentGuess}
            gameOver={gameState.gameOver}
          />
          <Keyboard
            onKeyDown={handleKeyDown}
            gameState={gameState}
          />
        </div>
      </div>
      <ErrorToast message={error} />
      <EndGameModal
        show={gameState.showEndModal}
        solution={gameState.boards[0].word}
        won={gameState.won}
        boards={gameState.boards}
        description={currentWordDesc}
        onClose={() => setGameState(prev => ({ ...prev, showEndModal: false }))}
        onPlayAgain={handleReset}
      />
    </>
  );
}

export default function BoluldlePage() {
  return (
    <AuthProvider>
      <MainLayout>
        <BoluldleContent />
      </MainLayout>
    </AuthProvider>
  );
} 