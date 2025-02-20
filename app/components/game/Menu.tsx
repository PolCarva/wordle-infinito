"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  InfinityIcon,
  Dices,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import Link from "next/link";
import { getAvailableLengths, getDictionary } from "@/app/dictionaries";

interface MenuProps {
  boardCount: number | "";
  setBoardCount: (count: number | "") => void;
  onStart: () => void;
  setError: (error: string | null) => void;
  useRareWords: boolean;
  setUseRareWords: (value: boolean) => void;
  wordLength: number;
  setWordLength: (length: number) => void;
}

export function Menu({
  boardCount,
  setBoardCount,
  onStart,
  setError,
  useRareWords,
  setUseRareWords,
  wordLength,
  setWordLength,
}: MenuProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [availableLengths, setAvailableLengths] = useState<number[]>([]);
  const [maxWords, setMaxWords] = useState(100); // valor por defecto razonable

  useEffect(() => {
    const loadLengths = async () => {
      const lengths = await getAvailableLengths();
      setAvailableLengths(lengths);
      if (!lengths.includes(wordLength)) {
        setWordLength(lengths[0]);
      }
    };
    loadLengths();
  }, [setWordLength, wordLength]);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(wordLength, useRareWords);
      setMaxWords(dictionary.length);
    };
    loadDictionary();
  }, [wordLength, useRareWords]);

  const handleRandomCount = () => {
    const random = Math.floor(Math.random() * maxWords) + 1;
    setBoardCount(random);
  };

  const handleBoardCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    
    if (value === "") {
      setBoardCount("");
      return;
    }
    if (isNaN(numValue)) return;

    if (numValue > maxWords && !useRareWords) {
      setPendingValue(numValue);
      setShowDialog(true);
      return;
    }

    setBoardCount(numValue);
  };

  const toggleRareWords = () => {
    const newValue = !useRareWords;
    setUseRareWords(newValue);
    
    if (!newValue && typeof boardCount === "number" && boardCount > maxWords) {
      setBoardCount(maxWords);
      setError("Se ha ajustado al máximo de palabras comunes disponibles");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onStart();
    }
  };

  
  return (
    <>
      <div
        className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto pt-16 lg:pt-0"
        onKeyDown={handleKeyDown}
      >
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <span className="flex flex-col gap-2">
              <div className="flex gap-1 mx-auto">
                {["W", "O", "R", "D", "L", "E"].map((letter, i) => (
                  <span
                    key={i}
                    className="w-10 h-10 md:w-16 md:h-16 bg-green-500 flex items-center justify-center rounded-lg text-white font-bold text-xl md:text-3xl shadow-md"
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <div className="flex gap-1 max-w-[calc(100svw-rem)]">
                {["I", "N", "F", "I", "N", "I", "T", "O"].map((letter, i) => (
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
            </span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Juega al Wordle con múltiples palabras simultáneamente. ¡Un desafío
            mayor para los amantes de las palabras!
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <InfinityIcon className="w-6 h-6 text-green-500" />
                Configura tu juego
              </h2>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Longitud de las palabras
              </label>
              <div className="flex gap-2 flex-wrap">
                {availableLengths.map((length) => (
                  <button
                    key={length}
                    onClick={() => setWordLength(length)}
                    className={`px-4 py-2 rounded-lg ${
                      wordLength === length
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {length} letras
                  </button>
                ))}
              </div>
            </div>

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
                    onKeyDown={handleKeyDown}
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
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex flex-col md:flex-row md:items-center">
                    <span className="flex items-center">
                      <InfinityIcon className="w-4 h-4 mr-1.5" />
                      Elige entre 1 y {maxWords} palabras{" "}
                    </span>
                    {useRareWords && (
                      <div className="inline-flex items-center gap-1 text-yellow-600 dark:text-yellow-500 text-sm md:ml-2">
                        <AlertCircle className="w-4 h-4" />
                        Usando palabras raras
                      </div>
                    )}
                  </p>

                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={useRareWords}
                        onChange={toggleRareWords}
                        className="rounded border-yellow-500 text-yellow-500 focus:ring-yellow-500"
                      />
                      Habilitar palabras raras
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={onStart}
              className="w-full bg-green-500 hover:bg-green-500/90 text-white shadow-[0_6px_0_0_#16a34a] active:translate-y-1 active:shadow-[0_4px_0_0_#16a34a] transition-all"
              size="lg"
            >
              Empezar a Jugar
            </Button>

            <Link href="/create" className="w-full">
              <Button
                variant="outline"
                className="w-full border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-500 bg-transparent dark:hover:bg-yellow-950/20"
                size="lg"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Crear Partida Personalizada
              </Button>
            </Link>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-xl space-y-3">
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Usar palabras raras?</DialogTitle>
            <DialogDescription>
              Has superado el límite de palabras comunes. ¿Quieres habilitar las
              palabras raras para tener más opciones?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setBoardCount(maxWords);
                setError(
                  "Se ha establecido el máximo de palabras comunes disponibles"
                );
                setShowDialog(false);
              }}
            >
              No, usar máximo común
            </Button>
            <Button
              onClick={() => {
                setUseRareWords(true);
                if (pendingValue) setBoardCount(pendingValue);
                setShowDialog(false);
              }}
            >
              Sí, habilitar raras
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
