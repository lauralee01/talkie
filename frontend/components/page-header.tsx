import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-10 sm:mb-12">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 max-w-lg text-base leading-7 text-zinc-600">
              {description}
            </p>
          ) : null}
        </div>

        {actions}
      </div>
    </header>
  );
}
