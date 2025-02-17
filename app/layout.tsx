import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Multi-Wordle | Pablo Carvalho",
  description: "Un juego de Wordle en el que puedes jugar con la cantidad de palabras que quieras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            if (localStorage.getItem('darkTheme') === 'true') {
              document.documentElement.classList.add('dark')
            }
          `
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 dark:text-white transition-colors`}>
        {children}
      </body>
    </html>
  );
}
