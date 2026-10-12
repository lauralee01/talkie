import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";

export default function Loading() {
  return (
    <PageShell>
      <PageHeader
        title="Your Talkies"
        description="A private line for your favorite people."
      />
      <LoadingState label="Loading Talkies…" />
    </PageShell>
  );
}
