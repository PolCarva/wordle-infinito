"use client";

import { Button } from "@/app/components/ui/button";
import { Settings, ArrowLeft, Moon, Sun, LogIn, LogOut } from "lucide-react";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

interface NavProps {
  onBack?: () => void;
  onReset?: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Nav({ onBack, onReset, isDark, onThemeToggle }: NavProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showShareMessage, setShowShareMessage] = useState(false);
  const { user, logout } = useAuth();

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
    <div className="fixed top-5 w-full px-5">
      <div className="relative flex justify-between items-center">
        {onBack ? (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-9 h-9" />
        )}

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-5 w-5" />
          </Button>

          {showSettings && (
            <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[220px] border dark:border-gray-700">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {user ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                  </span>
                  {user ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout();
                        setShowSettings(false);
                      }}
                      className="text-yellow-600 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Link href="/auth">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(false)}
                        className="text-yellow-600 dark:hover:bg-gray-700"
                      >
                        <LogIn className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tema</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onThemeToggle}
                    className="text-yellow-600 dark:hover:bg-gray-700"
                  >
                    {isDark ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                {onReset && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reiniciar juego</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onReset();
                        setShowSettings(false);
                      }}
                      className="text-yellow-600 dark:hover:bg-gray-700"
                    >
                      Reiniciar
                    </Button>
                  </div>
                )}
                {onBack && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Volver al inicio
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onBack();
                        setShowSettings(false);
                      }}
                      className="text-yellow-600 dark:hover:bg-gray-700"
                    >
                      Volver
                    </Button>
                  </div>
                )}
                <div className="flex justify-between order-1 items-center">
                  <span className="text-sm font-medium">Compartir</span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-yellow-600 dark:hover:bg-gray-700"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                  {showShareMessage && (
                    <div className="absolute top-full right-0 mt-2 whitespace-nowrap bg-black text-white text-xs py-1 px-2 rounded">
                      ¡Link copiado!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
