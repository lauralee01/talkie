import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { TalkieList } from "@/components/talkies/talkie-list";
import { loadResult } from "@/lib/load-result";
import { getTalkies } from "@/lib/talkies-api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await loadResult(
    getTalkies,
    "Couldn't load Talkies. Check that the API is running, then try again.",
  );

  return (
    <PageShell>
      <PageHeader
        title="Your Talkies"
        description="A private line for your favorite people."
      />

      {result.ok ? (
        <TalkieList initialPage={result.data} />
      ) : (
        <TalkieList initialError={result.error} />
      )}
    </PageShell>
  );
}
