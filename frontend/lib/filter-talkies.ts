import { isTalkieUnread, type Talkie } from "@/lib/talkies-api";

export type TalkieStatusFilter = "all" | "unread" | "listened";

export type TalkieFilters = {
  query: string;
  status: TalkieStatusFilter;
  contactId: string; // "all" | "unknown" | contact uuid
};

export const DEFAULT_TALKIE_FILTERS: TalkieFilters = {
  query: "",
  status: "all",
  contactId: "all",
};

export type TalkieContactOption = {
  id: string;
  label: string;
};

export function getTalkieContactOptions(
  talkies: Talkie[],
): TalkieContactOption[] {
  const options = new Map<string, string>();

  for (const talkie of talkies) {
    if (talkie.contact) {
      options.set(talkie.contact.id, talkie.contact.name);
    }
  }

  return [...options.entries()]
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function hasActiveTalkieFilters(filters: TalkieFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.status !== "all" ||
    filters.contactId !== "all"
  );
}

export function filterTalkies(
  talkies: Talkie[],
  filters: TalkieFilters,
): Talkie[] {
  const query = filters.query.trim().toLowerCase();

  return talkies.filter((talkie) => {
    if (filters.status === "unread" && !isTalkieUnread(talkie)) {
      return false;
    }

    if (filters.status === "listened" && isTalkieUnread(talkie)) {
      return false;
    }

    if (filters.contactId === "unknown" && talkie.contact !== null) {
      return false;
    }

    if (
      filters.contactId !== "all" &&
      filters.contactId !== "unknown" &&
      talkie.contact?.id !== filters.contactId
    ) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      talkie.contact?.name ?? "",
      talkie.fromNumber,
      talkie.toNumber,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}
