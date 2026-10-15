import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { AUTH_SESSION_COOKIE } from "@/lib/auth";
import { getMe } from "@/lib/auth-api";
import { ApiError } from "@/lib/api-client";

export const metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

function safeNextPath(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  return next;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);
  const jar = await cookies();

  if (jar.get(AUTH_SESSION_COOKIE)) {
    try {
      await getMe();
      redirect(nextPath);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        // Session cookie present but API unreachable — still show login.
      }
    }
  }

  return (
    <div className="relative flex min-h-full flex-col">
      <div className="absolute right-6 top-4 sm:right-8">
        <ThemeToggle />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-8">
        <div className="mb-8 text-center">
          <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Talkie
          </p>
          <p className="mt-2 text-sm text-muted">
            Sign in to your private voice inbox.
          </p>
        </div>

        <LoginForm nextPath={nextPath} />
      </main>
    </div>
  );
}
