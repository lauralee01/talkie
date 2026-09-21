"use client";

import { useRef, useState } from "react";

type AudioPlayerProps = {
    talkieId: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AudioPlayer({ talkieId }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

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

    function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        const newTime = Number(event.target.value);

        audio.currentTime = newTime;
        setCurrentTime(newTime);
    }

    function formatTime(seconds: number) {
        if (!Number.isFinite(seconds)) {
            return "0:00";
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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
                onTimeUpdate={(event) => {
                    setCurrentTime(event.currentTarget.currentTime);
                }}
                onLoadedMetadata={(event) => {
                    setDuration(event.currentTarget.duration);
                }}
            />

            <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause Talkie" : "Play Talkie"}
            >
                {isPlaying ? "Pause" : "Play"}
            </button>

            <span>{formatTime(currentTime)}</span>

            <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                aria-label="Talkie playback position"
            />

            <span>{formatTime(duration)}</span>
        </div>
    );
}