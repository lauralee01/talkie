import type { Talkie } from "@/lib/talkies-api";
import { AudioPlayer } from "./audio-player";

type TalkieCardProps = {
    talkie: Talkie;
};

export function TalkieCard({ talkie }: TalkieCardProps) {
    return (
        <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-zinc-500">
                        From
                    </p>

                    <p className="mt-1 font-medium text-zinc-950">
                        {talkie.fromNumber}
                    </p>
                </div>

                <time className="text-sm text-zinc-500">
                    {new Date(talkie.createdAt).toLocaleDateString()}
                </time>
            </div>

            <AudioPlayer talkieId={talkie.id} />
        </article>
    );
}