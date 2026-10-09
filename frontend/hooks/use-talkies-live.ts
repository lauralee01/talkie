"use client";

import { useCallback, useState } from "react";
import { useEventSource } from "@/hooks/use-event-source";
import {
  deleteTalkie,
  getTalkies,
  getTalkiesEventsUrl,
  type Talkie,
} from "@/lib/talkies-api";

export function useTalkiesLive(initialTalkies: Talkie[]) {
  const [talkies, setTalkies] = useState(initialTalkies);

  const refresh = useCallback(async () => {
    try {
      setTalkies(await getTalkies());
    } catch (error) {
      console.error("Failed to refresh Talkies:", error);
    }
  }, []);

  const removeTalkie = useCallback(async (talkieId: string) => {
    let previous: Talkie[] = [];

    setTalkies((current) => {
      previous = current;
      return current.filter((talkie) => talkie.id !== talkieId);
    });

    try {
      await deleteTalkie(talkieId);
    } catch (error) {
      setTalkies(previous);
      console.error("Failed to delete Talkie:", error);
      throw error;
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

  return { talkies, removeTalkie };
}
