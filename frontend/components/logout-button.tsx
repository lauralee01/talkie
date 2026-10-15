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
      className="cursor-pointer text-sm text-muted transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoggingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
