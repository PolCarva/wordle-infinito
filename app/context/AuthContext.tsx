'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    userId: string;
    token: string;
    username?: string;
    email: string;
    imageUrl?: string;
    stats: {
        gamesPlayed: number;
        gamesWon: number;
        streak: number;
        winRate: number;
    };
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Verificar si hay un usuario en localStorage al cargar
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        const userWithStats = {
            ...userData,
            stats: userData.stats || {
                gamesPlayed: 0,
                gamesWon: 0,
                streak: 0,
                winRate: 0
            }
        };
        setUser(userWithStats);
        localStorage.setItem('user', JSON.stringify(userWithStats));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/auth');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 