import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { loadResult } from "@/lib/load-result";
import { getSettings } from "@/lib/settings-api";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const result = await loadResult(
    getSettings,
    "Couldn't load settings. Check that the API is running, then try again.",
  );

  return (
    <PageShell>
      <PageHeader
        title="Settings"
        description="The script and limits for every call to your Talkie line."
      />

      {result.ok ? (
        <SettingsPanel initialSettings={result.data} />
      ) : (
        <SettingsPanel initialError={result.error} />
      )}
    </PageShell>
  );
}
