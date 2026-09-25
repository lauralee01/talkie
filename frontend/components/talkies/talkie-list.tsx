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

    return (
        <>
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                    Recent
                </h2>

                <p className="text-sm text-zinc-500">
                    {talkies.length}{" "}
                    {talkies.length === 1 ? "Talkie" : "Talkies"}
                </p>
            </div>

            {talkies.length === 0 ? (
                <p className="text-zinc-500">
                    No Talkies yet. Call your Talkie number to leave your
                    first message.
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {talkies.map((talkie) => (
                        <TalkieCard
                            key={talkie.id}
                            talkie={talkie}
                        />
                    ))}
                </div>
            )}
        </>
    );
}