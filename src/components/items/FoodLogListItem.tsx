import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme';

// Consider moving this to a shared types file (e.g., src/types/food.ts) later
export interface FoodLogItem {
  id: string;
  name: string;
  calories: number;
  time: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

interface FoodLogListItemProps {
  item: FoodLogItem;
  onPress: (item: FoodLogItem) => void;
}

// Helper functions specific to rendering this item
const getCategoryIcon = (category: FoodLogItem['category']) => {
  switch (category) {
    case 'breakfast':
      return 'sunny-outline';
    case 'lunch':
      return 'restaurant-outline';
    case 'dinner':
      return 'moon-outline';
    case 'snack':
      return 'cafe-outline';
    default:
      return 'restaurant-outline';
  }
};

// Modified to use theme colors or placeholders
const getCategoryColor = (category: FoodLogItem['category'], theme: Theme) => {
  switch (category) {
    case 'breakfast':
      return theme.colors.mealBreakfast;
    case 'lunch':
      return theme.colors.mealLunch;
    case 'dinner':
      return theme.colors.mealDinner;
    case 'snack':
      return theme.colors.mealSnack;
    default:
      return theme.colors.primary;
  }
};

export const FoodLogListItem: React.FC<FoodLogListItemProps> = ({
  item,
  onPress,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const categoryColor = getCategoryColor(item.category, theme);

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPress(item)}>
      <View style={styles.itemContent}>
        <View
          style={[
            styles.categoryIcon,
            {backgroundColor: categoryColor},
          ]}>
          <Ionicons
            name={getCategoryIcon(item.category)}
            size={16}
            color={theme.colors.onPrimary}
          />
        </View>
        <View style={styles.itemLeft}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <View style={styles.itemDetails}>
            <Text style={styles.itemTime}>{item.time}</Text>
            {item.macros &&
              (item.macros.protein !== undefined ||
                item.macros.carbs !== undefined ||
                item.macros.fat !== undefined) && (
                <Text
                  style={styles.macros}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {` • P:${item.macros.protein ?? '-'} C:${item.macros.carbs ?? '-'} F:${item.macros.fat ?? '-'}`}
                </Text>
              )}
          </View>
        </View>
        <Text style={styles.itemCalories}>{item.calories} cal</Text>
      </View>
    </TouchableOpacity>
  );
};

// Added makeStyles
const makeStyles = (theme: Theme) => StyleSheet.create({
  itemContainer: {
    paddingVertical: theme.spacing.sm,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  itemLeft: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  itemName: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.xxs,
    fontWeight: theme.typography.weights.medium,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTime: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
  },
  macros: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xxs,
    flexShrink: 1,
  },
  itemCalories: {
    fontSize: theme.typography.sizes.bodySmall,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginLeft: 'auto',
    textAlign: 'right',
  },
});
