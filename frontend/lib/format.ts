export function formatTalkieDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) {
    return `Today, ${time}`;
  }

  if (isYesterday) {
    return `Yesterday, ${time}`;
  }

  const day = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${day}, ${time}`;
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function nationalDigits(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

/** Display a stored number as `(205) 555-1234`. Falls back to the original. */
export function formatPhoneNumber(value: string): string {
  const digits = nationalDigits(value);

  if (digits.length !== 10) {
    return value;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Format a contact phone field as the user types. */
export function formatPhoneInput(value: string): string {
  const digits = nationalDigits(value);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length < 4) {
    return `(${digits}`;
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
