'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/app/services/api';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = isLogin
                ? await api.login({ email: formData.email, password: formData.password })
                : await api.register(formData);

            login(data);
            router.push('/');
            router.refresh();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Algo salió mal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-foreground">
                    {isLogin ? 'Iniciar Sesión' : 'Registro'}
                </h2>
                
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-100 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-foreground">
                                Nombre de usuario
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    username: e.target.value
                                }))}
                                className="mt-1 block w-full rounded-md border border-input px-3 py-2 bg-background text-foreground"
                                required
                            />
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-foreground">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                email: e.target.value
                            }))}
                            className="mt-1 block w-full rounded-md border border-input px-3 py-2 bg-background text-foreground"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                password: e.target.value
                            }))}
                            className="mt-1 block w-full rounded-md border border-input px-3 py-2 bg-background text-foreground"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
                    </button>
                </form>

                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full text-sm text-primary hover:underline"
                >
                    {isLogin
                        ? '¿No tienes cuenta? Regístrate'
                        : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
            </div>
        </div>
    );
};

export default AuthForm; 