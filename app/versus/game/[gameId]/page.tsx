'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth, AuthProvider } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { GameBoard } from '@/app/components/game/GameBoard';
import { Keyboard } from '@/app/components/game/Keyboard';
import { api } from '@/app/services/api';
import { Button } from '@/app/components/ui/button';
import { Copy, ArrowLeft, Settings, Swords } from 'lucide-react';
import { Nav } from '@/app/components/game/Nav';
import { useTheme } from 'next-themes';

interface VersusGame {
    _id: string;
    word: string;
    creator: string;
    opponent: string;
    creatorGuesses: string[];
    opponentGuesses: string[];
    status: 'waiting_opponent' | 'ready_to_start' | 'playing' | 'finished';
    winner?: string;
    creatorReady: boolean;
    opponentReady: boolean;
    gameCode: string;
}

function GameContent({ gameId }: { gameId: string }) {
    const { user } = useAuth();
    const router = useRouter();
    const [game, setGame] = useState<VersusGame | null>(null);
    const [currentGuess, setCurrentGuess] = useState('');
    const [error, setError] = useState('');
    const { theme, setTheme } = useTheme();

    const handleGuess = useCallback(async () => {
        if (!game) return;
        const wordLength = game.word.length;

        if (currentGuess.length !== wordLength) {
            setError(`La palabra debe tener ${wordLength} letras`);
            return;
        }

        try {
            const response = await api.makeGuess(gameId, user!.userId, currentGuess.toUpperCase());
            setGame(response.game);
            setCurrentGuess('');
            setError('');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Error al realizar el intento');
        }
    }, [currentGuess, gameId, user, game]);

    useEffect(() => {
        const loadGame = async () => {
            try {
                const response = await api.getVersusGame(gameId);
                setGame(response);
            } catch (error) {
                console.error('Error loading game:', error);
                router.push('/versus');
            }
        };

        loadGame();
        const interval = setInterval(loadGame, 2000);
        return () => clearInterval(interval);
    }, [gameId, router]);

    useEffect(() => {
        if (game?.status !== 'playing' || game.winner) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toUpperCase();
            const wordLength = game.word.length;

            if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-ZÑ]$/.test(key)) {
                event.preventDefault();
            }

            if (key === 'ENTER') {
                handleGuess();
            } else if (key === 'BACKSPACE' || key === 'DELETE') {
                setCurrentGuess(prev => prev.slice(0, -1));
            } else if (/^[A-ZÑ]$/.test(key) && currentGuess.length < wordLength) {
                setCurrentGuess(prev => prev + key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [game?.status, game?.winner, game?.word.length, currentGuess, handleGuess]);

    const handleBack = () => {
        if (game?.status === 'playing' && !game.winner) {
            if (window.confirm('¿Estás seguro de que quieres abandonar la partida?')) {
                router.push('/');
            }
        } else {
            router.push('/');
        }
    };

    const handleThemeToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    if (!user || !game) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const isCreator = game.creator === user.userId;
    const myGuesses = isCreator ? game.creatorGuesses : game.opponentGuesses;
    const opponentGuesses = isCreator ? game.opponentGuesses : game.creatorGuesses;

    const myBoard = {
        word: game.word,
        guesses: myGuesses,
        completed: Boolean(game.winner === user.userId),
        id: 0
    } as const;

    const opponentBoard = {
        word: game.word,
        guesses: opponentGuesses,
        completed: Boolean(game.winner && game.winner !== user.userId),
        id: 1
    } as const;

    const handleReady = async () => {
        try {
            const response = await api.setReady(gameId, user!.userId);
            setGame(response);
        } catch (error) {
            setError('Error marcando como listo');
        }
    };

    if (game.status === 'waiting_opponent') {
        return (
            <div className="min-h-screen bg-background">
                <Nav
                    onBack={handleBack}
                    isDark={theme === 'dark'}
                    onThemeToggle={handleThemeToggle}
                />
                <div className="max-w-md mx-auto px-4 py-16">
                    <div className="text-center space-y-6">
                        <h2 className="text-2xl font-bold">Esperando oponente</h2>
                        <div className="bg-card p-6 rounded-lg shadow-lg space-y-4">
                            <p className="text-gray-600">
                                Comparte este código con tu oponente:
                            </p>
                            <div className="flex items-center justify-center space-x-2">
                                <p className="text-3xl font-mono font-bold tracking-wider">
                                    {game.gameCode}
                                </p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(game.gameCode);
                                        // Opcional: mostrar mensaje de copiado
                                    }}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                                >
                                    <Copy className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="animate-pulse text-gray-500">
                            Esperando que el oponente se una...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (game.status === 'ready_to_start') {
        const isReady = isCreator ? game.creatorReady : game.opponentReady;
        const otherReady = isCreator ? game.opponentReady : game.creatorReady;
        const otherPlayerName = isCreator ? 'Oponente' : 'Creador';

        return (
            <div className="min-h-screen bg-background">
                <Nav
                    onBack={handleBack}
                    isDark={theme === 'dark'}
                    onThemeToggle={handleThemeToggle}
                />
                <div className="max-w-md mx-auto px-4 py-16">
                    <div className="text-center space-y-6">
                        <h2 className="text-2xl font-bold">Preparando partida</h2>
                        <div className="bg-card p-6 rounded-lg shadow-lg space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-4">
                                    <span>Tu estado:</span>
                                    <span className="font-medium">
                                        {isReady ? 
                                            <span className="text-green-500">✓ Listo</span> : 
                                            <span className="text-yellow-500">Esperando...</span>
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center justify-between px-4">
                                    <span>{otherPlayerName}:</span>
                                    <span className="font-medium">
                                        {otherReady ? 
                                            <span className="text-green-500">✓ Listo</span> : 
                                            <span className="text-yellow-500">Esperando...</span>
                                        }
                                    </span>
                                </div>
                                {!isReady && (
                                    <Button 
                                        onClick={handleReady}
                                        className="w-full mt-4"
                                    >
                                        Estoy listo
                                    </Button>
                                )}
                                {isReady && !otherReady && (
                                    <div className="animate-pulse text-gray-500 mt-4">
                                        Esperando que el otro jugador esté listo...
                                    </div>
                                )}
                                {isReady && otherReady && (
                                    <div className="text-green-500 mt-4">
                                        ¡Comenzando partida!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Nav
                onBack={handleBack}
                isDark={theme === 'dark'}
                onThemeToggle={handleThemeToggle}
            />
            <div className="p-4 pt-20">
                <div className="max-w-2xl mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h2 className="text-center mb-4">Tú</h2>
                            <GameBoard
                                board={myBoard}
                                currentGuess={currentGuess}
                                gameOver={Boolean(game.winner)}
                                gameState={{
                                    maxAttempts: 6,
                                    boards: [myBoard],
                                    currentGuess,
                                    gameOver: Boolean(game.winner),
                                    won: Boolean(game.winner === user.userId),
                                    remainingLives: 1,
                                    showEndModal: false
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-center mb-4">Oponente</h2>
                            <GameBoard
                                board={opponentBoard}
                                currentGuess=""
                                gameOver={Boolean(game.winner)}
                                gameState={{
                                    maxAttempts: 6,
                                    boards: [opponentBoard],
                                    currentGuess: "",
                                    gameOver: Boolean(game.winner),
                                    won: Boolean(game.winner && game.winner !== user.userId),
                                    remainingLives: 1,
                                    showEndModal: false,
                                    hideLetters: true
                                }}
                            />
                        </div>
                    </div>

                    {game.status === 'playing' && !game.winner && (
                        <>
                            <div className="mt-8">
                                <Keyboard
                                    onKeyDown={(key: string) => {
                                        if (key === 'ENTER') {
                                            handleGuess();
                                        } else if (key === 'BACKSPACE') {
                                            setCurrentGuess(prev => prev.slice(0, -1));
                                        } else if (currentGuess.length < game.word.length) {
                                            setCurrentGuess(prev => prev + key);
                                        }
                                    }}
                                    gameState={{
                                        maxAttempts: 6,
                                        boards: [myBoard],
                                        currentGuess,
                                        gameOver: Boolean(game.winner),
                                        won: Boolean(game.winner === user.userId),
                                        remainingLives: 1,
                                        showEndModal: false
                                    }}
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-center mt-4">{error}</p>
                            )}
                        </>
                    )}

                    {game.winner && (
                        <div className="text-center mt-8">
                            <h2 className="text-2xl font-bold">
                                {game.winner === user.userId ? '¡Ganaste!' : '¡Perdiste!'}
                            </h2>
                            <p className="mt-2">La palabra era: {game.word}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VersusGamePage({ params }: { params: { gameId: string } }) {
    return <GameContent gameId={params.gameId} />;
} 