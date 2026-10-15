import { LoadingState } from "@/components/loading-state";
import { PageShell } from "@/components/page-shell";

export default function ContactLoading() {
  return (
    <PageShell width="wide">
      <LoadingState label="Loading contact…" rows={3} />
    </PageShell>
  );
}
