/** Parses Bandwidth ISO-8601 durations like `PT12.5S`. */
export function parseDurationSeconds(duration: unknown): number {
  if (typeof duration !== 'string') {
    return 0;
  }

  const match = duration.match(/^PT([\d.]+)S$/);

  if (!match) {
    return 0;
  }

  const seconds = Number(match[1]);
  return Number.isFinite(seconds) ? seconds : 0;
}
