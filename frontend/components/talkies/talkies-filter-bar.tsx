"use client";

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

export function TalkiesFilterBar({
  filters,
  contactOptions,
  onChange,
}: TalkiesFilterBarProps) {
  const active = hasActiveTalkieFilters(filters);

  return (
    <div className="mb-6 space-y-3 sm:mb-8">
      <label className="block">
        <span className="sr-only">Search Talkies</span>
        <input
          type="search"
          value={filters.query}
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
          placeholder="Search by name or number"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Filter by status</span>
          <select
            value={filters.status}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as TalkieStatusFilter,
              })
            }
            className="w-full cursor-pointer rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950"
          >
            <option value="all">All statuses</option>
            <option value="unread">New only</option>
            <option value="listened">Listened</option>
          </select>
        </label>

        <label className="min-w-0 flex-1">
          <span className="sr-only">Filter by contact</span>
          <select
            value={filters.contactId}
            onChange={(event) =>
              onChange({ ...filters, contactId: event.target.value })
            }
            className="w-full cursor-pointer rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-950"
          >
            <option value="all">All contacts</option>
            <option value="unknown">Unknown callers</option>
            {contactOptions.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.label}
              </option>
            ))}
          </select>
        </label>

        {active ? (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_TALKIE_FILTERS)}
            className="cursor-pointer shrink-0 text-sm font-medium text-zinc-500 transition hover:text-zinc-950 sm:px-2"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
