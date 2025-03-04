"use client";

import { Button } from "@/app/components/ui/button";
import {
  Settings,
  Moon,
  Sun,
  LogIn,
  LogOut,
  Home,
  Pencil,
  Trophy
} from "lucide-react";
import { Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { LeaderboardModal } from "@/app/components/ui/LeaderboardModal";

interface NavProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

function getInitials(
  name: string | undefined,
  email: string | undefined
): string {
  if (name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  // Si no hay nombre ni email, devolver valor por defecto
  if (!email) return "US";

  // Si hay email, usar las primeras dos letras
  return email.slice(0, 2).toUpperCase();
}

export function Nav({ isDark, onThemeToggle }: NavProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showShareMessage, setShowShareMessage] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    // Limpiar el localStorage para evitar que se restaure el juego
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gameState');
      localStorage.removeItem('currentGame');
    }

    // Redirección simple a la página principal
    window.location.href = '/';
  };

  const handleShare = async () => {
    const shareData = {
      title: "Wordle Infinito",
      text: "¡Juega múltiples partidas de Wordle simultáneamente! 🎮✨",
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        setShowShareMessage(true);
        setTimeout(() => setShowShareMessage(false), 2000);
      }
    } catch (err) {
      console.error("Error compartiendo:", err);
    }
  };
  return (
    <div className="fixed top-5 w-full px-5 z-10 py-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className={`flex items-center gap-2 px-2 transition-all duration-200 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : ''}`} 
            onClick={handleBack}
          >
            <Home className="h-5 w-5" />
            <span className="hidden xs:block">Inicio</span>
          </Button>

          <Button
            variant="ghost"
            className={`flex items-center gap-2 text-yellow-600 px-2 transition-all duration-200 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : ''}`}
            onClick={() => setShowLeaderboard(true)}
          >
            <Trophy className="h-5 w-5" />
            <span className="hidden xs:block">Tabla</span>
          </Button>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            className={`flex items-center gap-2 px-2 transition-all duration-200 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-5 w-5" />
            <span className="hidden xs:block">Ajustes</span>
          </Button>

          {showSettings && (
            <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[220px] border dark:border-gray-700">
              <div className="space-y-4">
                {user && (
                  <>
                    <Link
                      href={`/profile/${user.userId}`}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
                        {getInitials(user.username, user.email)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.username || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </Link>
                    <div className="border-t dark:border-gray-700" />
                  </>
                )}
                <div className="flex justify-between items-center">

                  {user ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout();
                        setShowSettings(false);
                      }}
                      className="text-yellow-600 w-full flex justify-between items-center dark:hover:bg-gray-700"
                    >
                      <span className="text-sm dark:text-white text-gray-800 font-medium">
                        Cerrar Sesión
                      </span>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Link href="/auth" className="w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(false)}
                        className="text-yellow-600 w-full flex justify-between items-center dark:hover:bg-gray-700"
                      >
                        <span className="text-sm dark:text-white text-gray-800 font-medium">
                          Iniciar Sesión
                        </span>
                        <LogIn className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                </div>

                {/*  <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Versus</span>
                  <Link href="/versus">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="text-yellow-600 dark:hover:bg-gray-700"
                    >
                      <Swords className="h-5 w-5" />
                    </Button>
                  </Link>
                </div> */}

                <div className="flex justify-between items-center">
                  <Link href="/create" className="w-full flex justify-between items-center" >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                      className="text-yellow-600 w-full flex justify-between items-center dark:hover:bg-gray-700"
                    >
                      <span className="text-sm dark:text-white text-gray-800 font-medium">Custom</span>

                      <Pencil className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onThemeToggle}
                    className="text-yellow-600 w-full flex px-3 justify-between items-center dark:hover:bg-gray-700"
                  >
                    <span className="text-sm dark:text-white text-gray-800 font-medium">Tema</span>

                    {isDark ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                <div className="flex justify-between order-1 items-center">

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-yellow-600 w-full flex justify-between items-center dark:hover:bg-gray-700"
                  >
                    <span className="text-sm dark:text-white text-gray-800 font-medium">Compartir</span>

                    <Share2 className="w-5 h-5" />
                  </Button>
                  {showShareMessage && (
                    <div className="absolute top-full right-0 mt-2 whitespace-nowrap bg-black dark:text-white text-gray-800 text-xs py-1 px-2 rounded">
                      ¡Link copiado!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <LeaderboardModal
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />
    </div>
  );
}
