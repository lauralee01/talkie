"use client";

import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/cn";
import { THEME_OPTIONS, type Theme } from "@/lib/theme";

const THEME_LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <div>
        <p className="text-sm font-medium text-foreground">Theme</p>
        <p className="mt-1 text-sm text-muted">
          Choose light, dark, or match your system preference.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Theme"
        className="mt-4 grid grid-cols-3 gap-2"
      >
        {THEME_OPTIONS.map((option) => {
          const selected = theme === option;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setTheme(option)}
              className={cn(
                "cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-medium transition",
                selected
                  ? "border-ring bg-primary text-primary-foreground"
                  : "border-border bg-surface text-muted hover:border-ring hover:text-foreground",
              )}
            >
              {THEME_LABELS[option]}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
