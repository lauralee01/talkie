"use client";

import { useCallback, useState } from "react";
import { useEventSource } from "@/hooks/use-event-source";
import { getTalkies, getTalkiesEventsUrl, type Talkie } from "@/lib/talkies-api";

export function useTalkiesLive(initialTalkies: Talkie[]) {
  const [talkies, setTalkies] = useState(initialTalkies);

  const refresh = useCallback(async () => {
    try {
      setTalkies(await getTalkies());
    } catch (error) {
      console.error("Failed to refresh Talkies:", error);
    }
  }, []);

  const handleMessage = useCallback(() => {
    void refresh();
  }, [refresh]);

  const handleError = useCallback((event: Event) => {
    console.error("Talkies event stream error:", event);
  }, []);

  useEventSource(getTalkiesEventsUrl(), {
    onMessage: handleMessage,
    onError: handleError,
  });

  return talkies;
}
