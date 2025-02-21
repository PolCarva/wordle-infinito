import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { AuthProvider } from '../context/AuthContext';
import MainLayout from '../components/layouts/MainLayout';

const Game = dynamic(() => import("@/app/game"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
  ssr: false
});

export default function WordlePage() {
  return (
    <AuthProvider>
      <MainLayout>
        <div className="min-h-[calc(100vh-3.5rem)] bg-background text-foreground">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Game />
          </Suspense>
        </div>
      </MainLayout>
    </AuthProvider>
  );
} 