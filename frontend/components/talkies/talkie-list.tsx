"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LiveStatus } from "@/components/live-status";
import { LoadingState } from "@/components/loading-state";
import { SectionHeader } from "@/components/section-header";
import { TalkieCard } from "@/components/talkies/talkie-card";
import { TalkiesFilterBar } from "@/components/talkies/talkies-filter-bar";
import {
  Pagination,
  getPageCount,
  slicePage,
} from "@/components/ui/pagination";
import { Toast } from "@/components/ui/toast";
import { useTalkiesLive } from "@/hooks/use-talkies-live";
import { useViewportPageSize } from "@/hooks/use-viewport-page-size";
import {
  DEFAULT_TALKIE_FILTERS,
  filterTalkies,
  getTalkieContactOptions,
  hasActiveTalkieFilters,
  type TalkieFilters,
} from "@/lib/filter-talkies";
import { pluralize } from "@/lib/format";
import {
  MAX_TALKIES_PAGE_SIZE,
  getTalkies,
  isTalkieUnread,
  type TalkiesPage,
} from "@/lib/talkies-api";

type TalkieListProps = {
  initialPage?: TalkiesPage;
  initialError?: string | null;
};

const EMPTY_PAGE: TalkiesPage = {
  items: [],
  page: 1,
  pageSize: MAX_TALKIES_PAGE_SIZE,
  total: 0,
  hasMore: false,
};

export function TalkieList({
  initialPage = EMPTY_PAGE,
  initialError = null,
}: TalkieListProps) {
  const [bootstrapError, setBootstrapError] = useState(initialError);
  const [bootstrapPage, setBootstrapPage] = useState(initialPage);
  const [isRetrying, setIsRetrying] = useState(false);
  const [filters, setFilters] = useState<TalkieFilters>(DEFAULT_TALKIE_FILTERS);
  const [page, setPage] = useState(1);
  const deferredFilters = useDeferredValue(filters);

  const {
    talkies,
    total,
    isMarkingAllListened,
    liveStatus,
    refreshError,
    toast,
    dismissToast,
    removeTalkie,
    markListened,
    markAllListened,
    markUnread,
    retryRefresh,
  } = useTalkiesLive({ initialPage: bootstrapPage });

  const contactOptions = useMemo(
    () => getTalkieContactOptions(talkies),
    [talkies],
  );

  const filteredTalkies = useMemo(
    () => filterTalkies(talkies, deferredFilters),
    [talkies, deferredFilters],
  );

  const { listRef, pageSize } = useViewportPageSize({
    itemCount: filteredTalkies.length,
    gapPx: 16,
    fallbackPageSize: filteredTalkies.length || 1,
  });

  const pageCount = getPageCount(filteredTalkies.length, pageSize);
  const currentPage = Math.min(page, Math.max(1, pageCount));

  if (currentPage !== page) {
    setPage(currentPage);
  }

  const visibleTalkies = slicePage(filteredTalkies, currentPage, pageSize);

  async function retryInitialLoad() {
    setIsRetrying(true);
    try {
      const latest = await getTalkies({ page: 1, pageSize: MAX_TALKIES_PAGE_SIZE });
      setBootstrapPage(latest);
      setBootstrapError(null);
      setPage(1);
    } catch {
      setBootstrapError(
        "Couldn't load Talkies. Check that the API is running, then try again.",
      );
    } finally {
      setIsRetrying(false);
    }
  }

  if (bootstrapError) {
    return (
      <section>
        <SectionHeader title="Recent" />
        {isRetrying ? (
          <LoadingState label="Retrying…" rows={2} />
        ) : (
          <ErrorState
            title="Couldn't load Talkies"
            message={bootstrapError}
            onRetry={retryInitialLoad}
          />
        )}
      </section>
    );
  }

  const unreadCount = talkies.filter(isTalkieUnread).length;
  const filtersActive = hasActiveTalkieFilters(filters);
  const meta = filtersActive
    ? `${filteredTalkies.length} of ${pluralize(talkies.length, "Talkie")}`
    : unreadCount > 0
      ? `${pluralize(total, "Talkie")} · ${pluralize(unreadCount, "new")}`
      : pluralize(total, "Talkie");

  return (
    <section>
      <SectionHeader
        title="Recent"
        meta={meta}
        aside={
          <div className="flex items-center gap-3">
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => void markAllListened()}
                disabled={isMarkingAllListened}
                className="cursor-pointer text-sm font-medium text-muted transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isMarkingAllListened ? "Marking…" : "Mark all listened"}
              </button>
            ) : null}
            <LiveStatus status={liveStatus} />
          </div>
        }
      />

      {talkies.length > 0 ? (
        <TalkiesFilterBar
          filters={filters}
          contactOptions={contactOptions}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />
      ) : null}

      {refreshError ? (
        <div className="mb-4">
          <ErrorState
            title="Live update failed"
            message={refreshError}
            onRetry={retryRefresh}
          />
        </div>
      ) : null}

      {talkies.length === 0 ? (
        <EmptyState>
          No Talkies yet. Call your Talkie number to leave your first message.
        </EmptyState>
      ) : filteredTalkies.length === 0 ? (
        <EmptyState>
          No Talkies match your filters. Try a different search or clear filters.
        </EmptyState>
      ) : (
        <>
          <div ref={listRef} className="flex flex-col gap-4">
            {visibleTalkies.map((talkie) => (
              <TalkieCard
                key={talkie.id}
                talkie={talkie}
                onDelete={removeTalkie}
                onListened={markListened}
                onMarkUnread={markUnread}
              />
            ))}
          </div>

          <Pagination
            className="mt-6"
            page={currentPage}
            pageSize={pageSize}
            total={filteredTalkies.length}
            itemLabel="Talkie"
            onPageChange={setPage}
          />
        </>
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </section>
  );
}
