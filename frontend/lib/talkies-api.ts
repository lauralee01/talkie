import { apiFetch, getApiUrl } from "@/lib/api-client";

export type Talkie = {
  id: string;
  fromNumber: string;
  toNumber: string;
  durationSeconds: number;
  fileFormat: string;
  status: string;
  listenedAt: string | null;
  createdAt: string;
  contact: {
    id: string;
    name: string;
  } | null;
};

export function isTalkieUnread(talkie: Talkie): boolean {
  return talkie.listenedAt === null;
}

export function getTalkies(): Promise<Talkie[]> {
  return apiFetch<Talkie[]>("/talkies", { cache: "no-store" });
}

export function markTalkieListened(talkieId: string): Promise<Talkie> {
  return apiFetch<Talkie>(`/talkies/${talkieId}/listened`, {
    method: "POST",
  });
}

export function deleteTalkie(talkieId: string): Promise<void> {
  return apiFetch<void>(`/talkies/${talkieId}`, {
    method: "DELETE",
  });
}

export function getTalkieAudioUrl(talkieId: string): string {
  return `${getApiUrl()}/talkies/${talkieId}/audio`;
}

export function getTalkiesEventsUrl(): string {
  return `${getApiUrl()}/talkies/events`;
}
