"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

const ThemeButton = () => {
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem("darkTheme") === "true"
  );
  return (
    <Button
    className="fixed top-5 right-5 z-10"
      onClick={() => {
        document.documentElement.classList.toggle("dark");
        setDarkTheme(!darkTheme);
        localStorage.setItem("darkTheme", JSON.stringify(darkTheme));
      }}
    >
      {darkTheme ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ThemeButton;
