import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OnboardingHeaderProps {
  title: string;
  subtitle: string;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 32, // Consistent spacing below header
    paddingHorizontal: 4, // Slight horizontal padding if needed
  },
  title: {
    fontSize: 28, // Adjusted size
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 