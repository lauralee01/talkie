import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>

          {description ? (
            <div className="mt-1 max-w-lg text-sm leading-6 text-muted">
              {description}
            </div>
          ) : null}
        </div>

        {actions}
      </div>
    </header>
  );
}
