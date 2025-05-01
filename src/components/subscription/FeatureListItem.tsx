import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeatureListItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
}

const FeatureListItem: React.FC<FeatureListItemProps> = ({ icon, title, description }) => {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={24} color="#000" />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default FeatureListItem; 