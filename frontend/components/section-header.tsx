type SectionHeaderProps = {
  title: string;
  meta?: string;
};

export function SectionHeader({ title, meta }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between sm:mb-8">
      <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>

      {meta ? <p className="text-sm text-zinc-500">{meta}</p> : null}
    </div>
  );
}
