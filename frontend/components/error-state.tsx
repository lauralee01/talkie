"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type ErrorStateProps = {
  title?: string;
  message: string;
  /** Optional client-side retry. Falls back to a full route refresh. */
  onRetry?: () => Promise<void> | void;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRetrying, setIsRetrying] = useState(false);

  const busy = isPending || isRetrying;

  async function handleRetry() {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div
      role="alert"
      className="rounded-2xl border border-danger-border bg-danger-muted px-5 py-6 text-danger-text"
    >
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-danger-text-soft">{message}</p>

      <button
        type="button"
        onClick={() => void handleRetry()}
        disabled={busy}
        className="mt-4 cursor-pointer rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-danger-foreground transition hover:bg-danger-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}
