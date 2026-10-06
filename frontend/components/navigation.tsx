"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
    const pathname = usePathname();

    const isTalkiesActive = pathname === "/";
    const isContactsActive = pathname.startsWith("/contacts");

    return (
        <nav className="flex items-center gap-6">
            <Link
                href="/"
                className={
                    isTalkiesActive
                        ? "text-sm font-medium text-zinc-950"
                        : "text-sm text-zinc-500 transition hover:text-zinc-950"
                }
            >
                Talkies
            </Link>

            <Link
                href="/contacts"
                className={
                    isContactsActive
                        ? "text-sm font-medium text-zinc-950"
                        : "text-sm text-zinc-500 transition hover:text-zinc-950"
                }
            >
                Contacts
            </Link>
        </nav>
    );
}