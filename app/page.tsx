import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layouts/MainLayout";
import { HomeContent } from "./components/HomeContent";

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
        <HomeContent games={games} />
      </MainLayout>
    </AuthProvider>
  );
}
