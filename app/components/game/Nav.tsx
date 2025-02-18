"use client";

import { Button } from "@/app/components/ui/button";
import { Settings, ArrowLeft, Moon, Sun } from "lucide-react";
import { useState } from "react";

interface NavProps {
  onBack?: () => void;
  onReset?: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Nav({ onBack, onReset, isDark, onThemeToggle }: NavProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="fixed top-5 w-full px-5">
      <div className="relative flex justify-between items-center">
        {onBack ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
          >
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
                    <span className="text-sm font-medium">Volver al inicio</span>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
