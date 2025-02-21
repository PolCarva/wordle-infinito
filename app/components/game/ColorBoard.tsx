interface ColorBoardProps {
  guesses: string[][];
  currentGuess: string[];
  solution: string[];
  wordLength: number;
  maxAttempts: number;
}

export function ColorBoard({ guesses, currentGuess, solution, wordLength, maxAttempts }: ColorBoardProps) {
  const getEmptyRow = () => Array(wordLength).fill('⬜️');

  const getColorStatuses = (guess: string[]) => {
    const statuses = Array(wordLength).fill('absent');
    const remainingColors = new Map<string, number>();

    // Contar ocurrencias de cada color en la solución
    solution.forEach(color => {
      remainingColors.set(color, (remainingColors.get(color) || 0) + 1);
    });

    // Primero marcar los correctos
    guess.forEach((color, i) => {
      if (color === solution[i]) {
        statuses[i] = 'correct';
        remainingColors.set(color, remainingColors.get(color)! - 1);
      }
    });

    // Luego marcar los presentes
    guess.forEach((color, i) => {
      const remaining = remainingColors.get(color) ?? 0;
      if (statuses[i] !== 'correct' && remaining > 0) {
        statuses[i] = 'present';
        remainingColors.set(color, remaining - 1);
      }
    });

    return statuses;
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-emerald-700 border-emerald-700 text-white';
      case 'present':
        return 'bg-yellow-300 border-yellow-300 text-white';
      case 'absent':
        return 'bg-gray-500 border-gray-500 text-white';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600';
    }
  };

  const rows = [];

  // Agregar intentos completados
  for (let i = 0; i < guesses.length; i++) {
    const statuses = getColorStatuses(guesses[i]);
    rows.push(
      <div key={i} className="grid grid-cols-5 gap-1">
        {guesses[i].map((color, j) => (
          <div
            key={j}
            className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold transition-all duration-500 ${getStatusClasses(statuses[j])}`}
          >
            {color}
          </div>
        ))}
      </div>
    );
  }

  // Agregar intento actual
  if (currentGuess.length > 0) {
    rows.push(
      <div key="current" className="grid grid-cols-5 gap-1">
        {[...currentGuess, ...Array(wordLength - currentGuess.length).fill('⬜️')].map((color, i) => (
          <div
            key={i}
            className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold ${color === '⬜️' ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-500'} border-gray-300 dark:border-gray-600`}
          >
            {color}
          </div>
        ))}
      </div>
    );
  }

  // Agregar filas vacías restantes
  const remainingRows = maxAttempts - rows.length;
  for (let i = 0; i < remainingRows; i++) {
    rows.push(
      <div key={`empty-${i}`} className="grid grid-cols-5 gap-1">
        {getEmptyRow().map((color, j) => (
          <div
            key={j}
            className="w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            {color}
          </div>
        ))}
      </div>
    );
  }

  return <div className="grid gap-1">{rows}</div>;
}