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

        return `${minutes}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    }

    return (
        <div className="flex items-center gap-3">
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
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
            >
                {isPlaying ? (
                    <PauseIcon />
                ) : (
                    <PlayIcon />
                )}
            </button>

            <span className="w-9 text-right text-xs tabular-nums text-zinc-500">
                {formatTime(currentTime)}
            </span>

            <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                aria-label="Talkie playback position"
                className="min-w-0 flex-1 cursor-pointer accent-zinc-950"
            />

            <span className="w-9 text-xs tabular-nums text-zinc-500">
                {formatTime(duration)}
            </span>
        </div>
    );
}

function PlayIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-4 fill-current"
        >
            <path d="M8 5.5v13l10-6.5-10-6.5Z" />
        </svg>
    );
}

function PauseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-4 fill-current"
        >
            <path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" />
        </svg>
    );
}