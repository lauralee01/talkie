import { getTalkies } from "@/lib/talkies-api";

export default async function Home() {
  const talkies = await getTalkies();

  return (
    <main>
      <h1>Talkie</h1>
      <p>A private line for your favorite people.</p>

      <p>{talkies.length ? talkies.length : 'No'} {talkies.length === 1 ? 'Talkie' : 'Talkies'}</p>

      {talkies.map((talkie) => (
        <div key={talkie.id}>
          <p>From: {talkie.fromNumber}</p>
          <p>Duration: {talkie.durationSeconds} seconds</p>
          <p>Status: {talkie.status}</p>
        </div>
      ))}
    </main>
  );
}