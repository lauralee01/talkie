import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-10 sm:mb-12">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>

          {description ? (
            <div className="mt-3 max-w-lg text-base leading-7 text-muted">
              {description}
            </div>
          ) : null}
        </div>

        {actions}
      </div>
    </header>
  );
}
