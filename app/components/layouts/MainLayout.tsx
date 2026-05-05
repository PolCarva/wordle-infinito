'use client';

import { AdRailColumn } from '../ads/AdRailColumn';
import { GameBelowAds } from '../ads/GameBelowAds';
import { HomeContent } from '../HomeContent';
import MainNav from '../ui/MainNav';
import { Footer } from '../ui/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  showAds?: boolean;
  showHomeContent?: boolean;
}

const MainLayout = ({
  children,
  showAds = false,
  showHomeContent = false,
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="flex w-full min-w-0 max-w-full flex-row pt-20">
        {showAds ? <AdRailColumn side="left" /> : null}
        <div className="min-w-0 flex-1">
          <main>
            {children}
            {showAds ? <GameBelowAds /> : null}
          </main>
        </div>
        {showAds ? <AdRailColumn side="right" /> : null}
      </div>
      {showHomeContent ? <HomeContent /> : null}
      <Footer />
    </div>
  );
};

export default MainLayout; 