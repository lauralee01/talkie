"use client";

import { useState } from "react";
import { AudioPlayer } from "@/components/talkies/audio-player";
import { Card } from "@/components/ui/card";
import { formatTalkieDate } from "@/lib/format";
import type { Talkie } from "@/lib/talkies-api";

type TalkieCardProps = {
  talkie: Talkie;
  onDelete: (talkieId: string) => Promise<void>;
};

export function TalkieCard({ talkie, onDelete }: TalkieCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this Talkie? The recording will be removed permanently.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(talkie.id);
    } catch {
      setError("Couldn't delete this Talkie. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <Card as="article">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">From</p>
          <p className="mt-1 font-medium text-zinc-950">
            {talkie.contact?.name ?? talkie.fromNumber}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <time dateTime={talkie.createdAt} className="text-sm text-zinc-500">
            {formatTalkieDate(talkie.createdAt)}
          </time>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm text-zinc-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <AudioPlayer talkieId={talkie.id} />

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </Card>
  );
}
