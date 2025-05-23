import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../common/AppText';
import {Theme} from '../../constants/theme';

interface Exercise {
  id: string;
  name: string;
  duration: number;
  calories: number;
  timestamp: Date;
}

interface Props {
  exercise: Exercise;
}

const makeStyles = (theme: Theme) => ({
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  exerciseInfo: {
    gap: theme.spacing.xs,
  },
  exerciseName: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
  exerciseDetails: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
  },
  exerciseDate: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
  },
});

export const RecentExerciseItem: React.FC<Props> = ({exercise}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseInfo}>
        <AppText style={styles.exerciseName}>{exercise.name}</AppText>
        <AppText style={styles.exerciseDetails}>
          {exercise.duration} mins • {exercise.calories} cal
        </AppText>
      </View>
      <AppText style={styles.exerciseDate}>
        {new Date(exercise.timestamp).toLocaleDateString()}
      </AppText>
    </View>
  );
};
