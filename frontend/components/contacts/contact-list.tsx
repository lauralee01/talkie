import type { Contact } from "@/lib/contacts-api";
import { ContactCard } from "@/components/contacts/contact-card";
import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { pluralize } from "@/lib/format";

type ContactListProps = {
  contacts: Contact[];
};

export function ContactList({ contacts }: ContactListProps) {
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
