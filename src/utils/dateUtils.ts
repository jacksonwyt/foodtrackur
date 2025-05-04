/**
 * Formats a Date object into a YYYY-MM-DD string.
 */
export function formatISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Add other date utility functions here as needed 