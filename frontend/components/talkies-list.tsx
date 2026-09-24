"use client";

import { useEffect, useState } from "react";
import { getTalkies, Talkie } from "@/lib/talkies-api";

type TalkiesListProps = {
    initialTalkies: Talkie[];
};

export function TalkiesList({
    initialTalkies,
}: TalkiesListProps) {
    const [talkies, setTalkies] = useState(initialTalkies);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const eventSource = new EventSource(
            `${apiUrl}/talkies/events`,
        );

        eventSource.onmessage = async () => {
            const latestTalkies = await getTalkies();
            console.log('Received new talkie', latestTalkies);

            setTalkies(latestTalkies);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            {talkies.length}{" "}
            {talkies.length === 1 ? "Talkie" : "Talkies"}
        </div>
    );
}