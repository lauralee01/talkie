type EmptyStateProps = {
  children: string;
};

export function EmptyState({ children }: EmptyStateProps) {
  return <p className="text-zinc-500">{children}</p>;
}
