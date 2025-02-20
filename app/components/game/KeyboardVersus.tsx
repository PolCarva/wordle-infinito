'use client';

const KEYS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

interface KeyboardVersusProps {
    onKey: (key: string) => void;
    guesses: string[];
    solution: string;
}

export function KeyboardVersus({ onKey, guesses, solution }: KeyboardVersusProps) {
    const getKeyStatus = (key: string) => {
        let status = '';
        
        for (const guess of guesses) {
            for (let i = 0; i < guess.length; i++) {
                if (guess[i] === key) {
                    if (solution[i] === key) {
                        return 'bg-green-500 text-white hover:bg-green-600';
                    }
                    if (solution.includes(key)) {
                        status = 'bg-yellow-500 text-white hover:bg-yellow-600';
                    } else {
                        status = 'bg-gray-500 text-white hover:bg-gray-600';
                    }
                }
            }
        }
        
        return status || 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
    };

    return (
        <div className="grid gap-2">
            {KEYS.map((row, i) => (
                <div key={i} className="flex justify-center gap-1">
                    {row.map(key => (
                        <button
                            key={key}
                            onClick={() => onKey(key)}
                            className={`
                                ${key.length > 1 ? 'px-4' : 'px-2'} 
                                py-4 
                                rounded 
                                font-bold 
                                transition-colors
                                ${getKeyStatus(key)}
                            `}
                        >
                            {key === 'BACKSPACE' ? '←' : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
} 