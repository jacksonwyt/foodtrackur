import { Ionicons } from '@expo/vector-icons';
import { TimeFrame } from './useProgressTimeFrame'; // Import TimeFrame if needed for future filtering

// Define type (Consider moving to a dedicated types file)
export interface Stat {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

// Example data - in a real app, this would be fetched and filtered based on timeFrame
const MOCK_STATS: Stat[] = [
  {
    icon: 'scale',
    label: 'Current Weight',
    value: '74.0 kg',
    change: '-1.5 kg',
    isPositive: true,
  },
  {
    icon: 'flame',
    label: 'Avg. Daily Calories',
    value: '2,150',
    change: '+50',
    isPositive: false,
  },
  {
    icon: 'fitness',
    label: 'Workouts',
    value: '12',
    change: '+3',
    isPositive: true,
  },
  {
    icon: 'trophy',
    label: 'Streak',
    value: '14 days',
    change: '+5',
    isPositive: true,
  },
];

// Accept timeFrame as arg for future use, even if not used in mock data
export const useProgressStatsData = (timeFrame: TimeFrame) => {
    // TODO: Implement actual fetching/filtering based on timeFrame
    const stats = MOCK_STATS;
    const isLoading = false; // Add loading/error states if fetching is async
    const error = null;

    return {
        stats,
        isLoading,
        error,
    };
}; 