import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";
export type HeaderColor =
  | "amber"
  | "violet"
  | "blue"
  | "green"
  | "rose";

const STORAGE_THEME = "echoroom-theme";
const STORAGE_HEADER_COLOR = "echoroom-header-color";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  headerColor: HeaderColor;
  setHeaderColor: (color: HeaderColor) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readTheme(): Theme {
  try {
    const s = localStorage.getItem(STORAGE_THEME);
    if (s === "dark" || s === "light") return s;
  } catch {
    // ignore
  }
  return "light";
}

function readHeaderColor(): HeaderColor {
  try {
    const s = localStorage.getItem(STORAGE_HEADER_COLOR);
    if (
      s === "amber" ||
      s === "violet" ||
      s === "blue" ||
      s === "green" ||
      s === "rose"
    )
      return s;
  } catch {
    // ignore
  }
  return "amber";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = readTheme();
    if (typeof document !== "undefined") {
      if (t === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
    return t;
  });
  const [headerColor, setHeaderColorState] = useState<HeaderColor>(() => {
    const c = readHeaderColor();
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-header-color", c);
    }
    return c;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-header-color", headerColor);
    try {
      localStorage.setItem(STORAGE_HEADER_COLOR, headerColor);
    } catch {
      // ignore
    }
  }, [headerColor]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const setHeaderColor = useCallback((next: HeaderColor) => {
    setHeaderColorState(next);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, headerColor, setHeaderColor }),
    [theme, setTheme, headerColor, setHeaderColor]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
