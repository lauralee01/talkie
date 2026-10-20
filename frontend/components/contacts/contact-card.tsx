import Link from "next/link";
import type { Contact } from "@/lib/contacts-api";
import { CopyablePhone } from "@/components/copyable-phone";
import { Card } from "@/components/ui/card";
import { pluralize } from "@/lib/format";

type ContactCardProps = {
  contact: Contact;
};

export function ContactCard({ contact }: ContactCardProps) {
  const talkieCount = contact._count?.talkies ?? 0;

  return (
    <Card as="article" className="sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/contacts/${contact.id}`}
            className="rounded-md font-medium text-foreground outline-none transition hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {contact.name}
          </Link>
          <CopyablePhone
            value={contact.phoneNumber}
            className="mt-1 block text-sm text-muted"
          />
        </div>

        <p className="text-sm text-muted">{pluralize(talkieCount, "Talkie")}</p>
      </div>
    </Card>
  );
}
