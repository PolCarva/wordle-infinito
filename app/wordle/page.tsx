'use client';

import Game from "@/app/game";
import { AuthProvider } from '../context/AuthContext';
import MainLayout from '../components/layouts/MainLayout';

export default function WordlePage() {
  return (
    <AuthProvider>
      <MainLayout>
        <div className="min-h-[calc(100vh-3.5rem)] bg-background text-foreground">
          <Game />
        </div>
      </MainLayout>
    </AuthProvider>
  );
} 