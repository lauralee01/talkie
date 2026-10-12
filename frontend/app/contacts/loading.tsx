import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";

export default function ContactsLoading() {
  return (
    <PageShell width="wide">
      <PageHeader
        title="Contacts"
        description="The people on your private line."
      />
      <LoadingState label="Loading contacts…" rows={4} />
    </PageShell>
  );
}
