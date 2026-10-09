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

        <div className="flex items-center gap-3">
          <time dateTime={talkie.createdAt} className="text-sm text-zinc-500">
            {formatTalkieDate(talkie.createdAt)}
          </time>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={isDeleting ? "Deleting Talkie" : "Delete Talkie"}
            className="cursor-pointer rounded-lg p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <AudioPlayer talkieId={talkie.id} />

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </Card>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-none stroke-current stroke-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6m2 0v12.5A1.5 1.5 0 0 1 16.5 20h-9A1.5 1.5 0 0 1 6 18.5V6m3 4v6m6-6v6"
      />
    </svg>
  );
}
