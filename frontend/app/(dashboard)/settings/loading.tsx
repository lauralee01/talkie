import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";

export default function SettingsLoading() {
  return (
    <PageShell>
      <PageHeader
        title="Settings"
        description="The script and limits for every call to your Talkie line."
      />
      <LoadingState label="Loading settings…" rows={2} />
    </PageShell>
  );
}
