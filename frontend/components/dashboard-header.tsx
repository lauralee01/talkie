import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Navigation } from "@/components/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:h-16 sm:gap-6 sm:px-8">
        <Link
          href="/"
          className="shrink-0 text-base font-semibold tracking-tight text-foreground sm:text-lg"
        >
          Talkie
        </Link>

        <Navigation />

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
          <LogoutButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
