import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
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

  const renderItem = ({item}: {item: FoodLogItem}) => (
    <FoodLogListItem item={item} onPress={onItemPress} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recently Logged</Text>
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
        <FlatList
          data={items.slice(0, 3)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <RecentlyLoggedEmptyState onAddPress={onAddPress} />
      )}
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    // backgroundColor: theme.colors.surface,
    // borderRadius: theme.borderRadius.lg,
    // marginHorizontal: theme.spacing.lg,
    // marginVertical: theme.spacing.sm,
    // ...theme.shadows.sm,
    // overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAll: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
    marginRight: theme.spacing.xxs,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.md + 32 + theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
});
