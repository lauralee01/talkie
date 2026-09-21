"use client";

type AudioPlayerProps = {
    talkieId: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AudioPlayer({ talkieId }: AudioPlayerProps) {
    const audioUrl = `${API_URL}/talkies/${talkieId}/audio`;

    return (
        <audio controls preload="metadata">
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support audio playback.
        </audio>
    );
}