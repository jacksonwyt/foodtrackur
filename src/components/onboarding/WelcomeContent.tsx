import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FeatureItem } from './FeatureItem'; // Corrected import path

// Assuming the illustration path is correct relative to the original WelcomeScreen
const illustration = require('../../../../assets/images/welcome-illustration.png');

export const WelcomeContent: React.FC = () => {
  return (
    <View style={styles.content}>
      <Image
        source={illustration}
        style={styles.illustration}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to CalAI</Text>
      <Text style={styles.subtitle}>
        Your personal AI-powered nutrition assistant
      </Text>
      <View style={styles.features}>
        <FeatureItem
          icon="nutrition-outline" // Using outline icons for consistency
          title="Smart Food Tracking"
          description="Track your meals with AI-powered food recognition"
        />
        <FeatureItem
          icon="trending-up-outline"
          title="Progress Insights"
          description="Get detailed insights about your nutrition journey"
        />
        <FeatureItem
          icon="bulb-outline"
          title="Personalized Tips"
          description="Receive AI-generated nutrition advice"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60, // Adjust as needed, or make dynamic
    paddingBottom: 40, // Add bottom padding
  },
  illustration: {
    width: '80%',
    maxWidth: 300, // Max width for larger screens
    height: 240,
    marginBottom: 40,
  },
  title: {
    fontSize: 30, // Slightly adjusted size
    fontWeight: 'bold',
    color: '#111', // Darker color
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555', // Slightly darker grey
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    gap: 24,
  },
  // Feature styles are now in FeatureItem.tsx
}); 