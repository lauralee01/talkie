"use client";

import { useEffect } from "react";

type UseEventSourceOptions = {
  enabled?: boolean;
  onMessage: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
};

export function useEventSource(
  url: string | null,
  { enabled = true, onMessage, onError }: UseEventSourceOptions,
): void {
  useEffect(() => {
    if (!enabled || !url) {
      return;
    }

    const eventSource = new EventSource(url);

    eventSource.onmessage = onMessage;

    if (onError) {
      eventSource.onerror = onError;
    }

    return () => {
      eventSource.close();
    };
  }, [url, enabled, onMessage, onError]);
}
