"use client";

import { ErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SettingsErrorPage({ reset }: ErrorPageProps) {
  return (
    <PageShell>
      <PageHeader
        title="Settings"
        description="The script and limits for every call to your Talkie line."
      />
      <ErrorState
        title="Something went wrong"
        message="An unexpected error occurred while loading settings."
        onRetry={reset}
      />
    </PageShell>
  );
}
