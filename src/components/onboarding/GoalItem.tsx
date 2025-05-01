import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Goal } from '../../hooks/useGoalsScreenLogic'; // Import type

interface GoalItemProps {
  goal: Goal;
  isSelected: boolean;
  onPress: () => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({ goal, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.goalCard, isSelected && styles.selectedGoal]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isSelected && styles.selectedIcon]}>
        <Ionicons
          name={goal.icon}
          size={24}
          color={isSelected ? '#fff' : '#007AFF'} // Use theme color for unselected
        />
      </View>
      <View style={styles.goalContent}>
        <Text style={[styles.goalTitle, isSelected && styles.selectedText]}>
          {goal.title}
        </Text>
        <Text style={[styles.goalDescription, isSelected && styles.selectedText]}>
          {goal.description}
        </Text>
      </View>
      <View style={[styles.checkmarkContainer, isSelected && styles.selectedCheckmarkContainer]}>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f5', // Lighter background
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e5',
    gap: 16,
    marginBottom: 12, // Add space between items
  },
  selectedGoal: {
    backgroundColor: '#007AFF', // Use theme color for selected
    borderColor: '#007AFF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e5',
  },
  selectedIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'transparent',
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 18,
  },
  selectedText: {
    color: '#fff',
  },
  checkmarkContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckmarkContainer: {
    // Styles specific to the container when selected, if needed
  },
}); 