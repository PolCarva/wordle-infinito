"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { InfinityIcon, Dices, AlertCircle } from "lucide-react";
import { WORD_LIST } from "@/app/word-list";
import { ACCEPTED_WORDS } from "@/app/accepted-words";
import { useState } from "react";

interface MenuProps {
  boardCount: number;
  setBoardCount: (count: number) => void;
  onStart: (useRareWords: boolean) => void;
  setError: (error: string | null) => void;
}

export function Menu({
  boardCount,
  setBoardCount,
  onStart,
  setError,
}: MenuProps) {
  const [useRareWords, setUseRareWords] = useState(false);
  const maxWords = useRareWords ? ACCEPTED_WORDS.length : WORD_LIST.length;

  const handleRandomCount = () => {
    const random = Math.floor(Math.random() * 64) + 1;
    setBoardCount(random);
  };

  const handleBoardCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 1;
    if (value < 1) {
      setBoardCount(1);
    } else if (value > maxWords && !useRareWords) {
      const useRare = window.confirm(
        "Has superado el límite de palabras comunes. ¿Quieres usar palabras raras para tener más opciones?"
      );
      if (useRare) {
        setUseRareWords(true);
        setBoardCount(value);
      } else {
        setBoardCount(maxWords);
        setError("Se ha establecido el máximo de palabras comunes disponibles");
      }
    } else if (value > ACCEPTED_WORDS.length) {
      setBoardCount(ACCEPTED_WORDS.length);
      setError("Has alcanzado el límite absoluto de palabras disponibles");
    } else {
      setBoardCount(value);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto pt-16 lg:pt-0">
      <div className="text-center space-y-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="flex flex-col gap-2">
            <div className="flex gap-1 mx-auto">
              {["M", "U", "L", "T", "I"].map((letter, i) => (
                <span
                  key={i}
                  className="w-10 h-10 md:w-16 md:h-16 bg-green-500 flex items-center justify-center rounded-lg text-white font-bold text-xl md:text-3xl shadow-md"
                >
                  {letter}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              {["W", "O", "R", "D", "L", "E"].map((letter, i) => (
                <span
                  key={i}
                  className={`w-10 h-10 md:w-16 md:h-16 ${
                    i === 0 ? "bg-green-500" : "bg-yellow-500"
                  } flex items-center justify-center rounded-lg text-white font-bold text-xl md:text-3xl shadow-md`}
                >
                  {letter}
                </span>
              ))}
            </div>
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Juega al Wordle con múltiples palabras simultáneamente. ¡Un desafío
          mayor para los amantes de las palabras!
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <InfinityIcon className="w-6 h-6 text-green-500" />
            Configura tu juego
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label
                htmlFor="boardCount"
                className="block text-sm font-medium mb-2"
              >
                Número de palabras
              </label>
              <div className="flex gap-2">
                <Input
                  id="boardCount"
                  type="number"
                  min="1"
                  max={maxWords}
                  value={boardCount}
                  onChange={handleBoardCountChange}
                  className="text-2xl font-bold text-center bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRandomCount}
                  className="shrink-0 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  title="Número aleatorio"
                >
                  <Dices className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-start gap-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <InfinityIcon className="w-4 h-4" />
                  Elige entre 1 y {maxWords} palabras
                </p>
                {useRareWords && (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Usando palabras raras
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onStart(useRareWords)}
          className="w-full bg-green-500 hover:bg-green-500/90 text-white shadow-[0_6px_0_0_#16a34a] active:translate-y-1 active:shadow-[0_4px_0_0_#16a34a] transition-all"
          size="lg"
        >
          Empezar a Jugar
        </Button>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-3">
          <h3 className="font-semibold">Cómo jugar:</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-500">•</span>
              Elige cuántas palabras quieres adivinar
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-500">•</span>
              Tienes N+5 intentos (N = número de palabras)
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-500">•</span>
              Cada intento se aplica a todas las palabras
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-500">•</span>
              Las letras verdes están en la posición correcta
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-yellow-500">•</span>
              Las letras amarillas están en la palabra pero en otra posición
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
