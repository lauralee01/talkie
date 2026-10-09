import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { TalkieList } from "@/components/talkies/talkie-list";
import { getTalkies } from "@/lib/talkies-api";

export default async function Home() {
  const talkies = await getTalkies();

  return (
    <PageShell>
      <PageHeader
        title="Your Talkies"
        description="A private line for your favorite people."
      />

      <TalkieList initialTalkies={talkies} />
    </PageShell>
  );
}
