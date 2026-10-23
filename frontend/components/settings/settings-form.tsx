"use client";

import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatDuration, formatTalkieDate } from "@/lib/format";
import {
  updateSettings,
  type TalkieSettings,
  type UpdateSettingsInput,
} from "@/lib/settings-api";

const PROMPT_MAX = 500;

const RECORDING_PRESETS = [
  { label: "30s", seconds: 30 },
  { label: "1 min", seconds: 60 },
  { label: "90s", seconds: 90 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
] as const;

type SettingsFormProps = {
  initialSettings: TalkieSettings;
};

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [welcomePrompt, setWelcomePrompt] = useState(
    initialSettings.welcomePrompt,
  );
  const [recordPrompt, setRecordPrompt] = useState(
    initialSettings.recordPrompt,
  );
  const [invalidOptionPrompt, setInvalidOptionPrompt] = useState(
    initialSettings.invalidOptionPrompt,
  );
  const [goodbyePrompt, setGoodbyePrompt] = useState(
    initialSettings.goodbyePrompt,
  );
  const [maxRecordingSeconds, setMaxRecordingSeconds] = useState(
    String(initialSettings.maxRecordingSeconds),
  );
  const [saved, setSaved] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedSeconds = Number(maxRecordingSeconds);
  const dirty =
    welcomePrompt !== saved.welcomePrompt ||
    recordPrompt !== saved.recordPrompt ||
    invalidOptionPrompt !== saved.invalidOptionPrompt ||
    goodbyePrompt !== saved.goodbyePrompt ||
    parsedSeconds !== saved.maxRecordingSeconds;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const seconds = Number(maxRecordingSeconds);

    if (!Number.isInteger(seconds) || seconds < 10 || seconds > 300) {
      setError(
        "Max recording length must be a whole number between 10 and 300.",
      );
      setIsSaving(false);
      return;
    }

    const input: UpdateSettingsInput = {
      welcomePrompt,
      recordPrompt,
      invalidOptionPrompt,
      goodbyePrompt,
      maxRecordingSeconds: seconds,
    };

    try {
      const updated = await updateSettings(input);
      setWelcomePrompt(updated.welcomePrompt);
      setRecordPrompt(updated.recordPrompt);
      setInvalidOptionPrompt(updated.invalidOptionPrompt);
      setGoodbyePrompt(updated.goodbyePrompt);
      setMaxRecordingSeconds(String(updated.maxRecordingSeconds));
      setSaved(updated);
    } catch {
      setError("Couldn't save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10" autoComplete="off">
      <section>
        <SectionHeader title="What callers hear" />

        <Card className="overflow-hidden p-0 sm:p-0">
          <PromptField
            step={1}
            id="welcome-prompt"
            label="Welcome greeting"
            description="Played when someone calls your Talkie number."
            value={welcomePrompt}
            onChange={setWelcomePrompt}
          />
          <PromptField
            step={2}
            id="record-prompt"
            label="Record prompt"
            description="Played after the caller presses 1, before recording starts."
            value={recordPrompt}
            onChange={setRecordPrompt}
          />
          <PromptField
            step={3}
            id="invalid-option-prompt"
            label="Invalid option"
            description="Played when the caller presses a key that isn’t available."
            value={invalidOptionPrompt}
            onChange={setInvalidOptionPrompt}
          />
          <PromptField
            step={4}
            id="goodbye-prompt"
            label="Goodbye message"
            description="Played after the Talkie is saved."
            value={goodbyePrompt}
            onChange={setGoodbyePrompt}
            last
          />
        </Card>
      </section>

      <section>
        <SectionHeader title="Recording" />

        <Card>
          <div className="flex items-start gap-4">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-muted text-muted"
              aria-hidden="true"
            >
              <MicIcon />
            </div>

            <div className="min-w-0 flex-1">
              <label
                htmlFor="max-recording-seconds"
                className="text-sm font-medium text-foreground"
              >
                Max length
              </label>
              <p className="mt-0.5 text-sm text-muted">
                How long a Talkie can be. Between 10 and 300 seconds.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  id="max-recording-seconds"
                  type="number"
                  min={10}
                  max={300}
                  step={1}
                  required
                  value={maxRecordingSeconds}
                  onChange={(event) =>
                    setMaxRecordingSeconds(event.target.value)
                  }
                  className="w-24 rounded-xl border border-border bg-surface-muted px-4 py-3 tabular-nums outline-none transition focus:border-ring focus:bg-surface"
                />
                <p className="text-sm text-muted">
                  {Number.isInteger(parsedSeconds)
                    ? `${formatDuration(parsedSeconds)} max`
                    : "—"}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {RECORDING_PRESETS.map((preset) => {
                  const selected = parsedSeconds === preset.seconds;

                  return (
                    <button
                      key={preset.seconds}
                      type="button"
                      onClick={() =>
                        setMaxRecordingSeconds(String(preset.seconds))
                      }
                      className={cn(
                        "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-muted text-muted hover:text-foreground",
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p
          className={cn(
            "text-sm",
            error ? "text-danger" : "text-muted",
          )}
          role={error ? "alert" : undefined}
        >
          {error
            ? error
            : dirty
              ? "Unsaved changes"
              : `Last saved ${formatTalkieDate(saved.updatedAt)}`}
        </p>

        <button
          type="submit"
          disabled={isSaving || !dirty}
          className="cursor-pointer rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}

type PromptFieldProps = {
  step: number;
  id: string;
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  last?: boolean;
};

function PromptField({
  step,
  id,
  label,
  description,
  value,
  onChange,
  last = false,
}: PromptFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const count = value.length;
  const nearLimit = count > 450;

  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <div className={cn("p-5 sm:p-6", !last && "border-b border-border")}>
      <div className="flex items-start gap-4">
        <span
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-muted"
          aria-hidden="true"
        >
          {step}
        </span>

        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </label>
          <p className="mt-0.5 text-sm text-muted">{description}</p>
          <textarea
            id={id}
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required
            rows={1}
            maxLength={PROMPT_MAX}
            className="mt-3 w-full resize-none overflow-hidden rounded-xl border border-border bg-surface-muted px-4 py-3 outline-none transition placeholder:text-subtle focus:border-ring focus:bg-surface"
          />
          <p
            className={cn(
              "mt-1.5 text-right text-xs tabular-nums",
              nearLimit ? "text-warning-text" : "text-subtle",
            )}
          >
            {count}/{PROMPT_MAX}
          </p>
        </div>
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v2" />
    </svg>
  );
}
