import { apiFetch, ApiError } from "@/lib/api-client";
import type { AuthUser } from "@/lib/auth";

export type LoginInput = {
  email: string;
  password: string;
};

export async function login(input: LoginInput): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    skipAuthRedirect: true,
  });
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<void>("/auth/logout", {
      method: "POST",
      skipAuthRedirect: true,
    });
  } catch (error) {
    // Still clear the local session path even if the API is down.
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }
  }
}

export async function getMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me", {
    cache: "no-store",
    skipAuthRedirect: true,
  });
}

export function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) {
    return "Incorrect email or password.";
  }

  return "Couldn't reach Talkie. Check that the API is running, then try again.";
}
