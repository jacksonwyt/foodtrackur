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
  const today = useMemo(() => new Date(), []);

  const dates = useMemo(() => {
    return Array.from({length: numberOfDays}, (_, i) => {
      // Center the range around roughly today, adjust as needed
      const daysOffset = Math.floor(numberOfDays / 2);
      return addDays(today, i - daysOffset);
    });
  }, [numberOfDays, today]);

  const selectedIndex = useMemo(() => {
    return dates.findIndex(date => isSameDay(date, selectedDate));
  }, [dates, selectedDate]);

  return {
    today,
    dates,
    selectedIndex,
  };
};
