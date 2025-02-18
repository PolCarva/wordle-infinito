"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreatePage() {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddWord = () => {
    const word = currentWord.toUpperCase();
    
    if (word.length !== 5) {
      setError("La palabra debe tener 5 letras");
      return;
    }

    // Validamos que solo contenga letras válidas
    if (!/^[A-ZÑ]{5}$/.test(word)) {
      setError("Solo se permiten letras");
      return;
    }

    if (words.includes(word)) {
      setError("Esta palabra ya está en la lista");
      return;
    }

    setWords([...words, word]);
    setCurrentWord("");
    setError(null);
  };

  const handleShare = () => {
    if (words.length === 0) {
      setError("Agrega al menos una palabra");
      return;
    }

    // Usamos btoa pero reemplazamos caracteres no seguros para URLs
    const encodedWords = btoa(words.join(","))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    const url = `${window.location.origin}/custom/${encodedWords}`;
    
    navigator.clipboard.writeText(url);
    setError("¡Link copiado al portapapeles!");
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto p-4 pt-16">
      <div className="w-full flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Crear Partida Personalizada</h1>
        <div className="w-10" />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={currentWord}
              onChange={(e) => {
                setCurrentWord(e.target.value.toUpperCase());
                setError(null);
              }}
              placeholder="PALABRA"
              maxLength={5}
              className="text-2xl font-bold text-center uppercase"
              onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
            />
            <Button onClick={handleAddWord}>Agregar</Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="border rounded-xl p-4 min-h-40 space-y-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Palabras agregadas: {words.length}
            </div>
            <div className="flex flex-wrap gap-2">
              {words.map((word, i) => (
                <div
                  key={i}
                  className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleShare}
          className="w-full"
          disabled={words.length === 0}
        >
          Generar Link para Compartir
        </Button>
      </div>
    </div>
  );
} 