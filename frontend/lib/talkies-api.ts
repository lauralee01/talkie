import { apiFetch, getApiUrl } from "@/lib/api-client";

export type Talkie = {
  id: string;
  fromNumber: string;
  toNumber: string;
  durationSeconds: number;
  fileFormat: string;
  status: string;
  createdAt: string;
  contact: {
    id: string;
    name: string;
  } | null;
};

export function getTalkies(): Promise<Talkie[]> {
  return apiFetch<Talkie[]>("/talkies", { cache: "no-store" });
}

export function getTalkieAudioUrl(talkieId: string): string {
  return `${getApiUrl()}/talkies/${talkieId}/audio`;
}

export function getTalkiesEventsUrl(): string {
  return `${getApiUrl()}/talkies/events`;
}
