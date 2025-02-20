'use client';

interface VersusBoardProps {
    guesses: string[];
    currentGuess: string;
    solution: string;
}

export function VersusBoard({ guesses, currentGuess, solution }: VersusBoardProps) {
    const wordLength = solution.length;
    const maxAttempts = 6;

    const getVisibleRows = () => {
        const rows = [];
        
        // Agregar intentos completados
        for (let i = 0; i < guesses.length; i++) {
            rows.push(
                <Row 
                    key={i} 
                    word={guesses[i]} 
                    solution={solution}
                    isComplete={true}
                />
            );
        }

        // Agregar intento actual si existe
        if (currentGuess && guesses.length < maxAttempts) {
            rows.push(
                <Row 
                    key="current" 
                    word={currentGuess.padEnd(wordLength)} 
                    solution={solution}
                    isComplete={false}
                />
            );
        }

        // Agregar filas vacías restantes
        const remainingRows = maxAttempts - rows.length;
        for (let i = 0; i < remainingRows; i++) {
            rows.push(
                <Row 
                    key={`empty-${i}`} 
                    word={"".padEnd(wordLength)} 
                    solution={solution}
                    isComplete={false}
                />
            );
        }

        return rows;
    };

    return (
        <div className="grid gap-1">
            {getVisibleRows()}
        </div>
    );
}

interface RowProps {
    word: string;
    solution: string;
    isComplete: boolean;
}

function Row({ word, solution, isComplete }: RowProps) {
    return (
        <div className="grid grid-cols-5 gap-1">
            {word.split('').map((letter, i) => (
                <Cell 
                    key={i} 
                    letter={letter} 
                    status={isComplete ? getStatus(letter, i, solution) : undefined}
                />
            ))}
        </div>
    );
}

interface CellProps {
    letter: string;
    status?: 'correct' | 'present' | 'absent';
}

function Cell({ letter, status }: CellProps) {
    const baseClasses = "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase";
    
    const statusClasses = {
        correct: "bg-green-500 text-white border-green-500",
        present: "bg-yellow-500 text-white border-yellow-500",
        absent: "bg-gray-500 text-white border-gray-500",
        default: "border-gray-300 dark:border-gray-600"
    };

    return (
        <div className={`${baseClasses} ${status ? statusClasses[status] : statusClasses.default}`}>
            {letter}
        </div>
    );
}

function getStatus(letter: string, position: number, solution: string): 'correct' | 'present' | 'absent' {
    if (solution[position] === letter) {
        return 'correct';
    }
    if (solution.includes(letter)) {
        return 'present';
    }
    return 'absent';
} 