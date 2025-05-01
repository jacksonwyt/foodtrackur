import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

const getCategoryColor = (category: FoodLogItem['category']) => {
  switch (category) {
    case 'breakfast':
      return '#FF9500'; // Orange
    case 'lunch':
      return '#34C759'; // Green
    case 'dinner':
      return '#5856D6'; // Indigo
    case 'snack':
      return '#FF3B30'; // Red
    default:
      return '#007AFF'; // Blue
  }
};

export const FoodLogListItem: React.FC<FoodLogListItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPress(item)}
    >
      <View style={styles.itemContent}>
        <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(item.category) }]}>
          <Ionicons name={getCategoryIcon(item.category)} size={16} color="#fff" />
        </View>
        <View style={styles.itemLeft}>
          <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          <View style={styles.itemDetails}>
            <Text style={styles.itemTime}>{item.time}</Text>
            {item.macros && (item.macros.protein !== undefined || item.macros.carbs !== undefined || item.macros.fat !== undefined) && (
              <Text style={styles.macros} numberOfLines={1} ellipsizeMode="tail">
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

// Styles extracted from RecentlyLogged.tsx specific to the list item
const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 12,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemLeft: {
    flex: 1,
    marginRight: 8, // Add margin to prevent text overlap
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTime: {
    fontSize: 13,
    color: '#666',
  },
  macros: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    flexShrink: 1, // Allow macro text to shrink
  },
  itemCalories: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 'auto', // Push calories to the right
    textAlign: 'right',
  },
}); 