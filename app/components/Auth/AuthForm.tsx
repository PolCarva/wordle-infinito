'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/app/services/api';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';

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

    const handleContinueWithoutAuth = () => {
        router.push('/');
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/users/auth/google';
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

                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-2 px-4 bg-white text-gray-800 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                    <FcGoogle className="w-5 h-5" />
                    Continuar con Google
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-gray-500">O</span>
                    </div>
                </div>

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

                <div className="space-y-4">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="w-full text-sm text-primary hover:underline"
                    >
                        {isLogin
                            ? '¿No tienes cuenta? Regístrate'
                            : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>

                    <button
                        onClick={handleContinueWithoutAuth}
                        className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:underline"
                    >
                        Continuar sin identificarse
                    </button>

                    <div className="text-xs text-gray-500 text-center space-x-1">
                        <span>Al continuar, aceptas nuestros</span>
                        <Link href="/terms" className="text-primary hover:underline">
                            Términos de Servicio
                        </Link>
                        <span>y</span>
                        <Link href="/privacy" className="text-primary hover:underline">
                            Política de Privacidad
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm; 