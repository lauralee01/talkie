"use client";

import { useState } from "react";
import { ContactCard } from "@/components/contacts/contact-card";
import { EmptyState, PeopleIcon } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { SectionHeader } from "@/components/section-header";
import { Pagination, getPageCount, slicePage } from "@/components/ui/pagination";
import { useViewportPageSize } from "@/hooks/use-viewport-page-size";
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
  const [page, setPage] = useState(1);

  if (initialContacts !== prevInitialContacts) {
    setPrevInitialContacts(initialContacts);
    setContacts(initialContacts);
    setError(initialError);
    setPage(1);
  }

  const { listRef, pageSize } = useViewportPageSize({
    itemCount: contacts.length,
    gapPx: 12,
    fallbackPageSize: contacts.length || 1,
    columns: "auto-2",
  });

  const pageCount = getPageCount(contacts.length, pageSize);
  const currentPage = Math.min(page, Math.max(1, pageCount));

  if (currentPage !== page) {
    setPage(currentPage);
  }

  async function retry() {
    setIsRetrying(true);
    try {
      setContacts(await getContacts());
      setError(null);
      setPage(1);
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

  const visibleContacts = slicePage(contacts, currentPage, pageSize);

  return (
    <section>
      <SectionHeader
        title="Your contacts"
        meta={pluralize(contacts.length, "contact")}
      />

      {contacts.length === 0 ? (
        <EmptyState
          title="No contacts yet"
          description="Add someone so incoming Talkies show a name instead of just a number."
          icon={<PeopleIcon />}
        />
      ) : (
        <>
          <div ref={listRef} className="grid gap-3 sm:grid-cols-2">
            {visibleContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>

          <Pagination
            className="mt-6"
            page={currentPage}
            pageSize={pageSize}
            total={contacts.length}
            itemLabel="contact"
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
