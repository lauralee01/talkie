import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { Navigation } from "@/components/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { AUTH_SESSION_COOKIE } from "@/lib/auth";
import { getMe } from "@/lib/auth-api";
import { ApiError } from "@/lib/api-client";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/">) {
  const jar = await cookies();
  if (!jar.get(AUTH_SESSION_COOKIE)) {
    redirect("/login");
  }

  try {
    await getMe();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login");
    }
    // API down: still render the shell so existing error states can show.
  }

  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Talkie
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Navigation />
            <LogoutButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {children}
    </>
  );
}
