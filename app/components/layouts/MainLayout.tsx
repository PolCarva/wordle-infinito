'use client';

import { useState, useCallback } from 'react';
import MainNav from '../ui/MainNav';

interface MainLayoutProps {
  children: React.ReactNode;
  onExitGame?: () => void;
}

const MainLayout = ({ children, onExitGame }: MainLayoutProps) => {
  const [exitGameCallback, setExitGameCallback] = useState<(() => void) | null>(null);

  const registerExitGameCallback = useCallback((callback: () => void) => {
    setExitGameCallback(() => callback);
  }, []);

  const handleBack = useCallback(() => {
    if (exitGameCallback) {
      exitGameCallback();
      setExitGameCallback(null);
    }
  }, [exitGameCallback]);

  return (
    <div className="min-h-screen bg-background">
      <MainNav onBack={exitGameCallback ? handleBack : undefined} />
      <main className="pt-20">
        {typeof children === 'function' 
          ? children(registerExitGameCallback) 
          : children}
      </main>
    </div>
  );
};

export default MainLayout; 