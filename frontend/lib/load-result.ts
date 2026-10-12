export type LoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function loadResult<T>(
  load: () => Promise<T>,
  errorMessage: string,
): Promise<LoadResult<T>> {
  try {
    return { ok: true, data: await load() };
  } catch (error) {
    console.error(errorMessage, error);
    return { ok: false, error: errorMessage };
  }
}
