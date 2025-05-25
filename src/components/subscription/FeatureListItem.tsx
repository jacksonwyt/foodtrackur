import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '@/hooks/useTheme';
import type {Theme} from '@/constants/theme';

interface FeatureListItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
}

const FeatureListItem: React.FC<FeatureListItemProps> = ({
  icon,
  title,
  description,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featureIcon: {
    width: theme.spacing.xxxl,
    height: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  featureDescription: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
  },
});

export default FeatureListItem;
