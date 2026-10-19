import { normalizePhoneNumber } from './phone-number';

describe('normalizePhoneNumber', () => {
  it('keeps valid E.164 numbers', () => {
    expect(normalizePhoneNumber('+12055551234')).toBe('+12055551234');
  });

  it('parses US local numbers with the default country', () => {
    expect(normalizePhoneNumber('2055551234')).toBe('+12055551234');
    expect(normalizePhoneNumber('(205) 555-1234')).toBe('+12055551234');
    expect(normalizePhoneNumber('205-555-1234')).toBe('+12055551234');
  });

  it('parses numbers with an explicit country code without plus', () => {
    expect(normalizePhoneNumber('12055551234')).toBe('+12055551234');
  });

  it('rejects invalid numbers', () => {
    expect(normalizePhoneNumber('123')).toBeNull();
    expect(normalizePhoneNumber('not-a-number')).toBeNull();
    expect(normalizePhoneNumber('')).toBeNull();
  });
});
