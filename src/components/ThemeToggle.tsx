import { useEffect, useState } from "react";
import "./ThemeToggle.css";

type Theme = "dark" | "light";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("syncro-theme");
  return stored === "light" ? "light" : "dark";
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("syncro-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Cambiar entre modo claro y oscuro"
    >
      <img src={`${import.meta.env.BASE_URL}assets/icons/sol.svg`} alt="" />
    </button>
  );
};

export default ThemeToggle;
