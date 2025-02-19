import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { HomeContent } from './components/ui/HomeContent';
import { AuthProvider } from './context/AuthContext';

const Game = dynamic(() => import("@/app/game"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
  ssr: false
});

export default function Page() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Game />
        </Suspense>
        <HomeContent />
      </div>
    </AuthProvider>
  )
}

