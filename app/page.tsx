import GameCard from "./components/ui/GameCard";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layouts/MainLayout";

const games = [
  {
    title: "Wordle Infinito",
    description: "Juega Wordle sin límites",
    path: "/wordle",
    backgroundColor: "bg-[#b4ff9f]",
    icon: "🎯",
    isComingSoon: false,
  },
  {
    title: "Duelo",
    description: "Compite contra otros jugadores",
    path: "/versus",
    backgroundColor: "bg-[#ffb4b4]",
    icon: "⚔️",
    isComingSoon: false,
  },
  {
    title: "Combinations",
    description: "Combina letras y crea palabras",
    path: "/combinations",
    backgroundColor: "bg-[#fff4e3]",
    icon: "🔤",
    isComingSoon: true,
  },
  {
    title: "SpellBee",
    description: "Forma palabras con 7 letras",
    path: "/spellbee",
    backgroundColor: "bg-[#ffe9b4]",
    icon: "🐝",
    isComingSoon: true,
  },
];

export default function Page() {
  return (
    <AuthProvider>
      <MainLayout>
        <div className="min-h-[calc(100vh-3.5rem)] bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-bold text-foreground">
                <div className="flex flex-col items-center gap-2">
                  <span className="flex flex-col gap-2">
                    <div className="flex gap-1 mx-auto">
                      {["E", "L", " ", "R", "E", "Y", " ", "D", "E", "L"].map((letter, i) => (
                        <span
                          key={i}
                          className={`${
                            letter === " " ? "w-3 h-10 md:w-6 md:h-16 bg-transparent" : 
                            i === 0 ? "w-10 h-10 md:w-16 md:h-16 bg-green-500" :
                            i === 3 ? "w-10 h-10 md:w-16 md:h-16 bg-gray-500" :
                            i === 4 ? "w-10 h-10 md:w-16 md:h-16 bg-yellow-500" :
                            i === 5 ? "w-10 h-10 md:w-16 md:h-16 bg-green-500" :
                            i === 8 ? "w-10 h-10 md:w-16 md:h-16 bg-yellow-500" :
                            "w-10 h-10 md:w-16 md:h-16 bg-green-500"
                          } flex items-center justify-center rounded-lg text-white font-bold text-xl md:text-3xl shadow-md`}
                        >
                          {letter === " " ? "\u00A0" : letter}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-1 mx-auto">
                      {["W", "O", "R", "D", "L", "E"].map(
                        (letter, i) => (
                          <span
                            key={i}
                            className={`${
                              letter === " " ? "w-3 h-10 md:w-6 md:h-16 bg-transparent" :
                              i === 0 ? "w-10 h-10 md:w-16 md:h-16 bg-gray-500" :
                              i === 2 ? "w-10 h-10 md:w-16 md:h-16 bg-green-500" :
                              i === 3 ? "w-10 h-10 md:w-16 md:h-16 bg-yellow-500" :
                              "w-10 h-10 md:w-16 md:h-16 bg-green-500"
                            } flex items-center justify-center rounded-lg text-white font-bold text-xl md:text-3xl shadow-md`}
                          >
                            {letter === " " ? "\u00A0" : letter}
                          </span>
                        ))}
                    </div>
                  </span>
                </div>
              </h1>
              <p className="text-lg text-muted-foreground">
                Explora nuestra colección de juegos de palabras
              </p>
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
        </div>
      </MainLayout>
    </AuthProvider>
  );
}
