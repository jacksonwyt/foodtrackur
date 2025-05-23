/**
 * Formats a Date object into a YYYY-MM-DD string.
 */
export function formatISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formats a Date object into a full ISO 8601 string (YYYY-MM-DDTHH:mm:ss.sssZ).
 * This is suitable for storing in Supabase timestampz fields.
 */
export function formatISODateForStorage(date: Date): string {
  return date.toISOString();
}

/**
 * Formats a Date object into a human-readable string (e.g., "July 26, 2024").
 */
export function formatReadableDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    // uses locale-specific format
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Parses a YYYY-MM-DD string into a Date object.
 * The date is interpreted as UTC to avoid timezone issues when only the date is relevant.
 */
export function parseISODate(isoDateString: string): Date {
  // Split the string to get year, month, and day
  const parts = isoDateString.split('-').map(part => parseInt(part, 10));
  // Month is 0-indexed in JavaScript Date constructor
  return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
}

// Add other date utility functions here as needed
