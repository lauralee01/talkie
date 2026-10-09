"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/", label: "Talkies", match: (pathname: string) => pathname === "/" },
  {
    href: "/contacts",
    label: "Contacts",
    match: (pathname: string) => pathname.startsWith("/contacts"),
  },
] as const;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6" aria-label="Primary">
      {NAV_ITEMS.map((item) => {
        const isActive = item.match(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "text-sm transition",
              isActive
                ? "font-medium text-zinc-950"
                : "text-zinc-500 hover:text-zinc-950",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
