import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export interface Goal {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

// Keep static data separate for clarity and potential future externalization
const GOALS_DATA: Goal[] = [
  {
    id: 'weight-loss',
    icon: 'trending-down-outline', // Use outline icons
    title: 'Lose Weight',
    description: 'Achieve a healthy weight through balanced nutrition',
  },
  {
    id: 'muscle-gain',
    icon: 'barbell-outline',
    title: 'Build Muscle',
    description: 'Gain muscle mass with proper protein intake',
  },
  {
    id: 'maintenance',
    icon: 'shield-checkmark-outline',
    title: 'Maintain Weight',
    description: 'Keep your current weight while eating healthy',
  },
  {
    id: 'health',
    icon: 'heart-outline',
    title: 'Better Health',
    description: 'Focus on nutrition for overall wellbeing',
  },
  {
    id: 'performance',
    icon: 'flash-outline',
    title: 'Athletic Performance',
    description: 'Optimize nutrition for sports and exercise',
  },
];

export const useGoalsScreenLogic = () => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const goals: Goal[] = GOALS_DATA; // Provide the data

  const selectGoal = (id: string) => {
    setSelectedGoalId(id);
  };

  return {
    goals,
    selectedGoalId,
    selectGoal,
  };
}; 