import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type LoadingStateProps = {
  label?: string;
  rows?: number;
  className?: string;
};

export function LoadingState({
  label = "Loading…",
  rows = 3,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn("space-y-4", className)} aria-busy="true" aria-live="polite">
      <p className="text-sm text-zinc-500">{label}</p>

      <div className="flex flex-col gap-4">
        {Array.from({ length: rows }, (_, index) => (
          <Card key={index} className="animate-pulse sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="h-3 w-10 rounded bg-zinc-200" />
                <div className="h-4 w-28 rounded bg-zinc-200" />
              </div>
              <div className="h-3 w-24 rounded bg-zinc-200" />
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 shrink-0 rounded-full bg-zinc-200" />
              <div className="h-2 min-w-0 flex-1 rounded-full bg-zinc-200" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
