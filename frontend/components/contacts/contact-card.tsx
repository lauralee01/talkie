import Link from "next/link";
import type { Contact } from "@/lib/contacts-api";
import { Card } from "@/components/ui/card";
import { pluralize } from "@/lib/format";

type ContactCardProps = {
  contact: Contact;
};

export function ContactCard({ contact }: ContactCardProps) {
  const talkieCount = contact._count?.talkies ?? 0;

  return (
    <Link href={`/contacts/${contact.id}`} className="block rounded-2xl outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2">
      <Card as="article" className="sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-zinc-950">{contact.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{contact.phoneNumber}</p>
          </div>

          <p className="text-sm text-zinc-500">
            {pluralize(talkieCount, "Talkie")}
          </p>
        </div>
      </Card>
    </Link>
  );
}
