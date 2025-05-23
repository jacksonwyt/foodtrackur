import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../common/AppText';
import {Theme} from '../../constants/theme';

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

const makeStyles = (theme: Theme) => ({
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
  },
  selectedSuggestion: {
    backgroundColor: theme.colors.primary,
  },
  suggestionText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
  },
  selectedText: {
    color: theme.colors.onPrimary,
  },
  icon: {
    color: theme.colors.text,
  },
  selectedIcon: {
    color: theme.colors.onPrimary,
  },
});

export const ExerciseSuggestionButton: React.FC<Props> = ({
  exercise,
  isSelected,
  onPress,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.suggestionButton, isSelected && styles.selectedSuggestion]}
      onPress={() => onPress(exercise)}>
      <Ionicons
        name={exercise.icon}
        size={24}
        style={isSelected ? styles.selectedIcon : styles.icon}
      />
      <AppText style={[styles.suggestionText, isSelected && styles.selectedText]}>
        {exercise.name}
      </AppText>
    </TouchableOpacity>
  );
};
