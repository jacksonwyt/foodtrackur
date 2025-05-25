import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
import {useTheme} from '@/hooks/useTheme';
import {AppText as Text} from '../common/AppText';

interface CalorieSummaryProps {
  consumed: number;
  goal: number;
}

const CIRCLE_LENGTH = 400; // Circumference of progress circle
const CIRCLE_RADIUS = CIRCLE_LENGTH / (2 * Math.PI);
const STROKE_WIDTH = 15;

// Helper function to calculate progress values
const calculateProgressValues = (consumed: number, goal: number) => {
  const safeConsumed = typeof consumed === 'number' ? Math.max(consumed, 0) : 0;
  const safeGoal = typeof goal === 'number' ? Math.max(goal, 1) : 1; // Ensure goal is at least 1
  const progress = Math.min(safeConsumed / safeGoal, 1); // Progress capped at 100%
  const remaining = Math.max(safeGoal - safeConsumed, 0);
  const strokeDashoffset = CIRCLE_LENGTH * (1 - progress);
  return {progress, remaining, strokeDashoffset, safeConsumed, safeGoal}; // Return safe values too
};

export const CalorieSummary: React.FC<CalorieSummaryProps> = ({
  consumed,
  goal,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  // Call the helper function to get calculated values including safe defaults
  const {remaining, strokeDashoffset, safeConsumed, safeGoal} =
    calculateProgressValues(consumed, goal);

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Svg width="100%" height="100%" viewBox="0 0 180 180">
          <G rotation="-90" origin="90, 90">
            <Circle
              cx="90"
              cy="90"
              r={CIRCLE_RADIUS}
              stroke={theme.colors.border}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <Circle
              cx="90"
              cy="90"
              r={CIRCLE_RADIUS}
              stroke={theme.colors.primary}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCLE_LENGTH}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.textContainer}>
          <Text style={styles.consumedText}>{safeConsumed}</Text>
          <Text style={styles.labelText}>calories</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{safeGoal}</Text>
          <Text style={styles.statLabel}>Daily Goal</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{remaining}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  circleContainer: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  consumedText: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    lineHeight: theme.typography.sizes.h1 * 1.2,
  },
  labelText: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xxs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xxs,
  },
  statLabel: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
  },
  divider: {
    width: 1,
    height: '70%',
    backgroundColor: theme.colors.border,
  },
});
