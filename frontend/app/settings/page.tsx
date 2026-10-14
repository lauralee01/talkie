import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
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
        description="Customize appearance and what callers hear on your Talkie line."
      />

      <section className="mb-10 sm:mb-12">
        <SectionHeader title="Appearance" />
        <AppearanceSettings />
      </section>

      <section>
        <SectionHeader title="Call prompts" />
        {result.ok ? (
          <SettingsPanel initialSettings={result.data} />
        ) : (
          <SettingsPanel initialError={result.error} />
        )}
      </section>
    </PageShell>
  );
}
