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
    title: "Colordle",
    description: "Combina colores para formar el orden correcto",
    path: "/colordle",
    backgroundColor: "bg-[#fff4e3]",
    icon: "🎨",
  },
  {
    title: "Boludle",
    description: "La versión argentina del Wordle, con palabras del lunfardo y expresiones locales",
    path: "/boludle",
    backgroundColor: "bg-blue-300",
    icon: "🧉",
    isComingSoon: false
  },
  {
    title: "Contrarreloj",
    description: "¿Cuántas palabras puedes adivinar en un minuto?",
    path: "/contrarreloj",
    backgroundColor: "bg-amber-400",
    icon: "⏰",
    isComingSoon: false,
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
