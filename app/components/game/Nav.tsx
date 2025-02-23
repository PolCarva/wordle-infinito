"use client";

import { Button } from "@/app/components/ui/button";
import {
  Settings,
  ArrowLeft,
  Moon,
  Sun,
  LogIn,
  LogOut,
  Swords,
  Home,
} from "lucide-react";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

interface NavProps {
  onBack?: () => void;
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

export function Nav({ onBack, isDark, onThemeToggle }: NavProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showShareMessage, setShowShareMessage] = useState(false);
  const { user, logout } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
      setShowSettings(false);
    }
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
    <div className="fixed top-5 w-full px-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {onBack ? (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            window.location.pathname !== '/' && (
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
            )
          )}
        </div>

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
                  <span className="text-sm font-medium">
                    {user ? "Cerrar Sesión" : "Iniciar Sesión"}
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
