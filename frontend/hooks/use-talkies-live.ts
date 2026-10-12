"use client";

import { useCallback, useState } from "react";
import type { LiveConnectionStatus } from "@/components/live-status";
import { useEventSource } from "@/hooks/use-event-source";
import {
  deleteTalkie,
  getTalkies,
  getTalkiesEventsUrl,
  markTalkieListened,
  type Talkie,
} from "@/lib/talkies-api";

type UseTalkiesLiveResult = {
  talkies: Talkie[];
  liveStatus: LiveConnectionStatus;
  refreshError: string | null;
  removeTalkie: (talkieId: string) => Promise<void>;
  markListened: (talkieId: string) => Promise<void>;
  retryRefresh: () => Promise<void>;
};

export function useTalkiesLive(initialTalkies: Talkie[]): UseTalkiesLiveResult {
  const [talkies, setTalkies] = useState(initialTalkies);
  const [prevInitialTalkies, setPrevInitialTalkies] = useState(initialTalkies);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  if (initialTalkies !== prevInitialTalkies) {
    setPrevInitialTalkies(initialTalkies);
    setTalkies(initialTalkies);
    setRefreshError(null);
  }

  const refresh = useCallback(async () => {
    try {
      setTalkies(await getTalkies());
      setRefreshError(null);
    } catch (error) {
      console.error("Failed to refresh Talkies:", error);
      setRefreshError("Couldn't refresh Talkies. Showing the last loaded list.");
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

  const markListened = useCallback(async (talkieId: string) => {
    let previous: Talkie[] = [];
    const listenedAt = new Date().toISOString();

    setTalkies((current) => {
      previous = current;
      return current.map((talkie) =>
        talkie.id === talkieId && talkie.listenedAt === null
          ? { ...talkie, listenedAt }
          : talkie,
      );
    });

    try {
      const updated = await markTalkieListened(talkieId);
      setTalkies((current) =>
        current.map((talkie) => (talkie.id === talkieId ? updated : talkie)),
      );
    } catch (error) {
      setTalkies(previous);
      console.error("Failed to mark Talkie as listened:", error);
    }
  }, []);

  const handleMessage = useCallback(() => {
    void refresh();
  }, [refresh]);

  const { status: liveStatus } = useEventSource(getTalkiesEventsUrl(), {
    onMessage: handleMessage,
  });

  return {
    talkies,
    liveStatus,
    refreshError,
    removeTalkie,
    markListened,
    retryRefresh: refresh,
  };
}
