import { useState, useEffect } from 'react';

// Example data types (consider moving to src/types/ later)
interface MacroData {
  consumed: number;
  goal: number;
}

interface DailyData {
  calories: MacroData;
  macros: {
    protein: MacroData;
    carbs: MacroData;
    fat: MacroData;
  };
}

// TODO: Replace with actual data fetching logic (e.g., from API, store)
// This simulation should ideally live elsewhere (e.g., API service layer)
const fetchDailyData = async (date: Date): Promise<DailyData> => {
  console.log('[Summary] Fetching data for:', date.toISOString().split('T')[0]);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300)); 
  
  // Return example data for now
  return {
    calories: {
      consumed: 1450 + Math.floor(Math.random() * 100), // Add randomness for demo
      goal: 2000,
    },
    macros: {
      protein: {
        consumed: 85 + Math.floor(Math.random() * 10), // Add randomness for demo
        goal: 150,
      },
      carbs: {
        consumed: 165 + Math.floor(Math.random() * 20), // Add randomness for demo
        goal: 250,
      },
      fat: {
        consumed: 45 + Math.floor(Math.random() * 5), // Add randomness for demo
        goal: 65,
      },
    },
  };
};

export const useHomeSummaryData = (selectedDate: Date) => {
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDailyData(selectedDate);
        if (isMounted) {
          setDailyData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch summary data'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false
    };
  }, [selectedDate]); // Re-run effect when selectedDate changes

  return { dailyData, isLoading, error };
}; 