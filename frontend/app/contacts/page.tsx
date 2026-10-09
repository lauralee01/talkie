import { ContactList } from "@/components/contacts/contact-list";
import { ContactsHeader } from "@/components/contacts/contacts-header";
import { PageShell } from "@/components/page-shell";
import { getContacts } from "@/lib/contacts-api";

export const metadata = {
  title: "Contacts",
};

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <PageShell width="wide">
      <ContactsHeader />
      <ContactList contacts={contacts} />
    </PageShell>
  );
}
