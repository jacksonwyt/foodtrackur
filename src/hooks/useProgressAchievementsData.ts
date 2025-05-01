import { Ionicons } from '@expo/vector-icons';
import { TimeFrame } from './useProgressTimeFrame'; // Import TimeFrame if needed for future filtering

// Define type (Consider moving to a dedicated types file)
export interface Achievement {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  date: Date;
}

// Example data - in a real app, this would be fetched and filtered based on timeFrame
const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    icon: 'star',
    title: 'First Week Complete',
    description: 'Logged your meals for 7 days straight',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    icon: 'fitness',
    title: 'Exercise Warrior',
    description: 'Completed 10 workouts',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    icon: 'trending-down',
    title: 'Weight Loss Milestone',
    description: 'Lost your first kilogram',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

// Accept timeFrame as arg for future use, even if not used in mock data
export const useProgressAchievementsData = (timeFrame: TimeFrame) => {
    // TODO: Implement actual fetching/filtering based on timeFrame
    const achievements = MOCK_ACHIEVEMENTS;
    const isLoading = false; // Add loading/error states if fetching is async
    const error = null;

    return {
        achievements,
        isLoading,
        error,
    };
}; 