import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      // Check if current route is organizer
      const isOrganizerRoute = window.location.href.includes("/organizer");

      if (isOrganizerRoute) {
        return (
          localStorage.getItem("theme") === "dark" ||
          (!localStorage.getItem("theme") &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
        );
      }
      // For non-organizer routes, force light mode
      return false;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isOrganizerRoute = window.location.href.includes("/organizer");

    if (isOrganizerRoute && isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      if (isOrganizerRoute) {
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const isOrganizerRoute = window.location.href.includes("/organizer");
    if (isOrganizerRoute) {
      setIsDarkMode((prev) => !prev);
    }
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
