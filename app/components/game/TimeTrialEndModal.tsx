"use client";

import { Button } from "@/app/components/ui/button";
import Confetti from "react-confetti-boom";
import { useState, useEffect } from "react";

interface TimeTrialEndModalProps {
  show: boolean;
  wordsGuessed: number;
  summary: { word: string; solved: boolean }[];
  onClose: () => void;
  onPlayAgain: () => void;
}

export function TimeTrialEndModal({
  show,
  wordsGuessed,
  summary,
  onClose,
  onPlayAgain,
}: TimeTrialEndModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show && wordsGuessed > 0) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [show, wordsGuessed]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full text-center relative">
        {showConfetti && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <Confetti
              mode="fall"
              fadeOutHeight={0.4}
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

        <h2 className="text-2xl font-bold mb-4">¡Tiempo terminado!</h2>

        <p className="text-xl mb-6">
          Adivinaste {wordsGuessed}{" "}
          {wordsGuessed === 1 ? "palabra" : "palabras"}
        </p>

        <div className="mb-6 space-x-2 flex justify-center w-full flex-wrap">
          {summary.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg font-mono text-center 
                ${item.solved ? "text-green-500" : "text-red-500"}`}
            >
              {item.word}
            </div>
          ))}
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
