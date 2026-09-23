import { TalkieCard } from "./talkie-card";
import type { Talkie } from "@/lib/talkies-api";

type TalkieListProps = {
    talkies: Talkie[];
};

export function TalkieList({ talkies }: TalkieListProps) {
    if (talkies.length === 0) {
        return (
            <p>
                No Talkies yet. Call your Talkie number to leave your first message.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {talkies.map((talkie) => (
                <TalkieCard
                    key={talkie.id}
                    talkie={talkie}
                />
            ))}
        </div>
    );
}