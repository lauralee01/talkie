import type { Talkie } from "@/lib/talkies-api";
import { AudioPlayer } from "./audio-player";

type TalkieCardProps = {
    talkie: Talkie;
};

export function TalkieCard({ talkie }: TalkieCardProps) {
    return (
        <article>
            <p>From: {talkie.fromNumber}</p>
            <p>Duration: {talkie.durationSeconds} seconds</p>
            <p>Status: {talkie.status}</p>

            <AudioPlayer talkieId={talkie.id} />
        </article>
    );
}