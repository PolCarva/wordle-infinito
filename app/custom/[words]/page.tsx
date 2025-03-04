"use client";

import Game from "@/app/game";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { trackEvent } from '@/app/utils/analytics';

export default function CustomGamePage({
  params,
}: {
  params: { words: string };
}) {
  const [error, setError] = useState<string | null>(null);
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    try {
      const base64 = params.words
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const padding = '='.repeat((4 - base64.length % 4) % 4);
      const decodedWords = atob(base64 + padding).split(",");
      
      if (decodedWords.length === 0) {
        setError("No hay palabras en el link");
        return;
      }
      
      // Verificar que todas las palabras tengan la misma longitud
      const firstWordLength = decodedWords[0].length;
      const invalidLengthWords = decodedWords.filter(word => word.length !== firstWordLength);
      
      if (invalidLengthWords.length > 0) {
        setError("Todas las palabras deben tener la misma longitud");
        return;
      }
      
      // Verificar que la longitud esté entre 1 y 6
      if (firstWordLength < 1 || firstWordLength > 6) {
        setError("Las palabras deben tener entre 1 y 6 letras");
        return;
      }
      
      // Solo validamos que sean palabras con caracteres válidos
      const invalidWords = decodedWords.filter(word => !new RegExp(`^[A-ZÑ]{${firstWordLength}}$`).test(word));
      
      if (invalidWords.length > 0) {
        setError("El link contiene palabras inválidas");
        return;
      }

      // Trackeamos cuando alguien juega una partida personalizada
      trackEvent('custom_game_played', {
        word_count: decodedWords.length,
        word_length: firstWordLength
      });

      setWords(decodedWords);
    } catch (e) {
      console.error(e);
      setError("Link inválido");
    }
  }, [params.words]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh gap-4 p-4">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-6 h-6" />
          {error}
        </div>
        <Link href="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  if (words.length === 0) {
    return null;
  }

  return <Game customWords={words} />;
} 