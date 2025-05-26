import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {FeatureItem} from './FeatureItem';
import theme from '../../constants/theme'; // Import the centralized theme

export const WelcomeContent: React.FC = () => {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Welcome to FoodTrack</Text>
      <Text style={styles.subtitle}>
        Effortlessly track your food, understand your nutrition, and reach your health goals with AI-powered insights.
      </Text>
      <View style={styles.features}>
        <FeatureItem
          icon="nutrition-outline" // Using outline icons for consistency
          title="AI-Powered Food Scanning"
          description="Quickly log meals by simply scanning your food."
        />
        <FeatureItem
          icon="trending-up-outline"
          title="Personalized Tracking"
          description="Monitor daily calories, macros, and weight to stay on target."
        />
        <FeatureItem
          icon="bulb-outline"
          title="Achieve Your Goals"
          description="Set and reach your weight goals with clear, actionable insights."
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.h1, // Use h1 for largest titles
    fontWeight: theme.typography.weights.bold as 'bold', // Explicitly cast fontWeight
    color: theme.colors.text,
    // fontFamily: theme.typography.fontFamily, // Assuming default system font or handled globally
    marginBottom: theme.spacing.md, // Use theme spacing
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.bodyLarge, // Use bodyLarge or similar appropriate size
    fontWeight: theme.typography.weights.regular as 'normal', // Explicitly cast fontWeight
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
    lineHeight:
      theme.typography.sizes.bodyLarge * theme.typography.lineHeights.normal, // Use theme lineHeights
  },
  features: {
    width: '100%',
    gap: theme.spacing.lg,
  },
});
