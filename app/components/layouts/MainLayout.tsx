'use client';

import { AdRailColumn } from '../ads/AdRailColumn';
import { GameBelowAds } from '../ads/GameBelowAds';
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
      <div className="flex w-full min-w-0 max-w-full flex-row pt-20">
        <AdRailColumn side="left" />
        <div className="min-w-0 flex-1">
          <main>
            {children}
            <GameBelowAds />
          </main>
        </div>
        <AdRailColumn side="right" />
      </div>
      <HomeContent />
      <Footer />
    </div>
  );
};

export default MainLayout; 