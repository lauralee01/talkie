import { parseDurationSeconds } from './duration';

describe('parseDurationSeconds', () => {
  it('parses Bandwidth durations', () => {
    expect(parseDurationSeconds('PT12.5S')).toBe(12.5);
  });

  it('returns 0 for invalid values', () => {
    expect(parseDurationSeconds(undefined)).toBe(0);
    expect(parseDurationSeconds('oops')).toBe(0);
  });
});
