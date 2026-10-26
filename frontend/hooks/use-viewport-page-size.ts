"use client";

import { useLayoutEffect, useRef, useState } from "react";

const SM_BREAKPOINT_PX = 640;
const DEFAULT_PAGINATION_RESERVE_PX = 64;
const MAX_PAGE_SIZE = 100;

type UseViewportPageSizeOptions = {
  itemCount: number;
  gapPx: number;
  fallbackPageSize: number;
  /** Two columns from the Tailwind `sm` viewport breakpoint, matching `sm:grid-cols-2`. */
  columns?: 1 | "auto-2";
  paginationReservePx?: number;
  minItems?: number;
};

export function useViewportPageSize({
  itemCount,
  gapPx,
  fallbackPageSize,
  columns = 1,
  paginationReservePx = DEFAULT_PAGINATION_RESERVE_PX,
  minItems = 1,
}: UseViewportPageSizeOptions) {
  const listRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState(() =>
    Math.max(minItems, fallbackPageSize),
  );

  useLayoutEffect(() => {
    const list = listRef.current;

    if (!list || itemCount <= 0) {
      return;
    }

    function measure() {
      const node = listRef.current;

      if (!node) {
        return;
      }

      const firstItem = node.firstElementChild as HTMLElement | null;

      if (!firstItem) {
        return;
      }

      const itemHeight = firstItem.getBoundingClientRect().height;

      if (itemHeight <= 0) {
        return;
      }

      const top = node.getBoundingClientRect().top;
      const bottomGutter = getPageBottomGutter();
      const available = window.innerHeight - top - bottomGutter;
      const columnCount = getColumnCount(columns);
      const stride = itemHeight + gapPx;
      const rowsWithoutReserve = Math.max(
        1,
        Math.floor((available + gapPx) / stride),
      );
      let fit = rowsWithoutReserve * columnCount;

      if (fit < itemCount) {
        const rowsWithReserve = Math.max(
          1,
          Math.floor((available - paginationReservePx + gapPx) / stride),
        );
        fit = rowsWithReserve * columnCount;
      }

      const next = Math.min(MAX_PAGE_SIZE, Math.max(minItems, fit));

      setPageSize((current) => (current === next ? current : next));
    }

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [columns, gapPx, itemCount, minItems, paginationReservePx]);

  return { listRef, pageSize };
}

function getColumnCount(columns: 1 | "auto-2"): number {
  if (columns === "auto-2") {
    return window.matchMedia(`(min-width: ${SM_BREAKPOINT_PX}px)`).matches
      ? 2
      : 1;
  }

  return 1;
}

function getPageBottomGutter(): number {
  return window.matchMedia(`(min-width: ${SM_BREAKPOINT_PX}px)`).matches
    ? 56
    : 40;
}
