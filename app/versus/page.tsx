"use client";

import { useState, useEffect } from "react";
import { useAuth, AuthProvider } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/button";
import { api } from "@/app/services/api";
import { Copy, Swords } from "lucide-react";
import { useRouter } from "next/navigation";
import MainLayout from "../components/layouts/MainLayout";

function VersusContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [wordLength, setWordLength] = useState(5);
  const [availableLengths, setAvailableLengths] = useState<number[]>([]);

  useEffect(() => {
    const loadLengths = async () => {
      const lengths = await api.getAvailableLengths();
      setAvailableLengths(lengths);
      if (!lengths.includes(wordLength)) {
        setWordLength(lengths[0]);
      }
    };
    loadLengths();
  }, [wordLength]);

  const createGame = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    try {
      setError("");
      const { gameId } = await api.createVersusGame(user.userId, wordLength);
      router.push(`/versus/game/${gameId}`);
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { message?: string } } };
      setError(errorData.response?.data?.message || "Error creando la partida");
    }
  };

  const joinGame = async () => {
    if (!joinCode.trim()) {
      setError("Ingresa un código de partida");
      return;
    }

    try {
      console.log("Intentando unirse con código:", joinCode.toUpperCase());
      const { gameId } = await api.joinVersusGame(
        joinCode.toUpperCase(),
        user!.userId
      );
      router.push(`/versus/game/${gameId}`);
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { message?: string } } };
      console.error("Error joining game:", errorData);
      setError(
        errorData.response?.data?.message || "Error uniéndose a la partida"
      );
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Swords className="h-12 w-12 mx-auto mb-4 text-foreground" />
          <h1 className="text-3xl font-bold text-foreground">Wordle Versus</h1>
          <p className="mt-2 text-muted-foreground">
            Compite contra otro jugador en tiempo real
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">
              Longitud de la palabra
            </label>
            <select
              value={wordLength}
              onChange={(e) => setWordLength(Number(e.target.value))}
              className="w-full p-2 border rounded-md bg-background text-foreground border-input"
            >
              {availableLengths.map((length) => (
                <option key={length} value={length}>
                  {length} letra{length !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={createGame} className="w-full h-12 text-lg">
            Crear nueva partida
          </Button>

          {joinCode && (
            <div className="p-6 bg-card rounded-lg border border-border text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Comparte este código con tu oponente:
              </p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-3xl font-mono font-bold tracking-wider text-foreground">
                  {joinCode}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyCode}
                  className="hover:bg-accent"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
              {copied && (
                <p className="text-sm text-green-500">¡Código copiado!</p>
              )}
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">O</span>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Ingresa el código de la partida"
              className="w-full p-4 text-lg text-center font-mono tracking-wider bg-background border-input border rounded-lg text-foreground placeholder:text-muted-foreground"
              maxLength={8}
            />
            <Button
              onClick={joinGame}
              variant="outline"
              className="w-full h-12 text-lg"
            >
              Unirse a partida
            </Button>
          </div>

          {error && <p className="text-destructive text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default function VersusPage() {
  return (
    <AuthProvider>
      <MainLayout>
        <VersusContent />
      </MainLayout>
    </AuthProvider>
  );
}
