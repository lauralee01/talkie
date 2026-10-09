import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  /** Narrow inbox-style width vs wider management pages. */
  width?: "narrow" | "wide";
};

export function PageShell({
  children,
  className,
  width = "narrow",
}: PageShellProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-50 text-zinc-950">
      <div
        className={cn(
          "mx-auto w-full px-6 py-10 sm:px-8 sm:py-14",
          width === "narrow" ? "max-w-3xl" : "max-w-5xl",
          className,
        )}
      >
        {children}
      </div>
    </main>
  );
}
