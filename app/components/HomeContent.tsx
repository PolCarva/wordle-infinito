"use client";

import { useState } from "react";
import { Crown, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { LeaderboardModal } from "./ui/LeaderboardModal";
import GameCard from "./ui/GameCard";

interface Game {
  title: string;
  description: string;
  path: string;
  backgroundColor: string;
  icon: string;
  isComingSoon?: boolean;
}

export function HomeContent({ games }: { games: Game[] }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">
            <div className="flex flex-col items-center gap-2">
              {/* EL REY DEL en una línea en desktop, dos en mobile */}
              <span className="flex flex-col md:flex-row gap-2 md:gap-6">
                {/* EL REY */}
                <div className="flex gap-1 mx-auto">
                  {["E", "L", " ", "R", "E", "Y"].map((letter, i) => (
                    <span
                      key={i}
                      className={`${
                        letter === " "
                          ? "w-3 h-10 md:w-6 md:h-16 bg-transparent"
                          : i === 0
                          ? "w-10 h-10 md:w-16 md:h-16 bg-green-500"
                          : i === 3
                          ? "w-10 h-10 md:w-16 md:h-16 bg-gray-500"
                          : i === 4
                          ? "w-10 h-10 md:w-16 md:h-16 bg-yellow-500"
                          : i === 5
                          ? "w-10 h-10 md:w-16 md:h-16 bg-green-500"
                          : "w-10 h-10 md:w-16 md:h-16 bg-green-500"
                      } flex items-center justify-center rounded-lg text-white font-bold text-xl md:text-3xl relative ${letter !== " " ? "shadow-md" : ""}`}
                    >
                      {letter === " " ? (
                        "\u00A0"
                      ) : (
                        <>
                          {letter === "R" && (
                            <span className="absolute -top-6 md:-top-7 -left-5 transform -rotate-[20deg] md:-rotate-[18deg]">
                              <Crown className="size-6 md:size-8 text-yellow-500" />
                            </span>
                          )}
                          {letter}
                        </>
                      )}
                    </span>
                  ))}
                </div>

                {/* DEL */}
                <div className="flex gap-1 mx-auto">
                  {["D", "E", "L"].map((letter, i) => (
                    <span
                      key={i}
                      className={`${
                        letter === " "
                          ? "w-3 h-10 md:w-6 md:h-16 bg-transparent"
                          : i === 0
                          ? "w-10 h-10 md:w-16 md:h-16 bg-gray-500"
                          : "w-10 h-10 md:w-16 md:h-16 bg-green-500"
                      } flex items-center justify-center rounded-lg text-white font-bold text-xl md:text-3xl ${letter !== " " ? "shadow-md" : ""}`}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </span>
                  ))}
                </div>
              </span>

              {/* WORDLE siempre en su propia línea */}
              <div className="flex gap-1 mx-auto">
                {["W", "O", "R", "D", "L", "E"].map((letter, i) => (
                  <span
                    key={i}
                    className={`${
                      letter === " "
                        ? "w-3 h-10 md:w-6 md:h-16 bg-transparent"
                        : i === 0
                        ? "w-10 h-10 md:w-16 md:h-16 bg-gray-500"
                        : i === 2
                        ? "w-10 h-10 md:w-16 md:h-16 bg-green-500"
                        : i === 3
                        ? "w-10 h-10 md:w-16 md:h-16 bg-yellow-500"
                        : "w-10 h-10 md:w-16 md:h-16 bg-green-500"
                    } flex items-center justify-center rounded-lg text-white font-bold text-xl md:text-3xl ${letter !== " " ? "shadow-md" : ""}`}
                  >
                    {letter === " " ? (
                      "\u00A0"
                    ) : letter === "O" ? (
                      <Link
                        className="w-full h-full grid place-items-center group"
                        href="https://www.youtube.com/@pache00games"
                        target="_blank"
                      >
                        <Image
                          src="/images/channel_profile.jpg"
                          alt="Descripción"
                          width={500}
                          height={300}
                          className="rounded-full size-[90%] group-hover:scale-110 transition-transform object-cover"
                        />
                      </Link>
                    ) : (
                      letter
                    )}
                  </span>
                ))}
              </div>
            </div>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explora nuestra colección de juegos de palabras
          </p>
          <div className="flex justify-center mt-8 mb-12">
            <Button
              variant="default"
              size="lg"
              className="flex items-center gap-3 px-8 py-6 text-lg font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
              onClick={() => setShowLeaderboard(true)}
            >
              <Trophy className="h-6 w-6 text-yellow-500" />
              Ver Tabla de Clasificación
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <div
              key={index}
              className="transform transition-transform hover:scale-105"
            >
              <GameCard {...game} />
            </div>
          ))}
        </div>
      </div>
      <LeaderboardModal
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />
    </div>
  );
}