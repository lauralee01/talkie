"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/auth-api";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      // Continue to login even if the request fails.
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={isLoggingOut}
      aria-label={isLoggingOut ? "Signing out" : "Sign out"}
      title={isLoggingOut ? "Signing out…" : "Sign out"}
      className="cursor-pointer rounded-lg p-2 text-sm text-muted transition hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="sm:hidden">
        <SignOutIcon />
      </span>
      <span className="hidden sm:inline">
        {isLoggingOut ? "Signing out…" : "Sign out"}
      </span>
    </button>
  );
}

function SignOutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-none stroke-current stroke-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12H4m0 0 3.5-3.5M4 12l3.5 3.5M10 5h6.5A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5H10"
      />
    </svg>
  );
}
