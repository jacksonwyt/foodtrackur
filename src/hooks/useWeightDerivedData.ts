import {useMemo} from 'react';
// import {WeightLog as WeightEntry} from './useWeightHistoryData'; // Assuming WeightEntry is exported there
import type { WeightLogRow } from '../types/weightLog'; // Import from centralized location

// Interface for the chart data structure
interface WeightChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    // color?: (opacity: number) => string; // Optional: for chart styling
    // strokeWidth?: number; // Optional: for chart styling
  }>;
}

// Interface for the hook's return type
interface UseWeightDerivedDataReturn {
  chartData: WeightChartData;
  weightTrend: number;
  currentWeight: number | null;
  history: WeightLogRow[]; // Use WeightLogRow
}

// This hook takes the raw weight history and calculates derived values.
export const useWeightDerivedData = (
  weightHistory: WeightLogRow[], // Use WeightLogRow
): UseWeightDerivedDataReturn => {
  const chartData: WeightChartData = useMemo(() => {
    if (weightHistory.length === 0) {
      return {
        labels: [],
        datasets: [{data: []}],
      };
    }
    // Display only the last 7 entries or fewer if not available
    const recentHistory = weightHistory.slice(-7);
    return {
      labels: recentHistory.map(entry =>
        new Date(entry.log_date).toLocaleDateString(undefined, { // No need for type assertion
          month: 'short',
          day: 'numeric',
        }),
      ),
      datasets: [
        {
          data: recentHistory.map(entry => entry.weight), // No need for type assertion
          // Example: Add color and strokeWidth if your chart library uses them
          // color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // theme.colors.primary
          // strokeWidth: 2,
        },
      ],
    };
  }, [weightHistory]);

  const weightTrend: number = useMemo(() => {
    if (weightHistory.length < 2) return 0;
    // Calculate trend based on the displayed chart data (last 7)
    const recentHistory = weightHistory.slice(-7);
    if (recentHistory.length < 2) return 0;
    const firstWeight = recentHistory[0].weight;
    const lastWeight = recentHistory[recentHistory.length - 1].weight;
    return lastWeight - firstWeight;
  }, [weightHistory]);

  const currentWeight: number | null = useMemo(() => {
    return weightHistory.length > 0
      ? weightHistory[weightHistory.length - 1].weight
      : null;
  }, [weightHistory]);

  const reversedHistory: WeightLogRow[] = useMemo(() => { // Use WeightLogRow
    // Return a new reversed array to avoid mutating the original
    if (!weightHistory || !Array.isArray(weightHistory)) return []; // Defensive check
    return [...weightHistory].reverse();
  }, [weightHistory]);

  return {
    chartData,
    weightTrend,
    currentWeight,
    history: reversedHistory,
  };
};
