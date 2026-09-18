import type { Talkie } from "@/lib/talkies-api";

type TalkieCardProps = {
    talkie: Talkie;
};

export function TalkieCard({ talkie }: TalkieCardProps) {
    return (
        <article>
            <p>From: {talkie.fromNumber}</p>
            <p>Duration: {talkie.durationSeconds} seconds</p>
            <p>Status: {talkie.status}</p>
        </article>
    );
}