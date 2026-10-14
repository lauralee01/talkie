"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LiveStatus } from "@/components/live-status";
import { LoadingState } from "@/components/loading-state";
import { SectionHeader } from "@/components/section-header";
import { TalkieCard } from "@/components/talkies/talkie-card";
import { TalkiesFilterBar } from "@/components/talkies/talkies-filter-bar";
import { Toast } from "@/components/ui/toast";
import { useTalkiesLive } from "@/hooks/use-talkies-live";
import {
  DEFAULT_TALKIE_FILTERS,
  filterTalkies,
  getTalkieContactOptions,
  hasActiveTalkieFilters,
  type TalkieFilters,
} from "@/lib/filter-talkies";
import { pluralize } from "@/lib/format";
import { getTalkies, isTalkieUnread, type Talkie } from "@/lib/talkies-api";

type TalkieListProps = {
  initialTalkies?: Talkie[];
  initialError?: string | null;
};

export function TalkieList({
  initialTalkies = [],
  initialError = null,
}: TalkieListProps) {
  const [bootstrapError, setBootstrapError] = useState(initialError);
  const [bootstrapTalkies, setBootstrapTalkies] = useState(initialTalkies);
  const [isRetrying, setIsRetrying] = useState(false);
  const [filters, setFilters] = useState<TalkieFilters>(DEFAULT_TALKIE_FILTERS);
  const deferredFilters = useDeferredValue(filters);

  const {
    talkies,
    liveStatus,
    refreshError,
    toast,
    dismissToast,
    removeTalkie,
    markListened,
    retryRefresh,
  } = useTalkiesLive(bootstrapTalkies);

  const contactOptions = useMemo(
    () => getTalkieContactOptions(talkies),
    [talkies],
  );

  const filteredTalkies = useMemo(
    () => filterTalkies(talkies, deferredFilters),
    [talkies, deferredFilters],
  );

  async function retryInitialLoad() {
    setIsRetrying(true);
    try {
      const latest = await getTalkies();
      setBootstrapTalkies(latest);
      setBootstrapError(null);
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
      ? `${pluralize(talkies.length, "Talkie")} · ${pluralize(unreadCount, "new")}`
      : pluralize(talkies.length, "Talkie");

  return (
    <section>
      <SectionHeader
        title="Recent"
        meta={meta}
        aside={<LiveStatus status={liveStatus} />}
      />

      {talkies.length > 0 ? (
        <TalkiesFilterBar
          filters={filters}
          contactOptions={contactOptions}
          onChange={setFilters}
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
        <div className="flex flex-col gap-4">
          {filteredTalkies.map((talkie) => (
            <TalkieCard
              key={talkie.id}
              talkie={talkie}
              onDelete={removeTalkie}
              onListened={markListened}
            />
          ))}
        </div>
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </section>
  );
}
