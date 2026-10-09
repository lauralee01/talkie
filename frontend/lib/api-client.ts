const DEFAULT_API_URL = "http://localhost:3001";

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
}

type ApiFetchOptions = RequestInit & {
  /** Include JSON Content-Type when a body is present. Defaults to true. */
  json?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { json = true, headers, ...init } = options;
  const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      ...(json && init.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status}): ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
