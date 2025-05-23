import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import theme from '../../constants/theme'; // Import the centralized theme

interface OnboardingFooterProps {
  buttonText?: string;
  onPress: () => void;
  disabled?: boolean;
  showIcon?: boolean; // Added prop to control icon visibility
  isLoading?: boolean; // Added isLoading prop
}

const ICON_SIZE = 20;
const ACTIVE_OPACITY = 0.7;
const DISABLED_OPACITY = 1; // Typically, disabled buttons don't change opacity on press

export const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  buttonText = 'Continue',
  onPress,
  disabled = false,
  showIcon = true, // Default to showing the icon
  isLoading = false, // Default isLoading to false
}) => {
  const buttonDynamicStyle: ViewStyle =
    disabled || isLoading ? styles.buttonDisabled : styles.buttonEnabled;
  const textColor =
    disabled || isLoading ? theme.colors.textSecondary : theme.colors.onPrimary;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[styles.buttonBase, buttonDynamicStyle]}
          onPress={onPress}
          disabled={disabled || isLoading}
          activeOpacity={
            disabled || isLoading ? DISABLED_OPACITY : ACTIVE_OPACITY
          }
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{disabled, busy: isLoading}}
          accessibilityLabel={buttonText}>
          {isLoading ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : (
            <>
              <Text style={[styles.buttonText, {color: textColor}]}>
                {buttonText}
              </Text>
              {showIcon && (
                <Ionicons name="arrow-forward" size={ICON_SIZE} color={textColor} />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background, // Use theme background
    borderTopWidth: 1,
    borderTopColor: theme.colors.border, // Use theme border color
  } as ViewStyle,
  footerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    // Adjust bottom padding for safe area, especially on iOS
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.lg,
  } as ViewStyle,
  buttonBase: {
    // Base styles for the button
    borderRadius: theme.borderRadius.round, // Fully rounded
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  } as ViewStyle,
  buttonEnabled: {
    backgroundColor: theme.colors.primary, // Use theme primary color
    ...theme.shadows.md, // Apply medium shadow from theme
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: theme.colors.inactive, // Use a theme color for disabled state (e.g., light gray or specific inactive color)
    // No shadow for disabled state typically
    shadowOpacity: 0,
    elevation: 0,
  } as ViewStyle,
  buttonText: {
    fontSize: theme.typography.sizes.bodyLarge, // Corrected to use bodyLarge or similar from new theme scale
    fontWeight: theme.typography.weights.semibold, // Cast to TextStyle['fontWeight']
    fontFamily: theme.typography.fontFamily,
  } as TextStyle,
});
