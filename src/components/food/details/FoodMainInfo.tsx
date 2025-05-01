import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getCategoryColor } from '../../../utils/helpers'; // Assuming path alias is set up

// Assuming FoodItem type is defined elsewhere and imported
// import { FoodItem } from '@/types';
interface FoodItem { // Temporary placeholder
  id: string;
  name: string;
  calories: number;
  time: string;
  category: string;
  macros: { protein: number; carbs: number; fat: number; };
  ingredients: string[];
}

interface FoodMainInfoProps {
  food: FoodItem;
}

export const FoodMainInfo: React.FC<FoodMainInfoProps> = ({ food }) => {
  return (
    <View style={styles.mainInfo}>
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(food.category) }]}>
        <Text style={styles.categoryText}>{food.category.charAt(0).toUpperCase() + food.category.slice(1)}</Text>
      </View>
      <Text style={styles.foodName}>{food.name}</Text>
      <Text style={styles.calories}>{food.calories} calories</Text>
      <Text style={styles.timeText}>{food.time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainInfo: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  calories: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#999',
  },
}); 