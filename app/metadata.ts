import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Multi Wordle",
    template: "%s | Multi Wordle",
  },
  description:
    "Juega múltiples partidas de Wordle simultáneamente. Un desafío de palabras donde puedes resolver varios puzzles a la vez.",
  keywords: [
    "wordle",
    "juego de palabras",
    "puzzle",
    "puzle",
    "multi wordle",
    "juego",
    "español",
    "wordle infinito",
    "wordle infinito español",
    "8 palabras",
    "8 wordle",
    "64 palabras",
    "64 wordle",
    "16 palabras",
    "16 wordle",
    "32 palabras",
    "32 wordle",
    "48 palabras",
    "48 wordle",
    "96 palabras",
    "96 wordle",
    "128 palabras",
    "128 wordle",
  ],
  authors: [{ name: "Pablo Carvalho" }],
  creator: "Pablo Carvalho",
  publisher: "Pablo Carvalho",
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://worlde-infinito.vercel.app",
    title: "Multi Wordle - Juega múltiples Wordles a la vez",
    description:
      "Juega múltiples partidas de Wordle simultáneamente. Un desafío de palabras donde puedes resolver varios puzzles a la vez.",
    siteName: "Multi Wordle",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi Wordle - Juega múltiples Wordles a la vez",
    description:
      "Juega múltiples partidas de Wordle simultáneamente. Un desafío de palabras donde puedes resolver varios puzzles a la vez.",
    creator: "@PabloC21791",
  }
};
