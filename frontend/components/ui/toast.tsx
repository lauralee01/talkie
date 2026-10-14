"use client";

import { useEffect } from "react";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
};

type ToastProps = {
  toast: ToastMessage | null;
  onDismiss: () => void;
  durationMs?: number;
};

export function Toast({ toast, onDismiss, durationMs = 5000 }: ToastProps) {
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timeout);
  }, [toast, onDismiss, durationMs]);

  if (!toast) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,24rem)] -translate-x-1/2 rounded-2xl border border-zinc-200 bg-zinc-950 px-4 py-3 text-white shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-sm text-zinc-300">{toast.description}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="cursor-pointer rounded-lg p-1 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}
