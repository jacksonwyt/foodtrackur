import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import theme from '../../constants/theme'; // Import theme

interface ActivityLevelItemProps extends TouchableOpacityProps {
  title: string;
  description: string;
  isSelected: boolean;
  // onPress is inherited from TouchableOpacityProps
}

export const ActivityLevelItem: React.FC<ActivityLevelItemProps> = ({
  title,
  description,
  isSelected,
  style,
  onPress, // Use onPress from props
  ...props // Spread other TouchableOpacityProps
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.activityButton,
        isSelected && styles.selectedActivity,
        style, // Allow custom styles to be passed
      ]}
      onPress={onPress} // Use the passed onPress handler
      activeOpacity={0.7} // Consistent active opacity
      {...props} // Spread remaining props
    >
      <Text style={[styles.activityTitle, isSelected && styles.selectedText]}>
        {title}
      </Text>
      <Text
        style={[styles.activityDescription, isSelected && styles.selectedText]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  activityButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start', // Align text to the left for better readability
    ...theme.shadows.sm, // Added shadow
  } as ViewStyle,
  selectedActivity: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  } as ViewStyle,
  activityTitle: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily,
  } as TextStyle,
  activityDescription: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  } as TextStyle,
  selectedText: {
    color: theme.colors.onPrimary,
  } as TextStyle,
});
