import localFont from "next/font/local";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import { JsonLd } from "./components/seo/JsonLd";
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from "./context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  preload: true,
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wordle Infinito',
  description: 'Juega múltiples partidas de Wordle simultáneamente',
  metadataBase: new URL('https://wordleinfinito.com'),
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.getItem('darkTheme') === 'true') {
                document.documentElement.classList.add('dark')
              }
            `,
          }}
        />
        <JsonLd />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased bg-white dark:bg-gray-900 dark:text-white transition-colors`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
        <GoogleAnalytics gaId="G-RGBJB9PVJV" />
      </body>
    </html>
  );
}
