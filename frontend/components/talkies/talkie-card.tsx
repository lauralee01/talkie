"use client";

import { useState } from "react";
import { AudioPlayer } from "@/components/talkies/audio-player";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { formatTalkieDate } from "@/lib/format";
import type { Talkie } from "@/lib/talkies-api";

type TalkieCardProps = {
  talkie: Talkie;
  onDelete: (talkieId: string) => Promise<void>;
};

export function TalkieCard({ talkie, onDelete }: TalkieCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openConfirm() {
    setError(null);
    setIsConfirmOpen(true);
  }

  function closeConfirm() {
    if (isDeleting) {
      return;
    }

    setIsConfirmOpen(false);
  }

  async function confirmDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      await onDelete(talkie.id);
      setIsConfirmOpen(false);
    } catch {
      setError("Couldn't delete this Talkie. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <>
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
              onClick={openConfirm}
              disabled={isDeleting}
              aria-label="Delete Talkie"
              className="cursor-pointer rounded-lg p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <AudioPlayer talkieId={talkie.id} />
      </Card>

      <Modal
        open={isConfirmOpen}
        title="Delete this Talkie?"
        onClose={closeConfirm}
      >
        <p className="text-sm leading-6 text-zinc-600">
          The recording will be removed permanently. This can't be undone.
        </p>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeConfirm}
            disabled={isDeleting}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
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
