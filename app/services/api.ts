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
    }
}; 