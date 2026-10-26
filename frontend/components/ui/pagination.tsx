"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { pluralize } from "@/lib/format";

export type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Singular item name, e.g. `"Talkie"` or `"contact"`. */
  itemLabel: string;
  itemLabelPlural?: string;
  disabled?: boolean;
  className?: string;
};

export function getPageCount(total: number, pageSize: number): number {
  if (total <= 0 || pageSize <= 0 || !Number.isFinite(pageSize)) {
    return total > 0 ? 1 : 0;
  }

  return Math.ceil(total / pageSize);
}

export function slicePage<T>(items: T[], page: number, pageSize: number): T[] {
  if (pageSize <= 0 || !Number.isFinite(pageSize)) {
    return items;
  }

  const start = (Math.max(1, page) - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getPageRange(
  page: number,
  pageSize: number,
  total: number,
): { start: number; end: number } {
  if (total <= 0 || pageSize <= 0 || !Number.isFinite(pageSize)) {
    return { start: 0, end: 0 };
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return { start, end };
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  itemLabel,
  itemLabelPlural,
  disabled = false,
  className,
}: PaginationProps) {
  const pageCount = getPageCount(total, pageSize);

  if (pageCount <= 1) {
    return null;
  }

  const current = Math.min(Math.max(1, page), pageCount);
  const { start, end } = getPageRange(current, pageSize, total);
  const pages = getVisiblePages(current, pageCount);
  const atFirst = current <= 1;
  const atLast = current >= pageCount;

  function goTo(nextPage: number) {
    if (disabled) {
      return;
    }

    const clamped = Math.min(Math.max(1, nextPage), pageCount);

    if (clamped !== current) {
      onPageChange(clamped);
    }
  }

  return (
    <nav
      aria-label={`${itemLabel} pagination`}
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted">
        {start}–{end} of {pluralize(total, itemLabel, itemLabelPlural)}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <PageButton
          label="Previous page"
          disabled={disabled || atFirst}
          onClick={() => goTo(current - 1)}
        >
          <Chevron direction="left" />
        </PageButton>

        {pages.map((token, index) =>
          token === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex size-10 items-center justify-center text-sm text-subtle"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <PageButton
              key={token}
              label={`Page ${token}`}
              current={token === current}
              disabled={disabled}
              onClick={() => goTo(token)}
            >
              {token}
            </PageButton>
          ),
        )}

        <PageButton
          label="Next page"
          disabled={disabled || atLast}
          onClick={() => goTo(current + 1)}
        >
          <Chevron direction="right" />
        </PageButton>
      </div>
    </nav>
  );
}

type PageToken = number | "ellipsis";

function getVisiblePages(page: number, pageCount: number): PageToken[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const nearby = new Set<number>([1, pageCount, page, page - 1, page + 1]);

  if (page <= 3) {
    nearby.add(2);
    nearby.add(3);
    nearby.add(4);
  }

  if (page >= pageCount - 2) {
    nearby.add(pageCount - 1);
    nearby.add(pageCount - 2);
    nearby.add(pageCount - 3);
  }

  const sorted = [...nearby]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);

  const tokens: PageToken[] = [];

  for (const value of sorted) {
    const previous = tokens[tokens.length - 1];

    if (typeof previous === "number" && value - previous > 1) {
      tokens.push("ellipsis");
    }

    tokens.push(value);
  }

  return tokens;
}

function PageButton({
  label,
  current = false,
  disabled,
  onClick,
  children,
}: {
  label: string;
  current?: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={current ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-10 cursor-pointer items-center justify-center rounded-xl text-sm font-medium transition",
        current
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-surface text-foreground hover:border-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      {children}
    </button>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="M15 6l-6 6 6 6" />
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  );
}
