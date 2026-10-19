"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LiveConnectionStatus } from "@/components/live-status";
import type { ToastMessage } from "@/components/ui/toast";
import { useEventSource } from "@/hooks/use-event-source";
import {
  DEFAULT_TALKIES_PAGE_SIZE,
  deleteTalkie,
  getTalkies,
  getTalkiesEventsUrl,
  markAllTalkiesListened,
  markTalkieListened,
  markTalkieUnread,
  type Talkie,
  type TalkiesPage,
} from "@/lib/talkies-api";

type UseTalkiesLiveResult = {
  talkies: Talkie[];
  total: number;
  hasMore: boolean;
  isLoadingMore: boolean;
  isMarkingAllListened: boolean;
  liveStatus: LiveConnectionStatus;
  refreshError: string | null;
  toast: ToastMessage | null;
  dismissToast: () => void;
  loadMore: () => Promise<void>;
  removeTalkie: (talkieId: string) => Promise<void>;
  markListened: (talkieId: string) => Promise<void>;
  markAllListened: () => Promise<void>;
  markUnread: (talkieId: string) => Promise<void>;
  retryRefresh: () => Promise<void>;
};

type UseTalkiesLiveOptions = {
  initialPage: TalkiesPage;
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

function mergeById(existing: Talkie[], incoming: Talkie[]): Talkie[] {
  const seen = new Set(existing.map((talkie) => talkie.id));
  const additions = incoming.filter((talkie) => !seen.has(talkie.id));
  return [...existing, ...additions];
}

export function useTalkiesLive({
  initialPage,
}: UseTalkiesLiveOptions): UseTalkiesLiveResult {
  const [talkies, setTalkies] = useState(initialPage.items);
  const [page, setPage] = useState(initialPage.page);
  const [total, setTotal] = useState(initialPage.total);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [pageSize] = useState(initialPage.pageSize || DEFAULT_TALKIES_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMarkingAllListened, setIsMarkingAllListened] = useState(false);
  const [prevInitialPage, setPrevInitialPage] = useState(initialPage);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const talkiesRef = useRef(talkies);
  const pageRef = useRef(page);

  useEffect(() => {
    talkiesRef.current = talkies;
  }, [talkies]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  if (initialPage !== prevInitialPage) {
    setPrevInitialPage(initialPage);
    setTalkies(initialPage.items);
    setPage(initialPage.page);
    setTotal(initialPage.total);
    setHasMore(initialPage.hasMore);
    setRefreshError(null);
  }

  const refresh = useCallback(
    async (announceNew = false) => {
      try {
        // One request covering what's already loaded (capped at API max).
        const refreshSize = Math.min(
          100,
          Math.max(pageSize, talkiesRef.current.length),
        );
        const result = await getTalkies({ page: 1, pageSize: refreshSize });
        const latest = result.items;

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
        setPage(Math.max(1, Math.ceil(latest.length / pageSize)));
        setTotal(result.total);
        setHasMore(result.hasMore);
        setRefreshError(null);
      } catch (error) {
        console.error("Failed to refresh Talkies:", error);
        setRefreshError(
          "Couldn't refresh Talkies. Showing the last loaded list.",
        );
      }
    },
    [pageSize],
  );

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const nextPage = pageRef.current + 1;
      const result = await getTalkies({ page: nextPage, pageSize });

      setTalkies((current) => mergeById(current, result.items));
      setPage(result.page);
      setTotal(result.total);
      setHasMore(result.hasMore);
      setRefreshError(null);
    } catch (error) {
      console.error("Failed to load more Talkies:", error);
      setRefreshError("Couldn't load more Talkies. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, pageSize]);

  const removeTalkie = useCallback(async (talkieId: string) => {
    let previous: Talkie[] = [];
    let previousTotal = 0;

    setTalkies((current) => {
      previous = current;
      return current.filter((talkie) => talkie.id !== talkieId);
    });
    setTotal((current) => {
      previousTotal = current;
      return Math.max(0, current - 1);
    });

    try {
      await deleteTalkie(talkieId);
    } catch (error) {
      setTalkies(previous);
      setTotal(previousTotal);
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

  const markAllListened = useCallback(async () => {
    let previous: Talkie[] = [];
    const listenedAt = new Date().toISOString();

    setIsMarkingAllListened(true);
    setTalkies((current) => {
      previous = current;
      return current.map((talkie) =>
        talkie.listenedAt === null ? { ...talkie, listenedAt } : talkie,
      );
    });

    try {
      await markAllTalkiesListened();
      setRefreshError(null);
    } catch (error) {
      setTalkies(previous);
      console.error("Failed to mark all Talkies as listened:", error);
      setRefreshError(
        "Couldn't mark all Talkies as listened. Please try again.",
      );
    } finally {
      setIsMarkingAllListened(false);
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
    total,
    hasMore,
    isLoadingMore,
    isMarkingAllListened,
    liveStatus,
    refreshError,
    toast,
    dismissToast,
    loadMore,
    removeTalkie,
    markListened,
    markAllListened,
    markUnread,
    retryRefresh: () => refresh(false),
  };
}
