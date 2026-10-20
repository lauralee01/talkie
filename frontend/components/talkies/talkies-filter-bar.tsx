"use client";

import { useEffect, useRef } from "react";
import { Select } from "@/components/ui/select";
import {
  DEFAULT_TALKIE_FILTERS,
  hasActiveTalkieFilters,
  type TalkieContactOption,
  type TalkieFilters,
  type TalkieStatusFilter,
} from "@/lib/filter-talkies";

type TalkiesFilterBarProps = {
  filters: TalkieFilters;
  contactOptions: TalkieContactOption[];
  onChange: (filters: TalkieFilters) => void;
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "unread", label: "New only" },
  { value: "listened", label: "Listened" },
] as const;

function isTypingInField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function TalkiesFilterBar({
  filters,
  contactOptions,
  onChange,
}: TalkiesFilterBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const active = hasActiveTalkieFilters(filters);

  const contactSelectOptions = [
    { value: "all", label: "All contacts" },
    { value: "unknown", label: "Unknown callers" },
    ...contactOptions.map((contact) => ({
      value: contact.id,
      label: contact.label,
    })),
  ];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isTypingInField(event.target)
      ) {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (event.key !== "Escape" || event.target !== searchRef.current) {
        return;
      }

      event.preventDefault();

      if (filters.query) {
        onChange({ ...filters, query: "" });
      } else {
        searchRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filters, onChange]);

  return (
    <div className="mb-6 space-y-3 sm:mb-8">
      <label className="relative block">
        <span className="sr-only">Search Talkies</span>
        <input
          ref={searchRef}
          type="search"
          value={filters.query}
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
          placeholder="Search by name or number"
          aria-keyshortcuts="/"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-subtle focus:border-ring"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-surface-muted px-1.5 py-0.5 text-[11px] font-medium text-muted sm:inline">
          /
        </kbd>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          className="min-w-0 flex-1"
          aria-label="Filter by status"
          value={filters.status}
          options={[...STATUS_OPTIONS]}
          onChange={(status) =>
            onChange({
              ...filters,
              status: status as TalkieStatusFilter,
            })
          }
        />

        <Select
          className="min-w-0 flex-1"
          aria-label="Filter by contact"
          value={filters.contactId}
          options={contactSelectOptions}
          onChange={(contactId) => onChange({ ...filters, contactId })}
        />

        {active ? (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_TALKIE_FILTERS)}
            className="cursor-pointer shrink-0 text-sm font-medium text-muted transition hover:text-foreground sm:px-2"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
