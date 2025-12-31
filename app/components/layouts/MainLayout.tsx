'use client';

import { HomeContent } from '../HomeContent';
import MainNav from '../ui/MainNav';
import { Footer } from '../ui/Footer';

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
      <Footer />
    </div>
  );
};

export default MainLayout; 