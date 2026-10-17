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

/** Strip everything except digits so `555-0123` can match `+15550123`. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

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

function matchesTalkieQuery(talkie: Talkie, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const name = (talkie.contact?.name ?? "").toLowerCase();
  if (name.includes(normalizedQuery)) {
    return true;
  }

  const numbers = [talkie.fromNumber, talkie.toNumber];

  if (
    numbers.some((number) => number.toLowerCase().includes(normalizedQuery))
  ) {
    return true;
  }

  const queryDigits = digitsOnly(normalizedQuery);
  if (queryDigits.length === 0) {
    return false;
  }

  return numbers.some((number) => digitsOnly(number).includes(queryDigits));
}

export function filterTalkies(
  talkies: Talkie[],
  filters: TalkieFilters,
): Talkie[] {
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

    return matchesTalkieQuery(talkie, filters.query);
  });
}
