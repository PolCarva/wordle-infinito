'use client';

import { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { AuthProvider } from '@/app/context/AuthContext';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        if (!isProcessing) return;

        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const username = searchParams.get('username');
        const stats = searchParams.get('stats');

        if (token && userId && email) {
            login({
                token,
                userId,
                email,
                username: username || undefined,
                stats: stats ? JSON.parse(stats) : undefined
            });
            setIsProcessing(false);
            router.replace('/');
        }
    }, [searchParams, login, router, isProcessing]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <AuthProvider>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            }>
                <AuthCallbackContent />
            </Suspense>
        </AuthProvider>
    );
} 