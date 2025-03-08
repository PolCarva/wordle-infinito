"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Trophy, Medal, Target } from "lucide-react";
import { api } from "@/app/services/api";
import Link from "next/link";

interface LeaderboardEntry {
  username: string;
  userId: string;
  gamesWon: number;
  gamesPlayed: number;
  winRate: number;
  bestStreak: number;
  role?: string;
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
        setError("Error cargando la tabla de posiciones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchLeaderboard();
    }
  }, [open]);

  const renderLeaderboard = (entries: LeaderboardEntry[]) => (
    <div className="space-y-2 max-h-[70vh] md:max-h-[60vh] overflow-y-auto pr-2">
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
                <span className="flex items-center gap-2">
                  {entry.role === 'vip' && (
                    <span title="Usuario VIP" className="text-yellow-500 cursor-help relative group">
                      👑
                    </span>
                  )}
                  {entry.role === 'mod' && (
                    <span title="Moderador" className="text-blue-500 cursor-help relative group">
                      🛡️
                    </span>
                  )}
                  {entry.role === 'admin' && (
                    <span title="Administrador" className="text-red-500 cursor-help relative group">
                      ⚡
                    </span>
                  )}
                  <Link
                    href={`/profile/${entry.userId}`}
                    className={`relative after:content-[""] after:absolute after:w-0 after:h-[1px] after:bg-current after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-200`}
                  >
                    <span className={`relative ${entry.role === 'vip'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-300 text-transparent bg-clip-text font-bold'
                        : entry.role === 'mod'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text'
                          : entry.role === 'admin'
                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text font-bold'
                            : 'hover:text-primary'
                      }`}>
                      {entry.username}
                    </span>
                  </Link>
                </span>
                {entry.bestStreak > 3 && (
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
          <div className="text-2xl font-bold text-primary flex flex-col items-center justify-center md:flex-row md:items-baseline gap-1 md:justify-start">
            <span>{entry.gamesWon}</span><span className="text-sm text-center md:text-xs">pts</span>
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
            Tabla de posiciones
            <Target className="h-5 w-5 ml-1" />
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Cargando tabla de posiciones...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-destructive">{error}</div>
        ) : leaderboard ? (
          <div className="mt-4">
            {renderLeaderboard(leaderboard.normal)}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
} 