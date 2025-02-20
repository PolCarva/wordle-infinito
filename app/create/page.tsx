"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  AlertCircle,
  ArrowLeft,
  Link2,
  XCircle,
} from "lucide-react";
import {
  Twitter,
  Whatsapp,
  Instagram,
  Linkedin,
} from "@/app/components/ui/icons";
import Link from "next/link";
import { trackEvent } from "@/app/utils/analytics";

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

  const handleRemoveWord = (wordToRemove: string) => {
    setWords(words.filter((word) => word !== wordToRemove));
  };

  const generateGameUrl = () => {
    const encodedWords = btoa(words.join(","))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    return `${window.location.origin}/custom/${encodedWords}`;
  };

  const handleShare = async () => {
    if (words.length === 0) {
      setError("Agrega al menos una palabra");
      return;
    }

    trackEvent("custom_game_created", {
      word_count: words.length,
    });

    const url = generateGameUrl();

    // Si el navegador soporta la API nativa de compartir
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Wordle Infinito - Partida Personalizada",
          text: "¡Te reto a una partida personalizada de Wordle Infinito!",
          url,
        });
        return;
      } catch {
        // Si el usuario cancela, seguimos con el método normal
      }
    }

    navigator.clipboard.writeText(url);
    setError("¡Link copiado al portapapeles!");
  };

  const shareToTwitter = () => {
    const url = generateGameUrl();
    const text = encodeURIComponent(
      "¡Te reto a una partida personalizada de Wordle Infinito!"
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
        url
      )}`,
      "_blank"
    );
  };

  const shareToInstagram = () => {
    const url = generateGameUrl();
    // Instagram no tiene API de compartir directa, copiamos al portapapeles
    navigator.clipboard.writeText(url);
    setError("¡Link copiado! Compártelo en Instagram");
  };

  const shareToLinkedin = () => {
    const url = generateGameUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      "_blank"
    );
  };

  const shareToWhatsApp = () => {
    const url = generateGameUrl();
    const text = encodeURIComponent(
      "¡Te reto a una partida personalizada de Wordle Infinito!"
    );
    window.open(
      `https://wa.me/?text=${text}${encodeURIComponent(url)}`,
      "_blank"
    );
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
              className="text-2xl font-bold uppercase text-center bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-inner focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                  className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium group flex items-center gap-1"
                >
                  {word}
                  <div className="w-0 group-hover:w-5 grid place-content-center transition-all duration-200 overflow-hidden">
                    <button
                      onClick={() => handleRemoveWord(word)}
                      className="scale-0 group-hover:scale-100 self-center transition-transform duration-200"
                      title="Eliminar palabra"
                    >
                      <XCircle className="w-4 h-4 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleShare}
            variant="default"
            className="w-full"
            disabled={words.length === 0}
          >
            <Link2 className="w-5 h-5 mr-2" />
            Copiar Link
          </Button>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={shareToTwitter}
              className="flex-1 bg-black hover:bg-black/90 text-white"
              disabled={words.length === 0}
            >
              <Twitter className="w-5 h-5 mr-2" />
              Twitter
            </Button>

            <Button
              onClick={shareToInstagram}
              className="flex-1 bg-[#E4405F] hover:bg-[#E4405F]/90 text-white"
              disabled={words.length === 0}
            >
              <Instagram className="w-5 h-5 mr-2" />
              Instagram
            </Button>

            <Button
              onClick={shareToLinkedin}
              className="flex-1 bg-[#0a66c2] hover:bg-[#0a66c2]/90 text-white"
              disabled={words.length === 0}
            >
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </Button>

            <Button
              onClick={shareToWhatsApp}
              className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
              disabled={words.length === 0}
            >
              <Whatsapp className="w-5 h-5 mr-2" />
              Whatsapp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
