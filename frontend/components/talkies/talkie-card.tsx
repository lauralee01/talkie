"use client";

import { useState } from "react";
import { AudioPlayer } from "@/components/talkies/audio-player";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";
import { formatTalkieDate } from "@/lib/format";
import { isTalkieUnread, type Talkie } from "@/lib/talkies-api";

type TalkieCardProps = {
  talkie: Talkie;
  onDelete: (talkieId: string) => Promise<void>;
  onListened: (talkieId: string) => Promise<void>;
  onMarkUnread: (talkieId: string) => Promise<void>;
};

export function TalkieCard({
  talkie,
  onDelete,
  onListened,
  onMarkUnread,
}: TalkieCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingUnread, setIsMarkingUnread] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unread = isTalkieUnread(talkie);

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

  async function handleMarkUnread() {
    setIsMarkingUnread(true);
    setError(null);

    try {
      await onMarkUnread(talkie.id);
    } catch {
      setError("Couldn't mark this Talkie as unread. Please try again.");
    } finally {
      setIsMarkingUnread(false);
    }
  }

  return (
    <>
      <Card
        as="article"
        className={cn(unread && "border-primary/15 ring-1 ring-primary/5")}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted">From</p>
              {unread ? (
                <span className="rounded-full bg-inverse px-2 py-0.5 text-[11px] font-medium tracking-wide text-inverse-foreground">
                  New
                </span>
              ) : null}
            </div>

            <p
              className={cn(
                "mt-1 text-foreground",
                unread ? "font-semibold" : "font-medium",
              )}
            >
              {talkie.contact?.name ?? talkie.fromNumber}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <time dateTime={talkie.createdAt} className="text-sm text-muted">
              {formatTalkieDate(talkie.createdAt)}
            </time>

            {!unread ? (
              <button
                type="button"
                onClick={() => void handleMarkUnread()}
                disabled={isMarkingUnread}
                className="cursor-pointer text-sm font-medium text-muted transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isMarkingUnread ? "Updating..." : "Mark unread"}
              </button>
            ) : null}

            <button
              type="button"
              onClick={openConfirm}
              disabled={isDeleting}
              aria-label="Delete Talkie"
              className="cursor-pointer rounded-lg p-1.5 text-danger transition hover:bg-danger-muted hover:text-danger-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        <AudioPlayer
          talkieId={talkie.id}
          onPlay={() => {
            if (unread) {
              void onListened(talkie.id);
            }
          }}
        />

        {error && !isConfirmOpen ? (
          <p className="mt-3 text-sm text-danger">{error}</p>
        ) : null}
      </Card>

      <Modal
        open={isConfirmOpen}
        title="Delete this Talkie?"
        onClose={closeConfirm}
      >
        <p className="text-sm leading-6 text-muted">
          The recording will be removed permanently. This can&apos;t be undone.
        </p>

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeConfirm}
            disabled={isDeleting}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="cursor-pointer rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-danger-foreground transition hover:bg-danger-hover disabled:cursor-not-allowed disabled:opacity-50"
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
