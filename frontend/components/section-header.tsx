import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  meta?: string;
  aside?: ReactNode;
};

export function SectionHeader({ title, meta, aside }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
      <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>

      <div className="flex items-center gap-3">
        {aside}
        {meta ? <p className="text-sm text-zinc-500">{meta}</p> : null}
      </div>
    </div>
  );
}
