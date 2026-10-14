"use client";

import { useState } from "react";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { SettingsForm } from "@/components/settings/settings-form";
import { getSettings, type TalkieSettings } from "@/lib/settings-api";

type SettingsPanelProps = {
  initialSettings?: TalkieSettings;
  initialError?: string | null;
};

export function SettingsPanel({
  initialSettings,
  initialError = null,
}: SettingsPanelProps) {
  const [settings, setSettings] = useState(initialSettings ?? null);
  const [error, setError] = useState(initialError);
  const [isRetrying, setIsRetrying] = useState(false);

  async function retry() {
    setIsRetrying(true);
    try {
      setSettings(await getSettings());
      setError(null);
    } catch {
      setError(
        "Couldn't load settings. Check that the API is running, then try again.",
      );
    } finally {
      setIsRetrying(false);
    }
  }

  if (error || !settings) {
    return isRetrying ? (
      <LoadingState label="Retrying…" rows={2} />
    ) : (
      <ErrorState
        title="Couldn't load settings"
        message={
          error ??
          "Couldn't load settings. Check that the API is running, then try again."
        }
        onRetry={retry}
      />
    );
  }

  return <SettingsForm initialSettings={settings} />;
}
