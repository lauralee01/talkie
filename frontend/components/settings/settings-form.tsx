"use client";

import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  updateSettings,
  type TalkieSettings,
  type UpdateSettingsInput,
} from "@/lib/settings-api";

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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSavedAt(null);

    const seconds = Number(maxRecordingSeconds);

    if (!Number.isInteger(seconds) || seconds < 10 || seconds > 300) {
      setError("Max recording length must be a whole number between 10 and 300.");
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
      setSavedAt(updated.updatedAt);
    } catch {
      setError("Couldn't save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card as="form" onSubmit={handleSubmit}>
      <div className="space-y-5">
        <PromptField
          id="welcome-prompt"
          label="Welcome greeting"
          description="Played when someone calls your Talkie number."
          value={welcomePrompt}
          onChange={setWelcomePrompt}
        />

        <PromptField
          id="record-prompt"
          label="Record prompt"
          description="Played after the caller presses 1, before recording starts."
          value={recordPrompt}
          onChange={setRecordPrompt}
        />

        <PromptField
          id="invalid-option-prompt"
          label="Invalid option"
          description="Played when the caller presses a key that is not available."
          value={invalidOptionPrompt}
          onChange={setInvalidOptionPrompt}
        />

        <PromptField
          id="goodbye-prompt"
          label="Goodbye message"
          description="Played after the Talkie is saved."
          value={goodbyePrompt}
          onChange={setGoodbyePrompt}
        />

        <div>
          <label
            htmlFor="max-recording-seconds"
            className="text-sm font-medium text-zinc-700"
          >
            Max recording length (seconds)
          </label>
          <p className="mt-1 text-sm text-zinc-500">
            Between 10 and 300 seconds.
          </p>
          <input
            id="max-recording-seconds"
            type="number"
            min={10}
            max={300}
            step={1}
            required
            value={maxRecordingSeconds}
            onChange={(event) => setMaxRecordingSeconds(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950 sm:max-w-xs"
          />
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {savedAt ? (
        <p className="mt-4 text-sm text-zinc-500">Settings saved.</p>
      ) : null}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="cursor-pointer rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </Card>
  );
}

type PromptFieldProps = {
  id: string;
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
};

function PromptField({
  id,
  label,
  description,
  value,
  onChange,
}: PromptFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        rows={3}
        className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-950"
      />
    </div>
  );
}
