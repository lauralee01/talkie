"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CopyablePhone } from "@/components/copyable-phone";
import { AudioPlayer } from "@/components/talkies/audio-player";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";
import {
  formatDuration,
  formatPhoneNumber,
  formatTalkieDate,
  getInitials,
} from "@/lib/format";
import { isTalkieUnread, type Talkie } from "@/lib/talkies-api";

type TalkieCardProps = {
  talkie: Talkie;
  onDelete: (talkieId: string) => Promise<void>;
  onListened: (talkieId: string) => Promise<void>;
  onMarkUnread: (talkieId: string) => Promise<void>;
  linkToContact?: boolean;
};

export function TalkieCard({
  talkie,
  onDelete,
  onListened,
  onMarkUnread,
  linkToContact = true,
}: TalkieCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingUnread, setIsMarkingUnread] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unread = isTalkieUnread(talkie);
  const displayName = talkie.contact?.name ?? formatPhoneNumber(talkie.fromNumber);

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
        className={cn(
          "transition hover:border-ring/30",
          unread && "border-primary/25 ring-1 ring-primary/10",
        )}
      >
        <div className="mb-4 flex items-start gap-3 sm:mb-5 sm:gap-4">
          <Avatar unread={unread}>{getInitials(displayName)}</Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <FromLabel
                    talkie={talkie}
                    unread={unread}
                    linkToContact={linkToContact}
                  />
                  {unread ? (
                    <span className="rounded-full bg-inverse px-2 py-0.5 text-[11px] font-medium tracking-wide text-inverse-foreground">
                      New
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-sm text-muted">
                  <time dateTime={talkie.createdAt}>
                    {formatTalkieDate(talkie.createdAt)}
                  </time>
                  <span className="text-subtle"> · </span>
                  {formatDuration(talkie.durationSeconds)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                {!unread ? (
                  <button
                    type="button"
                    onClick={() => void handleMarkUnread()}
                    disabled={isMarkingUnread}
                    aria-label="Mark unread"
                    title="Mark unread"
                    className="cursor-pointer rounded-lg p-1.5 text-muted transition hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <UnreadIcon />
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={openConfirm}
                  disabled={isDeleting}
                  aria-label="Delete Talkie"
                  title="Delete"
                  className="cursor-pointer rounded-lg p-1.5 text-muted transition hover:bg-danger-muted hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        <AudioPlayer
          talkieId={talkie.id}
          durationSeconds={talkie.durationSeconds}
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

function FromLabel({
  talkie,
  unread,
  linkToContact,
}: {
  talkie: Talkie;
  unread: boolean;
  linkToContact: boolean;
}) {
  const className = cn(
    "truncate text-base text-foreground",
    unread ? "font-semibold" : "font-medium",
  );

  if (talkie.contact) {
    if (linkToContact) {
      return (
        <Link
          href={`/contacts/${talkie.contact.id}`}
          className={cn(
            className,
            "transition hover:underline focus-visible:outline-none focus-visible:underline",
          )}
        >
          {talkie.contact.name}
        </Link>
      );
    }

    return <p className={className}>{talkie.contact.name}</p>;
  }

  return (
    <CopyablePhone value={talkie.fromNumber} className={className} />
  );
}

function Avatar({
  unread,
  children,
}: {
  unread: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
        unread
          ? "bg-primary text-primary-foreground"
          : "bg-surface-muted text-muted",
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

function UnreadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 fill-none stroke-current stroke-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7.5h12.5a4 4 0 0 1 0 8H8M4 7.5 7 4.5M4 7.5 7 10.5"
      />
    </svg>
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
