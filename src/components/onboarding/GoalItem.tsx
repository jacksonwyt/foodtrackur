import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import type {Goal} from '../../hooks/useGoalsScreenLogic';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme'; // Import Theme for typing

interface GoalItemProps {
  goal: Goal;
  isSelected: boolean;
  onPress: () => void;
}

const ICON_SIZE = 24;
const CHECKMARK_SIZE = 24;
const ACTIVE_OPACITY = 0.7;

// Base style definitions (outside makeStyles, typed with Theme)
const getGoalCardBaseStyle = (theme: Theme): ViewStyle => ({
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.lg,
  borderWidth: 1,
  gap: theme.spacing.md,
  ...theme.shadows.sm,
});

const getIconContainerBaseStyle = (theme: Theme): ViewStyle => ({
  width: 48,
  height: 48,
  borderRadius: theme.borderRadius.round,
  justifyContent: 'center',
  alignItems: 'center',
});

const getGoalTitleBaseStyle = (theme: Theme): TextStyle => ({
  fontSize: theme.typography.sizes.bodyLarge,
  fontWeight: theme.typography.weights.semibold,
  fontFamily: theme.typography.fontFamily,
  marginBottom: theme.spacing.xs,
});

const getGoalDescriptionBaseStyle = (theme: Theme): TextStyle => ({
  fontSize: theme.typography.sizes.body,
  fontWeight: theme.typography.weights.regular,
  fontFamily: theme.typography.fontFamily,
  lineHeight:
    theme.typography.sizes.body * (theme.typography.lineHeights.normal || 1.4),
});

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    goalCard: {
      ...getGoalCardBaseStyle(theme),
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    selectedGoalCard: {
      ...getGoalCardBaseStyle(theme),
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    iconContainer: {
      ...getIconContainerBaseStyle(theme),
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedIconContainer: {
      ...getIconContainerBaseStyle(theme),
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'transparent',
    },
    goalContent: {
      flex: 1,
    },
    goalTitle: {
      ...getGoalTitleBaseStyle(theme),
      color: theme.colors.text,
    },
    selectedGoalTitle: {
      ...getGoalTitleBaseStyle(theme),
      color: theme.colors.onPrimary,
    },
    goalDescription: {
      ...getGoalDescriptionBaseStyle(theme),
      color: theme.colors.textSecondary,
    },
    selectedGoalDescription: {
      ...getGoalDescriptionBaseStyle(theme),
      color: theme.colors.onPrimary,
    },
    checkmarkContainer: {
      width: CHECKMARK_SIZE + theme.spacing.xs,
      height: CHECKMARK_SIZE + theme.spacing.xs,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  isSelected,
  onPress,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const cardStyle = isSelected ? styles.selectedGoalCard : styles.goalCard;
  const iconContainerStyle = isSelected
    ? styles.selectedIconContainer
    : styles.iconContainer;
  const iconColor = isSelected ? theme.colors.onPrimary : theme.colors.primary;
  const titleStyle = isSelected ? styles.selectedGoalTitle : styles.goalTitle;
  const descriptionStyle = isSelected
    ? styles.selectedGoalDescription
    : styles.goalDescription;
  const checkmarkColor = theme.colors.onPrimary;

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={onPress}
      activeOpacity={ACTIVE_OPACITY}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{selected: isSelected}}
      accessibilityLabel={`Goal: ${goal.title}, ${goal.description}`}>
      <View style={iconContainerStyle}>
        <Ionicons name={goal.icon} size={ICON_SIZE} color={iconColor} />
      </View>
      <View style={styles.goalContent}>
        <Text style={titleStyle}>{goal.title}</Text>
        <Text style={descriptionStyle}>{goal.description}</Text>
      </View>
      <View style={styles.checkmarkContainer}>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={CHECKMARK_SIZE}
            color={checkmarkColor}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
