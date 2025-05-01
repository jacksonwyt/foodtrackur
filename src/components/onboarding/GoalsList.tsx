import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { GoalItem } from './GoalItem';
import type { Goal } from '../../hooks/useGoalsScreenLogic'; // Import type

interface GoalsListProps {
  goals: Goal[];
  selectedGoalId: string | null;
  onSelectGoal: (id: string) => void;
}

export const GoalsList: React.FC<GoalsListProps> = ({ goals, selectedGoalId, onSelectGoal }) => {
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
      // Remove contentContainerStyle if FlatList is inside a ScrollView with padding
    />
  );
};

const styles = StyleSheet.create({
  list: {
    // Add styles if needed, e.g., padding
    // paddingVertical: 10, // Example
  },
}); 