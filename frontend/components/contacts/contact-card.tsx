import type { Contact } from "@/lib/contacts-api";
import { Card } from "@/components/ui/card";

type ContactCardProps = {
  contact: Contact;
};

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <Card as="article" className="sm:p-5">
      <p className="font-medium text-zinc-950">{contact.name}</p>
      <p className="mt-1 text-sm text-zinc-500">{contact.phoneNumber}</p>
    </Card>
  );
}
