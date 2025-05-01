import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ExerciseSuggestion {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  caloriesPerMinute: number;
}

interface Props {
  exercise: ExerciseSuggestion;
  isSelected: boolean;
  onPress: (exercise: ExerciseSuggestion) => void;
}

export const ExerciseSuggestionButton: React.FC<Props> = ({ exercise, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.suggestionButton,
        isSelected && styles.selectedSuggestion,
      ]}
      onPress={() => onPress(exercise)}
    >
      <Ionicons
        name={exercise.icon}
        size={24}
        color={isSelected ? '#fff' : '#000'}
      />
      <Text
        style={[
          styles.suggestionText,
          isSelected && styles.selectedText,
        ]}
      >
        {exercise.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedSuggestion: {
    backgroundColor: '#000',
  },
  suggestionText: {
    fontSize: 14,
    color: '#000',
  },
  selectedText: {
    color: '#fff',
  },
}); 