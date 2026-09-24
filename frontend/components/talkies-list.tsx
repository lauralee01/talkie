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

    return (
        <div>
            {talkies.length}{" "}
            {talkies.length === 1 ? "Talkie" : "Talkies"}
        </div>
    );
}