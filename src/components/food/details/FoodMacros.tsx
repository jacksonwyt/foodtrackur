import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Assuming FoodItem type is defined elsewhere and imported
interface FoodItem { // Temporary placeholder
  id: string;
  name: string;
  calories: number;
  time: string;
  category: string;
  macros: { protein: number; carbs: number; fat: number; };
  ingredients: string[];
}

interface FoodMacrosProps {
  macros: FoodItem['macros'];
}

export const FoodMacros: React.FC<FoodMacrosProps> = ({ macros }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Macronutrients</Text>
      <View style={styles.macrosContainer}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{macros.protein}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{macros.carbs}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{macros.fat}g</Text>
          <Text style={styles.macroLabel}>Fat</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
  },
}); 