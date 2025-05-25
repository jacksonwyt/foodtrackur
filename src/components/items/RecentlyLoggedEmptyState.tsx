import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme';

interface RecentlyLoggedEmptyStateProps {
  onAddPress: () => void;
}

export const RecentlyLoggedEmptyState: React.FC<
  RecentlyLoggedEmptyStateProps
> = ({onAddPress}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="restaurant-outline" size={40} color={theme.colors.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>No meals logged yet</Text>
      <Text style={styles.emptySubtitle}>
        Log your meals using the + button or quick actions below.
      </Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Ionicons name="add" size={20} color={theme.colors.onPrimary} style={styles.addIcon} />
        <Text style={styles.addButtonText}>Add Your First Meal</Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.sizes.body * theme.typography.lineHeights.normal,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.sm,
  },
  addIcon: {
    marginRight: theme.spacing.sm,
  },
  addButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
  },
});
