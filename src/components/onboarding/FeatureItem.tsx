import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View style={styles.feature}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={24} color="#333" /> {/* Slightly darker icon */}
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f5', // Slightly different background
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111', // Darker title
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#555', // Slightly darker description
    lineHeight: 20,
  },
}); 