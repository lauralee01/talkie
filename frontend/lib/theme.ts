export const THEME_STORAGE_KEY = "talkie-theme";

export const THEME_OPTIONS = ["light", "dark", "system"] as const;

export type Theme = (typeof THEME_OPTIONS)[number];
export type ResolvedTheme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return (
    typeof value === "string" &&
    (THEME_OPTIONS as readonly string[]).includes(value)
  );
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

export function applyThemeClass(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage access errors (private mode, blocked cookies, etc.).
  }

  return "system";
}

export function writeStoredTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage write errors.
  }
}

/** Inline script: apply stored theme before paint to avoid a flash. */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var t=s==="light"||s==="dark"||s==="system"?s:"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
