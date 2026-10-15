import { ContactList } from "@/components/contacts/contact-list";
import { ContactsHeader } from "@/components/contacts/contacts-header";
import { PageShell } from "@/components/page-shell";
import { getContacts } from "@/lib/contacts-api";
import { loadResult } from "@/lib/load-result";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contacts",
};

export default async function ContactsPage() {
  const result = await loadResult(
    getContacts,
    "Couldn't load contacts. Check that the API is running, then try again.",
  );

  return (
    <PageShell width="wide">
      <ContactsHeader />

      {result.ok ? (
        <ContactList initialContacts={result.data} />
      ) : (
        <ContactList initialError={result.error} />
      )}
    </PageShell>
  );
}
