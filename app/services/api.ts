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
}

interface GameVerificationData {
    boards: BoardData[];
    won: boolean;
    timestamp: number;
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
        // Limpiar tokens expirados
        const now = Date.now();
        Object.keys(gameVerificationTokens).forEach(key => {
            if (now - gameVerificationTokens[key].timestamp > TOKEN_EXPIRY_MS) {
                delete gameVerificationTokens[key];
            }
        });
        
        // Generar nuevo token
        const token = uuidv4();
        gameVerificationTokens[token] = {
            token,
            gameId,
            userId,
            timestamp: now,
            gameData
        };
        
        return token;
    },
    
    // Verifica que el token sea válido para la actualización
    verifyGameToken: (token: string, userId: string): boolean => {
        const entry = gameVerificationTokens[token];
        if (!entry) return false;
        
        const now = Date.now();
        // Verificar que el token no haya expirado y pertenezca al usuario correcto
        if (now - entry.timestamp > TOKEN_EXPIRY_MS || entry.userId !== userId) {
            delete gameVerificationTokens[token];
            return false;
        }
        
        return true;
    },

    updateStats: async (userId: string, stats: GameStats, verificationToken: string) => {
        // Verificar el token antes de permitir la actualización
        if (!api.verifyGameToken(verificationToken, userId)) {
            throw new Error('Token de verificación inválido o expirado');
        }
        
        // Eliminar el token después de usarlo (uso único)
        delete gameVerificationTokens[verificationToken];
        
        const response = await axios.put(`${API_URL}/users/stats/${userId}`, stats);
        return response.data;
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