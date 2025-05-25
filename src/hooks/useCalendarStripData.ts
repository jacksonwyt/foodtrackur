import {useMemo} from 'react';
import {addDays, isSameDay} from 'date-fns';

interface UseCalendarStripDataProps {
  selectedDate: Date;
  numberOfDays: number;
}

export const useCalendarStripData = ({
  selectedDate,
  numberOfDays,
}: UseCalendarStripDataProps) => {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Normalize today to midnight for consistent 'isToday' checks
    return d;
  }, []);

  const dates = useMemo(() => {
    const halfRange = Math.floor(numberOfDays / 2);
    return Array.from({length: numberOfDays}, (_, i) => {
      return addDays(selectedDate, i - halfRange);
    });
  }, [selectedDate, numberOfDays]);

  const selectedIndex = useMemo(() => {
    // The selectedDate should ideally be one of the dates in the generated array.
    // Find its index.
    const idx = dates.findIndex(date => isSameDay(date, selectedDate));
    
    // If selectedDate, after potential timezone normalization through parseISODate and addDays,
    // doesn't perfectly match by isSameDay, it's an issue.
    // However, given selectedDate is the pivot for generating `dates`, it *should* be found.
    // If not found, it implies a deeper issue with date representations or isSameDay behavior.
    return idx;
    // A more robust approach if selectedIndex HAS to be middle:
    // return Math.floor(numberOfDays / 2);
    // But then we MUST ensure dates[Math.floor(numberOfDays / 2)] IS selectedDate.
  }, [dates, selectedDate]);

  return {
    today,
    dates,
    selectedIndex,
  };
};
