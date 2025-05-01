import { useState } from 'react';

// Define type (Consider moving to a dedicated types file if shared)
export type TimeFrame = '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

export const useProgressTimeFrame = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1M');

  return {
    timeFrame,
    setTimeFrame,
  };
}; 