import localFont from "next/font/local";
import "./globals.css";
import { metadata } from "./metadata";
import { GoogleAnalytics } from '@next/third-parties/google'
import { JsonLd } from "./components/seo/JsonLd";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  preload: true,
  display: 'swap',
});

export { metadata };

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
        {children}
        <GoogleAnalytics gaId="G-RGBJB9PVJV" />
      </body>
    </html>
  );
}
