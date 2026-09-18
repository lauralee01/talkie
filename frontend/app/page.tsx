import { TalkieList } from "@/components/talkies/talkie-list";
import { getTalkies } from "@/lib/talkies-api";

export default async function Home() {
  const talkies = await getTalkies();

  return (
    <main>
      <h1>Talkie</h1>
      <p>A private line for your favorite people.</p>

      <p>{talkies.length} Talkies</p>

      <TalkieList talkies={talkies} />
    </main>
  );
}