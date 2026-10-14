import { apiFetch } from "@/lib/api-client";

export type TalkieSettings = {
  id: string;
  welcomePrompt: string;
  recordPrompt: string;
  invalidOptionPrompt: string;
  goodbyePrompt: string;
  maxRecordingSeconds: number;
  updatedAt: string;
};

export type UpdateSettingsInput = {
  welcomePrompt?: string;
  recordPrompt?: string;
  invalidOptionPrompt?: string;
  goodbyePrompt?: string;
  maxRecordingSeconds?: number;
};

export function getSettings(): Promise<TalkieSettings> {
  return apiFetch<TalkieSettings>("/settings", { cache: "no-store" });
}

export function updateSettings(
  input: UpdateSettingsInput,
): Promise<TalkieSettings> {
  return apiFetch<TalkieSettings>("/settings", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
