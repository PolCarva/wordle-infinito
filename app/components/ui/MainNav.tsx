'use client';

import { useRouter } from 'next/navigation';
import { Nav } from '../game/Nav';
import { useTheme } from 'next-themes';

const MainNav = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="relative z-50">
      <Nav 
        isDark={isDark} 
        onThemeToggle={handleThemeToggle}
        onBack={() => router.back()}
      />
    </div>
  );
};

export default MainNav; 