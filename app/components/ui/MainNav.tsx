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

  const handleBack = () => {
    // Verificar si hay un juego en progreso
    const hasCurrentGame = typeof window !== 'undefined' && localStorage.getItem('currentGame');
    
    if (hasCurrentGame) {
      // Eliminar el estado del juego
      localStorage.removeItem('currentGame');
      localStorage.removeItem('gameState');
      
      // Recargar la página para reiniciar el juego
      window.location.reload();
    } else {
      // Comportamiento normal de retroceso
      if (window.location.pathname !== '/') {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="relative z-50">
      <Nav 
        isDark={isDark} 
        onThemeToggle={handleThemeToggle}
        onBack={handleBack}
      />
    </div>
  );
};

export default MainNav; 