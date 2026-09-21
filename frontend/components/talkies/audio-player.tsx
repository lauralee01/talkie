"use client";

import { useRef, useState } from "react";

type AudioPlayerProps = {
    talkieId: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AudioPlayer({ talkieId }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioUrl = `${API_URL}/talkies/${talkieId}/audio`;

    async function togglePlayback() {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (audio.paused) {
            await audio.play();
        } else {
            audio.pause();
        }
    }

    return (
        <div>
            <audio
                ref={audioRef}
                src={audioUrl}
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
            />

            <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause Talkie" : "Play Talkie"}
            >
                {isPlaying ? "Pause" : "Play"}
            </button>
        </div>
    );
}