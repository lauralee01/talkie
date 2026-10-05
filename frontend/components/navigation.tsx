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
                        ? "font-medium text-zinc-100"
                        : "text-zinc-500 transition hover:text-zinc-950"
                }
            >
                Talkies
            </Link>

            <Link
                href="/contacts"
                className={
                    isContactsActive
                        ? "font-medium text-zinc-100"
                        : "text-zinc-500 transition hover:text-zinc-950"
                }
            >
                Contacts
            </Link>
        </nav>
    );
}