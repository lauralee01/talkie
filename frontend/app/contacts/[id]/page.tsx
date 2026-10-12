import { ContactDetailView } from "@/components/contacts/contact-detail";
import { ErrorState } from "@/components/error-state";
import { PageShell } from "@/components/page-shell";
import { getContact } from "@/lib/contacts-api";
import { loadResult } from "@/lib/load-result";

export const dynamic = "force-dynamic";

type ContactPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ContactPageProps) {
  const { id } = await params;
  const result = await loadResult(
    () => getContact(id),
    "Couldn't load contact",
  );

  if (!result.ok) {
    return { title: "Contact" };
  }

  return { title: result.data.name };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { id } = await params;
  const result = await loadResult(
    () => getContact(id),
    "Couldn't load this contact. Check that the API is running, then try again.",
  );

  if (!result.ok) {
    return (
      <PageShell width="wide">
        <ErrorState
          title="Couldn't load contact"
          message={result.error}
        />
      </PageShell>
    );
  }

  return (
    <PageShell width="wide">
      <ContactDetailView contact={result.data} />
    </PageShell>
  );
}
