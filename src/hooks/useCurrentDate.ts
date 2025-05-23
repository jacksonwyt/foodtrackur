import {useState, useEffect} from 'react';
import {formatISODate} from '@/utils/dateUtils';

/**
 * Custom hook to get the current date, formatted as YYYY-MM-DD.
 * The date is updated every minute to ensure it remains current.
 * @returns {string} The current date string in YYYY-MM-DD format.
 */
export function useCurrentDate(): string {
  const [currentDate, setCurrentDate] = useState<string>(
    formatISODate(new Date()),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(formatISODate(new Date()));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  return currentDate;
}
