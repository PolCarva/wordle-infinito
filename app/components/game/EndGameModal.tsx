'use client';

import { Button } from "@/app/components/ui/button";
import Confetti from "react-confetti-boom";
import { BoardState } from "@/app/types";
import { useEffect, useState } from "react";

interface EndGameModalProps {
  show: boolean;
  won: boolean;
  boards: BoardState[];
  description?: string;
  solution?: string | string[];
  onClose: () => void;
  onPlayAgain: () => void;
  isCustomGame?: boolean;
}

export function EndGameModal({
  show,
  won,
  boards,
  description,
  solution,
  onClose,
  onPlayAgain,
  isCustomGame = false
}: EndGameModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (won && show) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [won, show]);

  const getSolutionText = () => {
    if (!solution) return boards.map((board) => board.word).join(", ");
    if (Array.isArray(solution)) return solution.join(", ");
    return solution;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full text-center relative">
        {showConfetti && (
          <div className="absolute [&_canvas]:!fixed inset-0 flex items-center justify-center pointer-events-none">
            <Confetti
              mode="fall"
              fadeOutHeight={0.9}
              key={showConfetti ? "show" : "hide"}
              particleCount={150}
              colors={[
                "#E74C3C",
                "#2ECC71",
                "#3498DB",
                "#F1C40F",
                "#9B59B6",
                "#1ABC9C",
              ]}
            />
          </div>
        )}
        <p className="text-xl mb-4">
          {won
            ? boards.length > 1 
              ? "¡Felicidades! Has adivinado todas las palabras."
              : "¡Felicidades! Has adivinado la palabra."
            : "Suerte para la próxima."}
        </p>
        <div className="mb-4">
          <p>
            {Array.isArray(solution) ? "Las palabras eran: " : "La palabra era: "}
            <strong>{getSolutionText()}</strong>
          </p>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              &ldquo;{description}&rdquo;
            </p>
          )}
          
          {isCustomGame && (
            <p className="text-xs text-gray-500 mt-3 italic">
              Recuerda que las partidas personalizadas no suman a tus estadísticas
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            className="bg-red-600 text-white hover:text-white hover:bg-red-700"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button onClick={onPlayAgain}>Jugar de nuevo</Button>
        </div>
      </div>
    </div>
  );
}