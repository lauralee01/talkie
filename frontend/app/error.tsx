"use client";

import { ErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <PageShell>
      <PageHeader
        title="Your Talkies"
        description="A private line for your favorite people."
      />
      <ErrorState
        title="Something went wrong"
        message="An unexpected error occurred while loading this page."
        onRetry={reset}
      />
    </PageShell>
  );
}
