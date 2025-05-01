import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodIngredientsProps {
  ingredients: string[];
}

export const FoodIngredients: React.FC<FoodIngredientsProps> = ({ ingredients }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.ingredientText}>{ingredient}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
    borderBottomWidth: 1, // Keep or remove border based on overall design
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientText: {
    fontSize: 16,
    marginLeft: 8,
  },
}); 