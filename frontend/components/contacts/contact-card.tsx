import Link from "next/link";
import type { Contact } from "@/lib/contacts-api";
import { CopyablePhone } from "@/components/copyable-phone";
import { Card } from "@/components/ui/card";
import { getInitials, pluralize } from "@/lib/format";

type ContactCardProps = {
  contact: Contact;
};

export function ContactCard({ contact }: ContactCardProps) {
  const talkieCount = contact._count?.talkies ?? 0;

  return (
    <Card
      as="article"
      className="relative overflow-hidden p-4 transition hover:border-ring/40 hover:shadow-md sm:p-5"
    >
      <Link
        href={`/contacts/${contact.id}`}
        className="absolute inset-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label={`Open ${contact.name}`}
      />

      <div className="pointer-events-none flex items-center gap-4">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-semibold text-muted"
          aria-hidden="true"
        >
          {getInitials(contact.name)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{contact.name}</p>
          <CopyablePhone
            value={contact.phoneNumber}
            className="relative z-10 mt-0.5 block pointer-events-auto text-sm text-muted"
          />
        </div>

        {talkieCount > 0 ? (
          <span className="hidden rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-muted sm:inline">
            {pluralize(talkieCount, "Talkie")}
          </span>
        ) : null}

        <Chevron />
      </div>
    </Card>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0 text-subtle"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
