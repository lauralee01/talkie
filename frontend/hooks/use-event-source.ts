"use client";

import { useEffect, useRef, useState } from "react";
import type { LiveConnectionStatus } from "@/components/live-status";

type UseEventSourceOptions = {
  enabled?: boolean;
  onMessage: (event: MessageEvent) => void;
};

type UseEventSourceResult = {
  status: LiveConnectionStatus;
};

export function useEventSource(
  url: string | null,
  { enabled = true, onMessage }: UseEventSourceOptions,
): UseEventSourceResult {
  const [status, setStatus] = useState<LiveConnectionStatus>("connecting");
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled || !url) {
      return;
    }

    const streamUrl = url;
    let eventSource: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closed = false;
    let attempt = 0;

    function clearReconnectTimer() {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    }

    function connect() {
      if (closed) {
        return;
      }

      clearReconnectTimer();
      eventSource?.close();

      setStatus(attempt === 0 ? "connecting" : "reconnecting");
      eventSource = new EventSource(streamUrl);

      eventSource.onopen = () => {
        attempt = 0;
        setStatus("live");
      };

      eventSource.onmessage = (event) => {
        setStatus("live");
        onMessageRef.current(event);
      };

      eventSource.onerror = () => {
        eventSource?.close();
        eventSource = null;

        if (closed) {
          return;
        }

        setStatus("reconnecting");
        attempt += 1;
        const delay = Math.min(1000 * 2 ** Math.min(attempt - 1, 4), 15_000);
        reconnectTimer = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      closed = true;
      clearReconnectTimer();
      eventSource?.close();
    };
  }, [url, enabled]);

  if (!enabled || !url) {
    return { status: "connecting" };
  }

  return { status };
}
