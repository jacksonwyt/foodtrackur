import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, ColorValue } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, withRepeat, withSequence } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '@/components/common/AppText';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import icons

interface GoalProgressBarProps {
  startingWeight: number;
  currentWeight: number;
  goalWeight: number;
  unit?: string; // Added unit for more dynamic text
}

const ICON_SIZE = 20; // Example size for icons
const INDICATOR_ICON_SIZE = ICON_SIZE * 0.9; // Slightly smaller for the moving indicator

const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  startingWeight,
  currentWeight,
  goalWeight,
  unit = 'kg', // Default unit
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const animatedProgress = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  const isGoalReached = useSharedValue(false);

  // Calculate progress percentage
  let progressPercentage = 0;
  const isLosingWeightGoal = startingWeight > goalWeight;

  if (startingWeight !== goalWeight) {
    if (isLosingWeightGoal) {
      const effectiveCurrent = Math.max(currentWeight, goalWeight);
      progressPercentage = ((startingWeight - effectiveCurrent) / (startingWeight - goalWeight)) * 100;
    } else {
      const effectiveCurrent = Math.min(currentWeight, goalWeight);
      progressPercentage = ((effectiveCurrent - startingWeight) / (goalWeight - startingWeight)) * 100;
    }
    progressPercentage = Math.max(0, Math.min(progressPercentage, 100));
  } else {
    progressPercentage = currentWeight === goalWeight ? 100 : 0;
  }

  useEffect(() => {
    animatedProgress.value = withTiming(progressPercentage, { duration: 700 });
    const goalReached = progressPercentage >= 100;
    // Use runOnJS to safely update state that might trigger re-renders from worklet
    runOnJS(setIsGoalReachedValue)(goalReached);

    if (goalReached) {
      // Gentle pulse on completion
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1, // Infinite repeat
        true
      );
    } else {
      pulseAnimation.value = withTiming(1, { duration: 300 }); // Reset if not reached
    }
  }, [progressPercentage, animatedProgress, pulseAnimation]);

  // Helper to bridge state update for isGoalReached.value if needed for React state
  // This example primarily uses shared values for animation, direct React state for isGoalReached isn't strictly necessary
  // for the animations shown, but useful if other components depend on this boolean state from React's perspective.
  const setIsGoalReachedValue = (value: boolean) => {
    // This function is called on the JS thread.
    // If you had a React state like: const [goalReachedReact, setGoalReachedReact] = useState(false);
    // You would call setGoalReachedReact(value); here.
    // For current logic, isGoalReached shared value is primary driver.
  };

  const animatedBarWidthStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value}%`,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  const animatedIndicatorPositionStyle = useAnimatedStyle(() => {
    // Ensure the indicator stays within the bounds of the progress bar
    const clampedProgress = Math.max(0, Math.min(animatedProgress.value, 100));
    return {
      left: `${clampedProgress}%`,
      transform: [{ translateX: -INDICATOR_ICON_SIZE / 2 }], // Center the icon
    };
  });
  
  const getGradientColors = (): readonly [ColorValue, ColorValue, ...ColorValue[]] => {
    // Use primary color with opacity for a lighter start, and solid primary for end
    const primaryStart = `rgba(${theme.colors.primaryRGB}, 0.7)`; // Lighter version of primary
    // Explicitly cast to satisfy the stricter tuple type for LinearGradient
    return [primaryStart, theme.colors.primary] as [ColorValue, ColorValue, ...ColorValue[]];
  };

  let textualCue = '';
  const weightDifference = Math.abs(currentWeight - goalWeight);

  if (progressPercentage >= 100) {
    textualCue = "Goal Achieved! 🎉";
  } else if (startingWeight === goalWeight) {
     textualCue = currentWeight === goalWeight ? "Maintaining goal! 👍" : `Current: ${currentWeight.toFixed(1)}${unit}. Goal: ${goalWeight.toFixed(1)}${unit}`;
  } else {
    const remaining = weightDifference.toFixed(1);
    if (isLosingWeightGoal) {
      textualCue = `${remaining}${unit} to lose.`;
      if (progressPercentage > 85) textualCue = `Almost there! ${remaining}${unit} to lose.`;
    } else {
      textualCue = `${remaining}${unit} to gain.`;
      if (progressPercentage > 85) textualCue = `Almost there! ${remaining}${unit} to gain.`;
    }
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.markersContainer}>
        <View style={[styles.markerIconView, styles.startMarker]}>
          <MaterialCommunityIcons 
            name="flag-variant-outline" 
            size={ICON_SIZE} 
            color={theme.colors.textSecondary} 
          />
        </View>
        <View style={[styles.markerIconView, styles.goalMarker]}>
          <MaterialCommunityIcons 
            name="flag-checkered" 
            size={ICON_SIZE} 
            color={theme.colors.primary} 
          />
        </View>
      </View>

      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={getGradientColors()}
            style={[styles.progressBarForeground, animatedBarWidthStyle]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Animated.View style={[styles.currentWeightIndicator, animatedIndicatorPositionStyle]}>
            <MaterialCommunityIcons 
              name="circle-slice-8" // Example icon, can be changed
              size={INDICATOR_ICON_SIZE} 
              color={theme.colors.secondary} 
              style={styles.indicatorIconItself} // Added for potential fine-tuning
            />
          </Animated.View>
        </View>
      </Animated.View>
      <AppText style={styles.textualCue}>{textualCue}</AppText>
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  outerContainer: {
    marginVertical: theme.spacing.md,
    alignItems: 'center', // Center the progress bar and text
  },
  markersContainer: {
    width: '90%', // Match progress bar width for alignment
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs + 2, // Slightly more space for icons
    paddingHorizontal: ICON_SIZE / 2 - theme.spacing.xxs, // Fine-tune alignment with bar ends
  },
  markerIconView: { // Renamed from markerIcon to avoid confusion with icon itself
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_SIZE, // Ensure the view has a defined width for alignment
    height: ICON_SIZE, // Ensure the view has a defined height for alignment
  },
  startMarker: {
    // Specific styles if needed
  },
  goalMarker: {
    // Specific styles if needed
  },
  container: {
    width: '90%', // Define a width for the container
    marginVertical: theme.spacing.sm,
  },
  textualCue: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm + theme.spacing.xs, // Give more space below progress bar
    textAlign: 'center',
  },
  progressBarBackground: {
    height: 14, // Slightly increased height
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg, // More rounded ends
    overflow: 'visible', // Allow indicator to "float" slightly outside if needed at edges
    position: 'relative', // Needed for absolute positioning of the indicator
    // Subtle "Floating" Effect
    ...Platform.select({
      ios: {
        shadowColor: theme.shadows.md.shadowColor, // Use defined shadow color from theme
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.shadows.md.shadowOpacity, // Use from theme
        shadowRadius: theme.shadows.md.shadowRadius, // Use from theme
      },
      android: {
        elevation: theme.shadows.md.elevation, // Use defined elevation from theme
      },
    }),
  },
  progressBarForeground: {
    height: '100%',
    borderRadius: theme.borderRadius.lg, // Match background for consistent corners
  },
  currentWeightIndicator: {
    position: 'absolute',
    top: (14 / 2) - (INDICATOR_ICON_SIZE / 2),
    height: INDICATOR_ICON_SIZE,
    width: INDICATOR_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    // Add a background to the indicator icon container for better visibility against the gradient if needed
    // backgroundColor: theme.colors.background, 
    // borderRadius: INDICATOR_ICON_SIZE / 2,
  },
  indicatorIconItself: { // Style for the moving icon itself, if needed
    // Example: add a small border or shadow to the icon if it blends too much
    // For a circle-slice-8, it might not need much, but good to have a hook.
  }
});

export default GoalProgressBar; 