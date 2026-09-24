"use client";

import { useEffect, useState } from "react";
import { getTalkies } from "@/lib/talkies-api";
import type { Talkie } from "@/lib/talkies-api";
import { TalkieCard } from "./talkie-card";

type TalkieListProps = {
    initialTalkies: Talkie[];
};

export function TalkieList({
    initialTalkies,
}: TalkieListProps) {
    const [talkies, setTalkies] = useState(initialTalkies);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            console.error("NEXT_PUBLIC_API_URL is not configured");
            return;
        }

        const eventSource = new EventSource(
            `${apiUrl}/talkies/events`,
        );

        eventSource.onmessage = async () => {
            try {
                const latestTalkies = await getTalkies();

                setTalkies(latestTalkies);
            } catch (error) {
                console.error("Failed to refresh Talkies:", error);
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);

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