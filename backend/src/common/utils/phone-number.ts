import {
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';

/** Default region when callers omit a country code (e.g. `2055551234`). */
export const DEFAULT_PHONE_COUNTRY: CountryCode = 'US';

export function normalizePhoneNumber(
  value: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): string | null {
  const phoneNumber = parsePhoneNumberFromString(
    value.trim(),
    defaultCountry,
  );

  if (!phoneNumber || !phoneNumber.isValid()) {
    return null;
  }

  return phoneNumber.number;
}
