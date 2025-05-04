import { useState, useEffect } from 'react';
import { getProfile, Profile } from '../services/profileService';
import { getFoodLogsByDate, FoodLog } from '../services/foodLogService';
import { formatISODate } from '../utils/dateUtils'; // Reverted: Removed .ts extension

// Data types (can remain as is or be refined)
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
  // Optionally include raw logs if needed by the UI
  // logs: FoodLog[];
}

// Helper function to calculate totals from logs
function calculateConsumedTotals(logs: FoodLog[]): {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
} {
  return logs.reduce(
    (totals, log) => {
      totals.totalCalories += log.calories * log.serving_size;
      totals.totalProtein += log.protein * log.serving_size;
      totals.totalCarbs += log.carbs * log.serving_size;
      totals.totalFat += log.fat * log.serving_size;
      return totals;
    },
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  );
}

export const useHomeSummaryData = (selectedDate: Date) => {
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (!isMounted) return;
      setIsLoading(true);
      setError(null);

      try {
        const dateString = formatISODate(selectedDate); // Format date to YYYY-MM-DD

        // Fetch profile and logs in parallel
        const [profileResult, logsResult] = await Promise.all([
          getProfile(),
          getFoodLogsByDate(dateString),
        ]);

        if (!isMounted) return;

        // Handle potential errors or null results
        if (!profileResult) {
          throw new Error('Failed to load user profile.');
        }
        if (logsResult === null) {
          // Treat null logs as an error or just empty logs?
          // Let's assume an error for now, but could be [] if preferred
          throw new Error('Failed to load food logs.');
        }

        const logs = logsResult; // logsResult is FoodLog[] | null, handled above
        const profile = profileResult;

        // Calculate consumed totals
        const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateConsumedTotals(logs);

        // Construct the DailyData object using profile goals and calculated totals
        const newDailyData: DailyData = {
          calories: {
            consumed: Math.round(totalCalories),
            goal: profile.goal_calories ?? 0,
          },
          macros: {
            protein: {
              consumed: Math.round(totalProtein),
              goal: profile.goal_protein ?? 0,
            },
            carbs: {
              consumed: Math.round(totalCarbs),
              goal: profile.goal_carbs ?? 0,
            },
            fat: {
              consumed: Math.round(totalFat),
              goal: profile.goal_fat ?? 0,
            },
          },
          // logs: logs, // Optionally include raw logs
        };

        setDailyData(newDailyData);

      } catch (err) {
        if (!isMounted) return;
        // Log the full error object for better debugging
        console.error('Error loading home summary data. Original error:', err); 
        setError(err instanceof Error ? err : new Error('Failed to load summary data'));
        setDailyData(null); // Clear data on error
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  return { dailyData, isLoading, error };
}; 