import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

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
  return { progress, remaining, strokeDashoffset, safeConsumed, safeGoal }; // Return safe values too
};

export const CalorieSummary: React.FC<CalorieSummaryProps> = ({
  consumed,
  goal,
}) => {
  // Call the helper function to get calculated values including safe defaults
  const { remaining, strokeDashoffset, safeConsumed, safeGoal } = calculateProgressValues(consumed, goal);

  // Removed direct calculations from the component body
  // const progress = Math.min(consumed / goal, 1);
  // const remaining = Math.max(goal - consumed, 0);
  // const progressAngle = progress * 360; // This was calculated but not used
  // const strokeDashoffset = CIRCLE_LENGTH * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Svg width="100%" height="100%" viewBox="0 0 180 180">
          <G rotation="-90" origin="90, 90">
            {/* Background Circle */}
            <Circle
              cx="90"
              cy="90"
              r={CIRCLE_RADIUS}
              stroke="#f0f0f0" // Use a consistent style guide color later
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx="90"
              cy="90"
              r={CIRCLE_RADIUS}
              stroke="#34C759" // Use a consistent style guide color later (e.g., primary green)
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCLE_LENGTH}
              strokeDashoffset={strokeDashoffset} // Use calculated value
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.textContainer}>
          {/* Use safeConsumed */}
          <Text style={styles.consumedText}>{safeConsumed}</Text>
          <Text style={styles.labelText}>calories</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          {/* Use safeGoal */}
          <Text style={styles.statValue}>{safeGoal}</Text>
          <Text style={styles.statLabel}>Daily Goal</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{remaining}</Text> {/* Use calculated remaining */}
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  circleContainer: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Add some space below the circle
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  consumedText: {
    fontSize: 34, // Slightly smaller
    fontWeight: 'bold',
    color: '#1C1C1E',
    lineHeight: 40, // Adjust line height accordingly
  },
  labelText: {
    fontSize: 14, // Slightly smaller
    color: '#8E8E93',
    marginTop: 0, // Adjust spacing
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // Align items vertically
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA', // Use a slightly different color
  },
  statItem: {
    alignItems: 'center',
    flex: 1, // Allow items to take equal space
  },
  statValue: {
    fontSize: 18, // Adjust size
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2, // Add space below value
  },
  statLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 0,
  },
  divider: {
    width: 1,
    height: 40, // Set a fixed height for the divider
    backgroundColor: '#E5E5EA',
  },
}); 