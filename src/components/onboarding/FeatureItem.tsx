import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import theme from '../../constants/theme'; // Import the centralized theme

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const ICON_CONTAINER_SIZE = 48; // Defined for clarity, could be in theme.touchTarget or similar
const ICON_SIZE = 24; // Defined for clarity, could be in theme.iconSizes

export const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
}) => (
  <View style={styles.feature}>
    <View style={styles.featureIconContainer}>
      <Ionicons
        name={icon}
        size={ICON_SIZE}
        color={theme.colors.primary}
      />
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
    gap: theme.spacing.md, // Use theme spacing
  },
  featureIconContainer: {
    width: ICON_CONTAINER_SIZE,
    height: ICON_CONTAINER_SIZE,
    borderRadius: theme.borderRadius.round, // Make it a circle
    backgroundColor: theme.colors.card, // Use card color for background from theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    // fontFamily: theme.typography.fontFamily, // Assuming default system font or handled globally
    marginBottom: theme.spacing.xs, // Use theme spacing
  },
  featureDescription: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.textSecondary,
    // fontFamily: theme.typography.fontFamily, // Assuming default system font or handled globally
    lineHeight: theme.typography.sizes.caption * 1.4, // 140% line height
  },
});
