import { AUTH_SESSION_COOKIE } from "@/lib/auth";

const DEFAULT_API_URL = "http://localhost:3001";

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
}

export class ApiError extends Error {
  status: number;
  path: string;

  constructor(message: string, status: number, path: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
  }
}

type ApiFetchOptions = RequestInit & {
  /** Include JSON Content-Type when a body is present. Defaults to true. */
  json?: boolean;
  /** Skip the client-side 401 → login redirect. */
  skipAuthRedirect?: boolean;
};

async function getServerCookieHeader(): Promise<string | undefined> {
  if (typeof window !== "undefined") {
    return undefined;
  }

  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    const session = jar.get(AUTH_SESSION_COOKIE);
    if (!session) {
      return undefined;
    }

    return jar
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
  } catch {
    return undefined;
  }
}

function redirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }

  const { pathname, search } = window.location;
  if (pathname === "/login") {
    return;
  }

  const next = `${pathname}${search}`;
  const params = new URLSearchParams({ next });
  // Hard navigation: apiFetch can run outside React event handlers.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full reload on auth loss
  window.location.assign(`/login?${params.toString()}`);
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { json = true, headers, skipAuthRedirect = false, ...init } = options;
  const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const cookieHeader = await getServerCookieHeader();

  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(json && init.body ? { "Content-Type": "application/json" } : {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && !skipAuthRedirect) {
      redirectToLogin();
    }

    throw new ApiError(
      `API request failed (${response.status}): ${path}`,
      response.status,
      path,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
