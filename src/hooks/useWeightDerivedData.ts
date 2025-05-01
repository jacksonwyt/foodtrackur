import { useMemo } from 'react';
import { WeightEntry } from './useWeightHistoryData'; // Assuming WeightEntry is exported there

// This hook takes the raw weight history and calculates derived values.
export const useWeightDerivedData = (weightHistory: WeightEntry[]) => {

  const chartData = useMemo(() => {
    if (weightHistory.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }
    // Display only the last 7 entries or fewer if not available
    const recentHistory = weightHistory.slice(-7);
    return {
      labels: recentHistory.map(entry =>
        entry.timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      ),
      datasets: [{
        data: recentHistory.map(entry => entry.weight),
      }],
    };
  }, [weightHistory]);

  const weightTrend = useMemo(() => {
    if (weightHistory.length < 2) return 0;
    // Calculate trend based on the displayed chart data (last 7)
    const recentHistory = weightHistory.slice(-7);
    if (recentHistory.length < 2) return 0;
    const firstWeight = recentHistory[0].weight;
    const lastWeight = recentHistory[recentHistory.length - 1].weight;
    return lastWeight - firstWeight;
  }, [weightHistory]);

  const currentWeight = useMemo(() => {
     return weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : null;
  }, [weightHistory])

  const reversedHistory = useMemo(() => {
    // Return a new reversed array to avoid mutating the original
    return [...weightHistory].reverse();
  }, [weightHistory]);

  return {
    chartData,
    weightTrend,
    currentWeight,
    history: reversedHistory, // Renamed from reversedHistory for clarity in consumption
  };
}; 