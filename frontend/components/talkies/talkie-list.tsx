"use client";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LiveStatus } from "@/components/live-status";
import { LoadingState } from "@/components/loading-state";
import { SectionHeader } from "@/components/section-header";
import { TalkieCard } from "@/components/talkies/talkie-card";
import { useTalkiesLive } from "@/hooks/use-talkies-live";
import { pluralize } from "@/lib/format";
import { getTalkies, isTalkieUnread, type Talkie } from "@/lib/talkies-api";
import { useState } from "react";

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

  const { talkies, liveStatus, refreshError, removeTalkie, markListened, retryRefresh } =
    useTalkiesLive(bootstrapTalkies);

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
  const meta =
    unreadCount > 0
      ? `${pluralize(talkies.length, "Talkie")} · ${pluralize(unreadCount, "new")}`
      : pluralize(talkies.length, "Talkie");

  return (
    <section>
      <SectionHeader
        title="Recent"
        meta={meta}
        aside={<LiveStatus status={liveStatus} />}
      />

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
      ) : (
        <div className="flex flex-col gap-4">
          {talkies.map((talkie) => (
            <TalkieCard
              key={talkie.id}
              talkie={talkie}
              onDelete={removeTalkie}
              onListened={markListened}
            />
          ))}
        </div>
      )}
    </section>
  );
}
