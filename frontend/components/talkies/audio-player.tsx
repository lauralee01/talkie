"use client";

import { useRef, useState } from "react";
import { formatDuration } from "@/lib/format";
import { getTalkieAudioUrl } from "@/lib/talkies-api";

let activeAudio: HTMLAudioElement | null = null;

function setActiveAudio(audio: HTMLAudioElement) {
  if (activeAudio && activeAudio !== audio) {
    activeAudio.pause();
  }

  activeAudio = audio;
}

function clearActiveAudio(audio: HTMLAudioElement) {
  if (activeAudio === audio) {
    activeAudio = null;
  }
}

type AudioPlayerProps = {
  talkieId: string;
  durationSeconds?: number;
  onPlay?: () => void;
};

export function AudioPlayer({
  talkieId,
  durationSeconds = 0,
  onPlay,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);

  const audioUrl = getTalkieAudioUrl(talkieId);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setActiveAudio(audio);
      await audio.play();
    } else {
      audio.pause();
    }
  }

  function handleSeek(event: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Number(event.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }

  function handleEnded() {
    setIsPlaying(false);
    setCurrentTime(0);

    if (audioRef.current) {
      clearActiveAudio(audioRef.current);
      audioRef.current.currentTime = 0;
    }
  }

  return (
    <div className="flex items-center gap-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        crossOrigin="use-credentials"
        preload="none"
        onPlay={(event) => {
          setActiveAudio(event.currentTarget);
          setIsPlaying(true);
          onPlay?.();
        }}
        onPause={(event) => {
          clearActiveAudio(event.currentTarget);
          setIsPlaying(false);
        }}
        onEnded={handleEnded}
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
        className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <span className="w-9 text-right text-xs tabular-nums text-muted">
        {formatDuration(currentTime)}
      </span>

      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.1"
        value={currentTime}
        onChange={handleSeek}
        aria-label="Talkie playback position"
        className="min-w-0 flex-1 cursor-pointer accent-primary"
      />

      <span className="w-9 text-xs tabular-nums text-muted">
        {formatDuration(duration)}
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
