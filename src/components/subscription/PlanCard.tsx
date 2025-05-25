import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@/hooks/useTheme';
import type {Theme} from '@/constants/theme';

interface PlanCardProps {
  id: string;
  title: string;
  price: number;
  description: string;
  isPopular: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  id,
  title,
  price,
  description,
  isPopular,
  isSelected,
  onSelect,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme, isSelected);
  return (
    <TouchableOpacity
      style={styles.planCard}
      onPress={() => onSelect(id)}>
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{title}</Text>
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
      </View>
      <Text style={styles.planPrice}>
        ${price}
        <Text style={styles.planPeriod}>/mo</Text>
      </Text>
      <Text style={styles.planDescription}>{description}</Text>
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme, isSelected: boolean) => StyleSheet.create({
  planCard: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: isSelected ? theme.colors.primary : theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  planTitle: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
  popularBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xl,
  },
  popularText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.sizes.overline,
    fontWeight: theme.typography.weights.semibold,
  },
  planPrice: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  planPeriod: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.textSecondary,
  },
  planDescription: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
  },
});

export default PlanCard;
