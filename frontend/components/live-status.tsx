import { cn } from "@/lib/cn";

export type LiveConnectionStatus = "connecting" | "live" | "reconnecting";

type LiveStatusProps = {
  status: LiveConnectionStatus;
  className?: string;
};

const LABELS: Record<LiveConnectionStatus, string> = {
  connecting: "Connecting…",
  live: "Live",
  reconnecting: "Reconnecting…",
};

export function LiveStatus({ status, className }: LiveStatusProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-xs",
        status === "live" ? "text-zinc-500" : "text-amber-700",
        className,
      )}
      aria-live="polite"
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "live" ? "bg-emerald-500" : "animate-pulse bg-amber-500",
        )}
      />
      {LABELS[status]}
    </p>
  );
}
