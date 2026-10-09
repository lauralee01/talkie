"use client";

import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { TalkieCard } from "@/components/talkies/talkie-card";
import { useTalkiesLive } from "@/hooks/use-talkies-live";
import { pluralize } from "@/lib/format";
import type { Talkie } from "@/lib/talkies-api";

type TalkieListProps = {
  initialTalkies: Talkie[];
};

export function TalkieList({ initialTalkies }: TalkieListProps) {
  const talkies = useTalkiesLive(initialTalkies);

  return (
    <section>
      <SectionHeader
        title="Recent"
        meta={pluralize(talkies.length, "Talkie")}
      />

      {talkies.length === 0 ? (
        <EmptyState>
          No Talkies yet. Call your Talkie number to leave your first message.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-4">
          {talkies.map((talkie) => (
            <TalkieCard key={talkie.id} talkie={talkie} />
          ))}
        </div>
      )}
    </section>
  );
}
