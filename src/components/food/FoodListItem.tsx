import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface FoodListItemProps extends TouchableOpacityProps {
  name: string;
  calories: number;
  // Add other relevant props like serving size, brand, etc.
}

export const FoodListItem: React.FC<FoodListItemProps> = ({
  name,
  calories,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.calories}>{calories} kcal</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContainer: {
    flex: 1, // Allow text to take available space
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  calories: {
    fontSize: 14,
    color: '#666',
  },
});
