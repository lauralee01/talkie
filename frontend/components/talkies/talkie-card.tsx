import type { Talkie } from "@/lib/talkies-api";
import { AudioPlayer } from "./audio-player";
import { formatTalkieDate } from "@/lib/format-date";

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

                <time
                    dateTime={talkie.createdAt}
                    className="text-sm text-zinc-500"
                >
                    {formatTalkieDate(talkie.createdAt)}
                </time>
            </div>

            <AudioPlayer talkieId={talkie.id} />
        </article>
    );
}