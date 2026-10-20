"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { formatPhoneNumber } from "@/lib/format";

type CopyablePhoneProps = {
  value: string;
  className?: string;
};

export function CopyablePhone({ value, className }: CopyablePhoneProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const display = formatPhoneNumber(value);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={copied ? "Phone number copied" : `Copy ${display}`}
      title={copied ? "Copied" : "Copy number"}
      className={cn(
        "cursor-pointer rounded-md text-left transition hover:text-foreground focus-visible:outline-none focus-visible:underline",
        className,
      )}
    >
      {copied ? "Copied" : display}
    </button>
  );
}
