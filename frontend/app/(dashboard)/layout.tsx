import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
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
      <DashboardHeader />
      {children}
    </>
  );
}
