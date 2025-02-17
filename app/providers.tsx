"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const storedTheme = localStorage.getItem("darkTheme") === "true";
    if (storedTheme) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <body className={`antialiased bg-white dark:bg-gray-900 dark:text-white transition-colors`}>
      {children}
    </body>
  );
} 