"use client";

import { useState } from "react";
import { ContactCard } from "@/components/contacts/contact-card";
import { EmptyState } from "@/components/empty-state";
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
  const [error, setError] = useState(initialError);
  const [isRetrying, setIsRetrying] = useState(false);

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
        <EmptyState>No contacts yet.</EmptyState>
      ) : (
        <div className="flex flex-col gap-3">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </section>
  );
}
