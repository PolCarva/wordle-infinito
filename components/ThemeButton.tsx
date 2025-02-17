"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const ThemeButton = () => {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage ? localStorage.getItem("darkTheme") === "true" : false;
    setDarkTheme(storedTheme);
    if (storedTheme) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <Button
      className="fixed top-5 right-5 z-10"
      onClick={() => {
        document.documentElement.classList.toggle("dark");
        const newTheme = !darkTheme;
        setDarkTheme(newTheme);
        if (localStorage) {
          localStorage.setItem("darkTheme", JSON.stringify(newTheme));
        }
      }}
    >
      {darkTheme ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ThemeButton;
