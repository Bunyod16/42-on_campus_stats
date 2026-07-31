import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

type Theme = "terminal" | "bauhaus" | "lunar";

function getInitialTheme(): Theme {
  const cookies = new Cookies();
  const saved = cookies.get("theme") as Theme | undefined;
  if (saved && ["terminal", "bauhaus", "lunar"].includes(saved)) return saved;
  return "terminal";
}

const themes: Theme[] = ["terminal", "bauhaus", "lunar"];

function cycleTheme(current: Theme): Theme {
  const idx = themes.indexOf(current);
  return themes[(idx + 1) % themes.length];
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const cookies = new Cookies();
    cookies.set("theme", theme, { path: "/", maxAge: 365 * 24 * 60 * 60 });
  }, [theme]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "t" || e.key === "T") {
        if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
          setTheme((prev) => cycleTheme(prev));
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}