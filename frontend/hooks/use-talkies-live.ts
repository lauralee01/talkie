"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LiveConnectionStatus } from "@/components/live-status";
import type { ToastMessage } from "@/components/ui/toast";
import { useEventSource } from "@/hooks/use-event-source";
import {
  deleteTalkie,
  getTalkies,
  getTalkiesEventsUrl,
  markTalkieListened,
  markTalkieUnread,
  type Talkie,
} from "@/lib/talkies-api";

type UseTalkiesLiveResult = {
  talkies: Talkie[];
  liveStatus: LiveConnectionStatus;
  refreshError: string | null;
  toast: ToastMessage | null;
  dismissToast: () => void;
  removeTalkie: (talkieId: string) => Promise<void>;
  markListened: (talkieId: string) => Promise<void>;
  markUnread: (talkieId: string) => Promise<void>;
  retryRefresh: () => Promise<void>;
};

function buildNewTalkieToast(newcomers: Talkie[]): ToastMessage | null {
  if (newcomers.length === 0) {
    return null;
  }

  if (newcomers.length === 1) {
    const talkie = newcomers[0];
    const from = talkie.contact?.name ?? talkie.fromNumber;

    return {
      id: talkie.id,
      title: "New Talkie",
      description: `From ${from}`,
    };
  }

  return {
    id: `batch-${Date.now()}`,
    title: "New Talkies",
    description: `${newcomers.length} new messages arrived`,
  };
}

export function useTalkiesLive(initialTalkies: Talkie[]): UseTalkiesLiveResult {
  const [talkies, setTalkies] = useState(initialTalkies);
  const [prevInitialTalkies, setPrevInitialTalkies] = useState(initialTalkies);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const talkiesRef = useRef(talkies);

  useEffect(() => {
    talkiesRef.current = talkies;
  }, [talkies]);

  if (initialTalkies !== prevInitialTalkies) {
    setPrevInitialTalkies(initialTalkies);
    setTalkies(initialTalkies);
    setRefreshError(null);
  }

  const refresh = useCallback(async (announceNew = false) => {
    try {
      const latest = await getTalkies();

      if (announceNew) {
        const existingIds = new Set(
          talkiesRef.current.map((talkie) => talkie.id),
        );
        const newcomers = latest.filter(
          (talkie) => !existingIds.has(talkie.id),
        );
        const nextToast = buildNewTalkieToast(newcomers);

        if (nextToast) {
          setToast(nextToast);
        }
      }

      setTalkies(latest);
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

  const markUnread = useCallback(async (talkieId: string) => {
    let previous: Talkie[] = [];

    setTalkies((current) => {
      previous = current;
      return current.map((talkie) =>
        talkie.id === talkieId ? { ...talkie, listenedAt: null } : talkie,
      );
    });

    try {
      const updated = await markTalkieUnread(talkieId);
      setTalkies((current) =>
        current.map((talkie) => (talkie.id === talkieId ? updated : talkie)),
      );
    } catch (error) {
      setTalkies(previous);
      console.error("Failed to mark Talkie as unread:", error);
      throw error;
    }
  }, []);

  const handleMessage = useCallback(() => {
    void refresh(true);
  }, [refresh]);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const { status: liveStatus } = useEventSource(getTalkiesEventsUrl(), {
    onMessage: handleMessage,
  });

  return {
    talkies,
    liveStatus,
    refreshError,
    toast,
    dismissToast,
    removeTalkie,
    markListened,
    markUnread,
    retryRefresh: () => refresh(false),
  };
}
