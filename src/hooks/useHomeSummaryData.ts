import {useState, useEffect, useCallback} from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {selectCurrentUser} from '../store/slices/authSlice';
import {getProfile} from '../services/profileService';
import {type Profile} from '../types/profile'; // Updated import path
import {getFoodLogByDate, getRecentFoodLogs} from '../services/foodLogService'; // Import getRecentFoodLogs
import {type FoodLog} from '../types/foodLog'; // Updated import path
import {formatISODate} from '../utils/dateUtils'; // Reverted: Removed .ts extension

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
  recentLogs: FoodLog[]; // Add recentLogs to DailyData
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
    {totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0},
  );
}

export const useHomeSummaryData = (selectedDate: Date) => {
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const currentUser = useSelector(selectCurrentUser, shallowEqual);

  // Memoize dateString to stabilize loadData dependency
  const dateString = formatISODate(selectedDate);

  // Diagnostic: Log currentUser reference changes
  useEffect(() => {
    console.log('[useHomeSummaryData] currentUser reference check effect ran. User ID:', currentUser?.id);
  }, [currentUser]);

  // Diagnostic: Log dateString value changes
  useEffect(() => {
    console.log('[useHomeSummaryData] dateString changed to:', dateString);
  }, [dateString]);

  const loadData = useCallback(async () => {
    console.log(
      '[useHomeSummaryData] Attempting to load data for:',
      dateString, // Use the memoized dateString
    );

    if (!currentUser) {
      console.log(
        '[useHomeSummaryData] No current user found. Skipping data load.',
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log(
        '[useHomeSummaryData] Fetching profile and logs for date:',
        dateString,
      );

      console.log('[useHomeSummaryData] Calling getProfile()...');
      const profilePromise: Promise<Profile | null> = getProfile();
      console.log('[useHomeSummaryData] Calling getFoodLogsByDate()...');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const logsPromise: Promise<FoodLog[] | null> = getFoodLogByDate(
        currentUser.id,
        dateString,
      );
      // Fetch recent logs
      console.log('[useHomeSummaryData] Calling getRecentFoodLogs()...');
      const recentLogsPromise: Promise<FoodLog[] | null> = getRecentFoodLogs(currentUser.id, 3);

      const [profileResult, logsResult, recentLogsResult]: [Profile | null, FoodLog[] | null, FoodLog[] | null] =
        await Promise.all([profilePromise, logsPromise, recentLogsPromise]);
      console.log('[useHomeSummaryData] Promise.all resolved.');
      console.log(
        '[useHomeSummaryData] Profile result:',
        profileResult ? 'Exists' : 'Null/Empty',
      );
      console.log(
        '[useHomeSummaryData] Logs result:',
        logsResult ? `Length: ${logsResult.length}` : 'Null/Empty',
      );
      console.log(
        '[useHomeSummaryData] Recent logs result:',
        recentLogsResult ? `Length: ${recentLogsResult.length}` : 'Null/Empty',
      );

      if (!profileResult) {
        console.error(
          '[useHomeSummaryData] Error: Failed to load user profile (profileResult is null).',
        );
        throw new Error('Failed to load user profile.');
      }
      if (logsResult === null) {
        console.error(
          '[useHomeSummaryData] Error: Failed to load food logs (logsResult is null).',
        );
        throw new Error('Failed to load food logs.');
      }

      const logs = logsResult || [];
      const profile = profileResult;
      const recentLogs = recentLogsResult || []; // Assign recentLogsResult

      console.log('[useHomeSummaryData] Calculating consumed totals...');
      const {totalCalories, totalProtein, totalCarbs, totalFat} =
        calculateConsumedTotals(logs);
      console.log('[useHomeSummaryData] Consumed totals calculated.');

      const newDailyData: DailyData = {
        calories: {
          consumed: Math.round(totalCalories),
          goal: profile.target_calories ?? 0,
        },
        macros: {
          protein: {
            consumed: Math.round(totalProtein),
            goal: profile.target_protein_g ?? 0,
          },
          carbs: {
            consumed: Math.round(totalCarbs),
            goal: profile.target_carbs_g ?? 0,
          },
          fat: {
            consumed: Math.round(totalFat),
            goal: profile.target_fat_g ?? 0,
          },
        },
        recentLogs, // Add recentLogs to newDailyData
      };
      console.log(
        '[useHomeSummaryData] New dailyData prepared. Setting state...',
      );
      setDailyData(newDailyData);
      console.log('[useHomeSummaryData] dailyData state updated.');
    } catch (err) {
      console.error('[useHomeSummaryData] Error in loadData:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to load summary data'),
      );
      setDailyData(null);
    } finally {
      console.log(
        '[useHomeSummaryData] loadData finally block. Setting isLoading to false.',
      );
      setIsLoading(false);
    }
  }, [dateString, currentUser]); // Use memoized dateString in dependency array

  useEffect(() => {
    let isMounted = true;
    if (isMounted && currentUser) {
      console.log(
        '[useHomeSummaryData] useEffect: calling loadData due to selectedDate/currentUser change or initial mount.',
      );
      loadData().catch(err => {
        if (isMounted) {
          console.error(
            '[useHomeSummaryData] Error invoking loadData from useEffect:',
            err,
          );
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to load summary data from useEffect trigger'),
          );
          setDailyData(null);
          setIsLoading(false);
        }
      });
    } else if (isMounted && !currentUser) {
      console.log(
        '[useHomeSummaryData] useEffect: No current user. Clearing data and stopping load.',
      );
      setDailyData(null);
      setIsLoading(false);
    }
    return () => {
      console.log(
        '[useHomeSummaryData] useEffect cleanup: component unmounted or loadData changed.',
      );
      isMounted = false;
    };
  }, [loadData, currentUser]);

  return {dailyData, isLoading, error, refetchData: loadData};
};
