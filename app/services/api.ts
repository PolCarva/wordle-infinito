import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.NODE_ENV === 'development' ?
    'http://localhost:5000/api' :
    'https://wordle-infinito-back-production.up.railway.app/api';

interface RegisterData {
    username: string;
    email: string;
    password: string;
    recaptchaToken?: string;
}

interface LoginData {
    email: string;
    password: string;
    recaptchaToken?: string;
}

interface GameStats {
    gamesPlayed: number;
    gamesWon: number;
    streak: number;
    winRate: number;
    versusPlayed: number;
    versusWon: number;
    versusWinRate: number;
    versusBestStreak?: number;
}

// Definir tipos para los datos del juego
interface BoardData {
    word: string;
    completed: boolean;
    guessCount: number;
    lastGuess?: string | null;
    isCorrect?: boolean;
}

interface GameVerificationData {
    boards: BoardData[];
    won: boolean;
    timestamp: number;
    gameId?: string;
    totalBoards?: number;
    completedBoards?: number;
    maxAttempts?: number;
    currentAttempt?: number;
}

// Almacena los tokens de verificación para las actualizaciones de estadísticas
const gameVerificationTokens: Record<string, { 
    token: string, 
    gameId: string, 
    timestamp: number,
    userId: string,
    gameData: GameVerificationData
}> = {};

// Tiempo de expiración del token (5 minutos)
const TOKEN_EXPIRY_MS = 5 * 60 * 1000;

