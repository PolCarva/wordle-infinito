'use client';

import { Nav } from '../game/Nav';
import { useTheme } from 'next-themes';

const MainNav = () => {
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
      />
    </div>
  );
};

export default MainNav; 