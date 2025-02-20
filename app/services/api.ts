import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
    }) => {
        const response = await axios.put(`${API_URL}/users/stats/${userId}`, stats);
        return response.data;
    },

    getProfile: async (userId: string) => {
        const response = await axios.get(`${API_URL}/users/profile/${userId}`);
        return response.data;
    }
}; 