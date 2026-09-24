import { TalkieList } from "@/components/talkies/talkie-list";
import { getTalkies } from "@/lib/talkies-api";

export default async function Home() {
  const talkies = await getTalkies();

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-8 sm:py-14">
        <header className="mb-12">
          <p className="mb-3 text-sm font-medium text-zinc-500">
            Talkie
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Your Talkies
          </h1>

          <p className="mt-3 max-w-lg text-base leading-7 text-zinc-600">
            A private line for your favorite people.
          </p>
        </header>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Recent
            </h2>

            <span className="text-sm text-zinc-500">
              {talkies.length}{" "}
              {talkies.length === 1 ? "Talkie" : "Talkies"}
            </span>
          </div>

          <TalkieList initialTalkies={talkies} />
        </section>
      </div>
    </main>
  );
}