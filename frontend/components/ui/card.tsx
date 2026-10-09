import type {
  FormHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type DivCardProps = BaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, "className" | "children"> & {
    as?: "div";
  };

type ArticleCardProps = BaseProps &
  Omit<HTMLAttributes<HTMLElement>, "className" | "children"> & {
    as: "article";
  };

type FormCardProps = BaseProps &
  Omit<FormHTMLAttributes<HTMLFormElement>, "className" | "children"> & {
    as: "form";
  };

type CardProps = DivCardProps | ArticleCardProps | FormCardProps;

export function Card({ as = "div", children, className, ...props }: CardProps) {
  const classes = cn(
    "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6",
    className,
  );

  if (as === "form") {
    return (
      <form className={classes} {...(props as FormHTMLAttributes<HTMLFormElement>)}>
        {children}
      </form>
    );
  }

  if (as === "article") {
    return (
      <article className={classes} {...(props as HTMLAttributes<HTMLElement>)}>
        {children}
      </article>
    );
  }

  return (
    <div className={classes} {...(props as HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}
