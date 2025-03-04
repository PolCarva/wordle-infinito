'use client';

import { HomeContent } from '../HomeContent';
import MainNav from '../ui/MainNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="pt-20">
        {children}
      </main>
      <HomeContent />
    </div>
  );
};

export default MainLayout; 