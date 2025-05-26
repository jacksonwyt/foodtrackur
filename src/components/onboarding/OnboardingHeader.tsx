import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import theme from '../../constants/theme'; // Import the centralized theme

interface OnboardingHeaderProps {
  title: string;
  subtitle?: string; // Made subtitle optional
  currentStep?: number;
  totalSteps?: number;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
}) => {
  return (
    <View style={styles.headerContainer}>
      {currentStep && totalSteps && (
        <Text style={styles.stepIndicator}>
          Step {currentStep} of {totalSteps}
        </Text>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {/* Conditionally render subtitle */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: theme.spacing.xl, // Use theme spacing
    paddingHorizontal: theme.spacing.md, // Use theme spacing
    alignItems: 'center', // Center align content
  },
  stepIndicator: {
    fontSize: theme.typography.sizes.body, // Use theme typography sizes
    fontWeight: theme.typography.weights.medium, // Use theme typography weights
    color: theme.colors.textSecondary, // Use theme colors
    marginBottom: theme.spacing.xs, // Use theme spacing
    textAlign: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.h1, // Use theme typography sizes
    fontWeight: theme.typography.weights.bold, // Use theme typography weights
    color: theme.colors.text, // Use theme colors
    marginBottom: theme.spacing.sm, // Use theme spacing
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.bodyLarge, // Use theme typography sizes for subtitle
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.textSecondary, // Use theme colors
    textAlign: 'center',
    lineHeight: theme.typography.sizes.bodyLarge * 1.4, // 140% line height
  },
});
