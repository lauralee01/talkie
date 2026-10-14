"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  THEME_STORAGE_KEY,
  applyThemeClass,
  readStoredTheme,
  resolveTheme,
  writeStoredTheme,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme";

type ThemeSnapshot = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
};

type ThemeContextValue = ThemeSnapshot & {
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", emit);

  function onStorage(event: StorageEvent) {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      emit();
    }
  }

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", emit);
    window.removeEventListener("storage", onStorage);
  };
}

let clientSnapshot: ThemeSnapshot = {
  theme: "system",
  resolvedTheme: "light",
};

function getSnapshot(): ThemeSnapshot {
  const theme = readStoredTheme();
  const resolvedTheme = resolveTheme(theme);

  if (
    clientSnapshot.theme !== theme ||
    clientSnapshot.resolvedTheme !== resolvedTheme
  ) {
    clientSnapshot = { theme, resolvedTheme };
  }

  return clientSnapshot;
}

const serverSnapshot: ThemeSnapshot = {
  theme: "system",
  resolvedTheme: "light",
};

function getServerSnapshot(): ThemeSnapshot {
  return serverSnapshot;
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, resolvedTheme } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useLayoutEffect(() => {
    applyThemeClass(resolvedTheme);
  }, [resolvedTheme]);

  function setTheme(nextTheme: Theme) {
    writeStoredTheme(nextTheme);
    applyThemeClass(resolveTheme(nextTheme));
    emit();
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
