"use client";

import { ErrorState } from "@/components/error-state";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ContactsErrorPage({ reset }: ErrorPageProps) {
  return (
    <PageShell width="wide">
      <PageHeader
        title="Contacts"
        description="The people on your private line."
      />
      <ErrorState
        title="Something went wrong"
        message="An unexpected error occurred while loading contacts."
        onRetry={reset}
      />
    </PageShell>
  );
}
