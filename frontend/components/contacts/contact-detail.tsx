"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ContactFormFields } from "@/components/contacts/contact-form-fields";
import { EmptyState } from "@/components/empty-state";
import { CopyablePhone } from "@/components/copyable-phone";
import { SectionHeader } from "@/components/section-header";
import { TalkieCard } from "@/components/talkies/talkie-card";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Pagination, getPageCount, slicePage } from "@/components/ui/pagination";
import { useViewportPageSize } from "@/hooks/use-viewport-page-size";
import { cn } from "@/lib/cn";
import {
  deleteContact,
  getContactMutationErrorMessage,
  updateContact,
  type ContactDetail,
} from "@/lib/contacts-api";
import { getInitials, pluralize } from "@/lib/format";
import {
  deleteTalkie,
  markTalkieListened,
  markTalkieUnread,
  type Talkie,
} from "@/lib/talkies-api";

type ContactDetailViewProps = {
  contact: ContactDetail;
};

export function ContactDetailView({ contact }: ContactDetailViewProps) {
  const router = useRouter();
  const [name, setName] = useState(contact.name);
  const [phoneNumber, setPhoneNumber] = useState(contact.phoneNumber);
  const [talkies, setTalkies] = useState<Talkie[]>(contact.talkies);
  const [page, setPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const updated = await updateContact(contact.id, { name, phoneNumber });
      setName(updated.name);
      setPhoneNumber(updated.phoneNumber);
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      setError(
        getContactMutationErrorMessage(
          error,
          "We couldn't update this contact. Please try again.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  function cancelEditing() {
    setName(contact.name);
    setPhoneNumber(contact.phoneNumber);
    setError(null);
    setIsEditing(false);
  }

  async function confirmDelete() {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteContact(contact.id);
      router.push("/contacts");
      router.refresh();
    } catch (error) {
      setDeleteError(
        getContactMutationErrorMessage(
          error,
          "Couldn't delete this contact. Please try again.",
        ),
      );
      setIsDeleting(false);
    }
  }

  async function removeTalkie(talkieId: string) {
    let previous: Talkie[] = [];

    setTalkies((current) => {
      previous = current;
      return current.filter((talkie) => talkie.id !== talkieId);
    });

    try {
      await deleteTalkie(talkieId);
    } catch (error) {
      setTalkies(previous);
      throw error;
    }
  }

  async function markListened(talkieId: string) {
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
    } catch {
      setTalkies(previous);
    }
  }

  async function markUnread(talkieId: string) {
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
      throw error;
    }
  }

  const { listRef, pageSize } = useViewportPageSize({
    itemCount: talkies.length,
    gapPx: 16,
    fallbackPageSize: talkies.length || 1,
  });
  const pageCount = getPageCount(talkies.length, pageSize);
  const currentPage = Math.min(page, Math.max(1, pageCount));

  if (currentPage !== page) {
    setPage(currentPage);
  }

  const visibleTalkies = slicePage(talkies, currentPage, pageSize);

  return (
    <>
      <Link
        href="/contacts"
        className="mb-8 inline-block text-sm text-muted transition hover:text-foreground"
      >
        ← Contacts
      </Link>

      <header className="mb-10 flex items-start gap-4 sm:mb-12 sm:gap-5">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-muted text-lg font-semibold text-muted sm:size-16 sm:text-xl"
          aria-hidden="true"
        >
          {getInitials(name)}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {name}
          </h1>
          <CopyablePhone
            value={phoneNumber}
            className="mt-1 block text-sm text-muted"
          />
          {talkies.length > 0 ? (
            <p className="mt-2 inline-flex rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted">
              {pluralize(talkies.length, "Talkie")}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                cancelEditing();
              } else {
                setIsEditing(true);
              }
            }}
            className={cn(
              "cursor-pointer rounded-xl px-3 py-2 text-sm font-medium transition",
              isEditing
                ? "text-muted hover:text-foreground"
                : "text-muted hover:bg-surface-muted hover:text-foreground",
            )}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          <button
            type="button"
            onClick={() => {
              setDeleteError(null);
              setIsDeleteOpen(true);
            }}
            aria-label="Delete contact"
            className="cursor-pointer rounded-lg p-2 text-danger transition hover:bg-danger-muted hover:text-danger-hover"
          >
            <TrashIcon />
          </button>
        </div>
      </header>

      {isEditing ? (
        <Card as="form" onSubmit={handleSave} className="mb-10 border-ring/30 sm:mb-12">
          <p className="mb-5 text-sm font-medium text-foreground">Edit contact</p>
          <ContactFormFields
            idPrefix="edit-contact"
            name={name}
            phoneNumber={phoneNumber}
            onNameChange={setName}
            onPhoneNumberChange={setPhoneNumber}
          />

          {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </Card>
      ) : null}

      <section>
        <SectionHeader
          title="Talkies"
          meta={pluralize(talkies.length, "Talkie")}
        />

        {talkies.length === 0 ? (
          <EmptyState>No Talkies from this contact yet.</EmptyState>
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
                  linkToContact={false}
                />
              ))}
            </div>

            <Pagination
              className="mt-6"
              page={currentPage}
              pageSize={pageSize}
              total={talkies.length}
              itemLabel="Talkie"
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      <Modal
        open={isDeleteOpen}
        title="Delete this contact?"
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteOpen(false);
          }
        }}
      >
        <p className="text-sm leading-6 text-muted">
          {name} will be removed from your contacts. Their Talkies will stay in
          your inbox, but won&apos;t be linked to this contact anymore.
        </p>

        {deleteError ? (
          <p className="mt-3 text-sm text-danger">{deleteError}</p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(false)}
            disabled={isDeleting}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void confirmDelete()}
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
