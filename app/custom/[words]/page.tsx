"use client";

import Game from "@/app/game";
import { useEffect, useState } from "react";
import { ACCEPTED_WORDS } from "@/app/accepted-words";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

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
      
      // Solo validamos que sean palabras de 5 letras con caracteres válidos
      const invalidWords = decodedWords.filter(word => !/^[A-ZÑ]{5}$/.test(word));
      
      if (invalidWords.length > 0) {
        setError("El link contiene palabras inválidas");
        return;
      }

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