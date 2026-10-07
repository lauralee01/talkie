import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function normalizePhoneNumber(
    value: string,
): string | null {
    const phoneNumber = parsePhoneNumberFromString(value);

    if (!phoneNumber || !phoneNumber.isValid()) {
        return null;
    }

    return phoneNumber.number;
}