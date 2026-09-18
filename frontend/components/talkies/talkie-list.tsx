import type { Talkie } from "@/lib/talkies-api";

type TalkieListProps = {
    talkies: Talkie[];
};

export function TalkieList({ talkies }: TalkieListProps) {
    return (
        <div>
            {talkies.map((talkie) => (
                <div key={talkie.id}>
                    <p>From: {talkie.fromNumber}</p>
                    <p>Duration: {talkie.durationSeconds} seconds</p>
                    <p>Status: {talkie.status}</p>
                </div>
            ))}
        </div>
    );
}