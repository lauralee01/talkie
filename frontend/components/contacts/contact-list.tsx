"use client";

import { useState } from "react";
import { ContactCard } from "@/components/contacts/contact-card";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { SectionHeader } from "@/components/section-header";
import { getContacts, type Contact } from "@/lib/contacts-api";
import { pluralize } from "@/lib/format";

type ContactListProps = {
  initialContacts?: Contact[];
  initialError?: string | null;
};

export function ContactList({
  initialContacts = [],
  initialError = null,
}: ContactListProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [prevInitialContacts, setPrevInitialContacts] =
    useState(initialContacts);
  const [error, setError] = useState(initialError);
  const [isRetrying, setIsRetrying] = useState(false);

  if (initialContacts !== prevInitialContacts) {
    setPrevInitialContacts(initialContacts);
    setContacts(initialContacts);
    setError(initialError);
  }

  async function retry() {
    setIsRetrying(true);
    try {
      setContacts(await getContacts());
      setError(null);
    } catch {
      setError(
        "Couldn't load contacts. Check that the API is running, then try again.",
      );
    } finally {
      setIsRetrying(false);
    }
  }

  if (error) {
    return (
      <section>
        <SectionHeader title="Your contacts" />
        {isRetrying ? (
          <LoadingState label="Retrying…" rows={2} />
        ) : (
          <ErrorState
            title="Couldn't load contacts"
            message={error}
            onRetry={retry}
          />
        )}
      </section>
    );
  }

  return (
    <section>
      <SectionHeader
        title="Your contacts"
        meta={pluralize(contacts.length, "contact")}
      />

      {contacts.length === 0 ? (
        <EmptyContacts />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyContacts() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
      <div
        className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-surface-muted text-muted"
        aria-hidden="true"
      >
        <PeopleIcon />
      </div>
      <p className="font-medium text-foreground">No contacts yet</p>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted">
        Add someone so incoming Talkies show a name instead of just a number.
      </p>
    </div>
  );
}

function PeopleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
