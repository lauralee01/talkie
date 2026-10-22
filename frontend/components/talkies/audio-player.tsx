"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
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
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

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
    <div className="flex items-center gap-3 rounded-2xl bg-surface-muted px-3 py-2.5 sm:gap-4 sm:px-4">
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
          const nextDuration = event.currentTarget.duration;
          if (Number.isFinite(nextDuration) && nextDuration > 0) {
            setDuration(nextDuration);
          }
        }}
      />

      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause Talkie" : "Play Talkie"}
        className={cn(
          "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-primary-foreground shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          isPlaying
            ? "bg-primary-hover"
            : "bg-primary hover:bg-primary-hover",
        )}
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
        style={{
          background: `linear-gradient(to right, var(--primary) ${progress}%, var(--border) ${progress}%)`,
        }}
        className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
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
