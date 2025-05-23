import {useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {GoalType} from '@/types/navigation'; // Import GoalType

export interface Goal {
  id: GoalType; // Use GoalType for the ID
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

// MVP focused goals as per MVP.md
const GOALS_DATA: Goal[] = [
  {
    id: 'lose',
    icon: 'trending-down-outline',
    title: 'Lose Weight',
    description: 'Reach your target weight with a caloric deficit',
  },
  {
    id: 'maintain',
    icon: 'shield-checkmark-outline',
    title: 'Maintain Weight',
    description: 'Keep your current weight while eating healthy',
  },
  {
    id: 'gain',
    icon: 'barbell-outline',
    title: 'Gain Weight / Muscle',
    description: 'Build mass with a caloric surplus and sufficient protein',
  },
  // Removed other goals like health, performance for MVP onboarding focus
];

export const useGoalsScreenLogic = () => {
  // State now holds GoalType or null
  const [selectedGoalId, setSelectedGoalId] = useState<GoalType | null>(null);

  const goals: Goal[] = GOALS_DATA;

  // Parameter type updated to GoalType
  const selectGoal = (id: GoalType) => {
    setSelectedGoalId(id);
  };

  return {
    goals,
    selectedGoalId,
    selectGoal,
  };
};
