import React from 'react';
import { View, StyleSheet, FlatList, FlatListProps } from 'react-native';
import { GoalItem } from './GoalItem';
import type { Goal } from '../../hooks/useGoalsScreenLogic'; // Import type
import { GoalType } from '@/src/types/navigation'; // Import GoalType

// Extend the props to include standard FlatList props we want to pass through
// We use Omit to prevent conflicts with props we define ourselves (like data, renderItem)
interface GoalsListProps extends Omit<FlatListProps<Goal>, 'data' | 'renderItem'> {
  goals: Goal[];
  selectedGoalId: GoalType | null;
  onSelectGoal: (id: GoalType) => void;
}

export const GoalsList: React.FC<GoalsListProps> = ({ 
  goals, 
  selectedGoalId, 
  onSelectGoal, 
  ...rest // Capture remaining FlatList props
}) => {
  return (
    <FlatList
      data={goals}
      renderItem={({ item }) => (
        <GoalItem
          goal={item}
          isSelected={selectedGoalId === item.id}
          onPress={() => onSelectGoal(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      {...rest} // Spread the rest of the props onto FlatList
    />
  );
};

const styles = StyleSheet.create({
  list: {
    // Styles for the list itself, if needed
  },
}); 