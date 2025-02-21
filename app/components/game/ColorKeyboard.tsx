import { Button } from "@/app/components/ui/button";
import { CornerDownLeftIcon, DeleteIcon } from "lucide-react";

interface ColorKeyboardProps {
  onColorSelect: (color: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  disabled: boolean;
  guesses: string[][];
  solution: string[];
}

export function ColorKeyboard({ onColorSelect, onDelete, onEnter, disabled, guesses, solution }: ColorKeyboardProps) {
  const handleClick = (key: string) => {
    switch (key) {
      case 'ENTER':
        onEnter();
        break;
      case 'BACKSPACE':
        onDelete();
        break;
      default:
        onColorSelect(key);
    }
  };

  const getColorStatus = (color: string) => {
    const totalInSolution = solution.filter(c => c === color).length;
    if (totalInSolution === 0) return 'absent';

    // Verificar si el último intento fue una victoria
    const lastGuess = guesses[guesses.length - 1];
    if (lastGuess?.every((c, i) => c === solution[i])) {
      return solution.includes(color) ? 'correct' : 'absent';
    }

    let correctCount = 0;
    let incorrectUsages = 0;

    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] !== color) continue;
        
        if (solution[i] === color) {
          correctCount++;
        } else {
          incorrectUsages++;
        }
      }
    }

    // Si todas las veces que usamos el color están en posición correcta
    if (correctCount > 0 && incorrectUsages === 0) {
      return 'correct';
    }
    // Si hay al menos un uso incorrecto del color que está en la solución
    if (incorrectUsages > 0 && totalInSolution > 0) {
      return 'present';
    }

    return '';
  };

  const getColorBackground = (color: string) => {
    const status = getColorStatus(color);
    switch (status) {
      case 'correct':
        return 'bg-emerald-700 text-white';
      case 'present':
        return 'bg-yellow-300 text-white';
      case 'absent':
        return 'bg-gray-600 text-white';
      default:
        return '!bg-gray-200 text-gray-800 dark:!bg-gray-400';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-2">
      <div className="grid grid-cols-5 gap-1 mb-1">
        {['🟥',  '🟩','🟨', '🟦', '🟪'].map((color) => (
          <Button
            key={color}
            onClick={() => handleClick(color)}
            disabled={disabled}
            className={`${getColorBackground(color)} h-16 text-2xl w-full`}
          >
            {color}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-1">
        <Button
          onClick={() => handleClick('ENTER')}
          disabled={disabled}
          className="!bg-gray-200 text-gray-800 dark:!bg-gray-400 h-16 col-span-1"
        >
          <CornerDownLeftIcon className="h-6 w-6" />
        </Button>
        {['⬛️', '🟫', '⬜', '🟧',].map((color) => (
          <Button
            key={color}
            onClick={() => handleClick(color)}
            disabled={disabled}
            className={`${getColorBackground(color)} h-16 text-2xl w-full`}
          >
            {color}
          </Button>
        ))}
        <Button
          onClick={() => handleClick('BACKSPACE')}
          disabled={disabled}
          className="!bg-gray-200 text-gray-800 dark:!bg-gray-400 h-16"
        >
          <DeleteIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}