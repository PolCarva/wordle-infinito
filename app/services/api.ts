import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development' ?
    'http://localhost:5000/api' :
    'https://wordle-infinito-back-production.up.railway.app/api';

export const api = {
    register: async (userData: {
        username: string;
        email: string;
        password: string;
    }) => {
        const response = await axios.post(`${API_URL}/users/register`, userData);
        return response.data;
    },

    login: async (credentials: { email: string; password: string }) => {
        const response = await axios.post(`${API_URL}/users/login`, credentials);
        return response.data;
    },

    getStats: async (userId: string) => {
        const response = await axios.get(`${API_URL}/users/stats/${userId}`);
        return response.data;
    },

    updateStats: async (userId: string, stats: {
        gamesPlayed: number;
        gamesWon: number;
        streak: number;
        winRate: number;
        versusPlayed: number;
        versusWon: number;
        versusWinRate: number;
    }) => {
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