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

export type TalkiesPage = {
  items: Talkie[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type GetTalkiesOptions = {
  page?: number;
  pageSize?: number;
};

export const DEFAULT_TALKIES_PAGE_SIZE = 20;
export const MAX_TALKIES_PAGE_SIZE = 100;

export function isTalkieUnread(talkie: Talkie): boolean {
  return talkie.listenedAt === null;
}

export function getTalkies(
  options: GetTalkiesOptions = {},
): Promise<TalkiesPage> {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? DEFAULT_TALKIES_PAGE_SIZE;
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  return apiFetch<TalkiesPage>(`/talkies?${params.toString()}`, {
    cache: "no-store",
  });
}

export function markTalkieListened(talkieId: string): Promise<Talkie> {
  return apiFetch<Talkie>(`/talkies/${talkieId}/listened`, {
    method: "POST",
  });
}

export function markAllTalkiesListened(): Promise<{ updatedCount: number }> {
  return apiFetch<{ updatedCount: number }>("/talkies/listened", {
    method: "POST",
  });
}

export function markTalkieUnread(talkieId: string): Promise<Talkie> {
  return apiFetch<Talkie>(`/talkies/${talkieId}/unread`, {
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
