"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Trophy, Medal, Swords, Target } from "lucide-react";
import { api } from "@/app/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import Link from "next/link";

interface LeaderboardEntry {
  username: string;
  userId: string;
  gamesWon: number;
  gamesPlayed: number;
  winRate: number;
  bestStreak: number;
}

interface LeaderboardData {
  normal: LeaderboardEntry[];
  versus: LeaderboardEntry[];
}

const getMedalColor = (index: number) => {
  switch (index) {
    case 0:
      return "text-yellow-500";
    case 1:
      return "text-gray-400";
    case 2:
      return "text-amber-600";
    default:
      return "text-gray-300";
  }
};

export function LeaderboardModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await api.getLeaderboard();
        setLeaderboard(data);
        setError("");
      } catch (err) {
        setError("Error cargando la clasificación");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchLeaderboard();
    }
  }, [open]);

  const renderLeaderboard = (entries: LeaderboardEntry[], mode: 'normal' | 'versus') => (
    <div className="space-y-2 max-h-[80vh] md:max-h-[60vh] overflow-y-auto pr-2">
      {entries.map((entry, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg bg-muted"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8">
              {index < 3 ? (
                <Medal className={`h-6 w-6 ${getMedalColor(index)}`} />
              ) : (
                <span className="font-bold text-lg text-muted-foreground">
                  {index + 1}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium flex items-center gap-2">
                <Link 
                  href={`/profile/${entry.userId}`}
                  className="hover:underline hover:text-primary transition-colors"
                >
                  {entry.username}
                </Link>
                {entry.bestStreak > (mode === 'versus' ? 1 : 3) && (
                  <span className="text-sm text-orange-500" title="Mejor racha">
                    🔥{entry.bestStreak}
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {entry.gamesPlayed} partidas jugadas <span className="block">({entry.winRate}% de victorias)</span>
              </p>
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">
            {entry.gamesWon}pts
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Tabla de Clasificación
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Cargando clasificación...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-destructive">{error}</div>
        ) : leaderboard ? (
          <Tabs defaultValue="normal" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="normal" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Normal
              </TabsTrigger>
              <TabsTrigger value="versus" className="w-full">
                <Swords className="h-4 w-4 mr-2" />
                Duelos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="normal" className="mt-4">
              {renderLeaderboard(leaderboard.normal, 'normal')}
            </TabsContent>
            <TabsContent value="versus" className="mt-4">
              {renderLeaderboard(leaderboard.versus, 'versus')}
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
} 