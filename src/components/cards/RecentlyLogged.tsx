import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import {FoodLogListItem, FoodLogItem} from '../items/FoodLogListItem';
import {RecentlyLoggedEmptyState} from '../items/RecentlyLoggedEmptyState';
import {useTheme} from '@/hooks/useTheme';
import type {Theme} from '@/constants/theme';

interface RecentlyLoggedProps {
  items: FoodLogItem[];
  onItemPress: (item: FoodLogItem) => void;
  onViewAllPress: () => void;
  onAddPress: () => void;
}

export const RecentlyLogged: React.FC<RecentlyLoggedProps> = ({
  items,
  onItemPress,
  onViewAllPress,
  onAddPress,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="restaurant-outline" size={22} style={styles.titleIcon} />
          <Text style={styles.title}>Recently Logged</Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity
            onPress={onViewAllPress}
            style={styles.viewAllButton}>
            <Text style={styles.viewAll}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {items.length > 0 ? (
        <View style={styles.listContentContainer}>
          {items.slice(0, 3).map((item, index) => (
            <React.Fragment key={item.id}>
              <Animatable.View animation="fadeInUp" duration={300} delay={index * 70} useNativeDriver>
                <FoodLogListItem item={item} onPress={onItemPress} />
              </Animatable.View>
              {index < Math.min(items.length, 3) - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </View>
      ) : (
        <RecentlyLoggedEmptyState onAddPress={onAddPress} />
      )}
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
    paddingBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: theme.spacing.sm,
    color: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  },
  viewAll: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.semibold,
    marginRight: theme.spacing.xxs,
  },
  listContentContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xxs,
    marginLeft: theme.spacing.lg,
    marginRight: theme.spacing.lg,
  },
});
