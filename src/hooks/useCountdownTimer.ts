import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const calculateTimeLeft = (endDate: Date): TimeLeft => {
  const difference = endDate.getTime() - Date.now();
  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  }
  return timeLeft;
};

export const useCountdownTimer = (endDate: Date) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(endDate));

  useEffect(() => {
    // Initial calculation in useState handles the first render
    // Set interval to update timer every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    // Clear interval on component unmount or if endDate changes
    return () => clearInterval(timer);
  }, [endDate]); // Rerun effect if endDate changes

  return timeLeft;
}; 