export const api = {
    register: async (userData: RegisterData) => {
        const response = await axios.post(`${API_URL}/users/register`, userData);
        return response.data;
    },

    login: async (credentials: LoginData) => {
        const response = await axios.post(`${API_URL}/users/login`, credentials);
        return response.data;
    },

    getStats: async (userId: string) => {
        const response = await axios.get(`${API_URL}/users/stats/${userId}`);
        return response.data;
    },

    // Genera un token de verificación para la actualización de estadísticas
    generateGameVerificationToken: (userId: string, gameId: string, gameData: GameVerificationData): string => {
        // Crear un objeto con los datos necesarios para la verificación
        const tokenData = {
            userId,
            gameId,
            gameData,
            timestamp: Date.now(),
            // Añadir un nonce aleatorio para prevenir ataques de repetición
            nonce: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        };
        
        // Convertir a string y codificar en base64 para transmisión
        try {
            return btoa(JSON.stringify(tokenData));
        } catch (error) {
            console.error("Error generando token:", error);
            // Fallback para navegadores que no soporten btoa con caracteres Unicode
            return btoa(unescape(encodeURIComponent(JSON.stringify(tokenData))));
        }
    },
    
    // Verifica que el token sea válido para la actualización
    verifyGameToken: (token: string, userId: string): boolean => {
        try {
            // Decodificar el token
            let tokenData;
            try {
                tokenData = JSON.parse(atob(token));
            } catch (e) {
                // Fallback para navegadores que no soporten atob con caracteres Unicode
                tokenData = JSON.parse(decodeURIComponent(escape(atob(token))));
            }
            
            // Verificaciones básicas
            if (!tokenData || !tokenData.userId || tokenData.userId !== userId) {
                console.error("Token inválido: usuario incorrecto");
                return false;
            }
            
            // Verificar que no haya pasado demasiado tiempo (5 minutos)
            const MAX_TOKEN_AGE = 5 * 60 * 1000; // 5 minutos
            if (!tokenData.timestamp || Date.now() - tokenData.timestamp > MAX_TOKEN_AGE) {
                console.error("Token inválido: expirado");
                return false;
            }
            
            // Verificar que el token tenga todos los campos necesarios
            if (!tokenData.gameId || !tokenData.gameData || !tokenData.nonce) {
                console.error("Token inválido: faltan campos");
                return false;
            }
            
            return true;
        } catch (error) {
            console.error("Error verificando token:", error);
            return false;
        }
    },

    updateStats: async (userId: string, stats: GameStats, verificationToken: string) => {
        // Verificar el token antes de permitir la actualización
        if (!api.verifyGameToken(verificationToken, userId)) {
            throw new Error('Token de verificación inválido o expirado');
        }
        
        // Extraer los datos del juego del token
        try {
            // Decodificar el token para obtener los datos del juego
            let tokenData;
            try {
                tokenData = JSON.parse(atob(verificationToken));
            } catch (e) {
                // Fallback para navegadores que no soporten atob con caracteres Unicode
                tokenData = JSON.parse(decodeURIComponent(escape(atob(verificationToken))));
            }
            
            const gameData = tokenData.gameData;
            
            console.log("Enviando actualización de estadísticas:", {
                userId,
                statsResumen: {
                    gamesPlayed: stats.gamesPlayed,
                    gamesWon: stats.gamesWon,
                    streak: stats.streak,
                    winRate: stats.winRate
                },
                gameDataResumen: {
                    boardCount: gameData.boards.length,
                    won: gameData.won,
                    timestamp: new Date(gameData.timestamp).toISOString()
                }
            });
            
            // Enviar tanto las estadísticas como los datos de verificación
            const response = await axios.put(`${API_URL}/users/stats/${userId}`, {
                ...stats,
                verificationToken,
                gameData
            });
            
            console.log("Respuesta del servidor:", response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error de red:", error.message);
                console.error("Detalles:", error.response?.data);
                throw new Error(`Error de servidor: ${error.response?.data?.message || error.message}`);
            } else {
                console.error("Error procesando token:", error);
                throw new Error('Error al procesar datos de verificación');
            }
        }
    },

    getProfile: async (userId: string) => {
        const response = await axios.get(`${API_URL}/users/profile/${userId}`);
        return response.data;
    },

    createVersusGame: async (userId: string | undefined, wordLength: number = 5) => {
        const response = await axios.post(`${API_URL}/versus/create`, { 
            userId: userId || null,  // Enviar null si no hay userId
            wordLength 
        });
        return response.data;
    },

    joinVersusGame: async (gameCode: string, userId: string) => {
        const response = await axios.post(`${API_URL}/versus/join`, { gameCode, userId });
        return response.data;
    },

    makeGuess: async (gameId: string, userId: string, guess: string) => {
        const response = await axios.post(`${API_URL}/versus/guess`, { gameId, userId, guess });
        return response.data;
    },

    getVersusGame: async (gameId: string) => {
        const response = await axios.get(`${API_URL}/versus/game/${gameId}`);
        return response.data;
    },

    setReady: async (gameId: string, userId: string) => {
        const response = await axios.post(`${API_URL}/versus/ready`, { gameId, userId });
        return response.data;
    },

    getAvailableLengths: async () => {
        const response = await axios.get(`${API_URL}/dictionary/available-lengths`);
        return response.data.lengths;
    },

    getGameConfig: async (length: number) => {
        const response = await axios.get(`${API_URL}/dictionary/config/${length}`);
        return response.data;
    },

    getWords: async (length: number, includeRare = false) => {
        const response = await axios.get(
            `${API_URL}/dictionary/words/${length}?rare=${includeRare}`
        );
        return response.data.words;
    },

    getLeaderboard: async () => {
        const response = await axios.get(`${API_URL}/users/leaderboard`);
        return response.data;
    },

    getBoluWords: async () => {
        const response = await axios.get(`${API_URL}/dictionary/boludle-words`);
        return {
            words: response.data.words,
            description: response.data.description
        };
    },

    requestRematch: async (gameId: string, userId: string) => {
        const response = await axios.post(`${API_URL}/versus/rematch/${gameId}`, { userId });
        return response.data;
    },

    cancelRematch: async (gameId: string, userId: string) => {
        const response = await axios.post(`${API_URL}/versus/cancel-rematch/${gameId}`, { userId });
        return response.data;
    }
}; 