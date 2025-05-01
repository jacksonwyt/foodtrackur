import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodDetailsFooterProps {
  onEditPress: () => void;
}

export const FoodDetailsFooter: React.FC<FoodDetailsFooterProps> = ({ onEditPress }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.editButtonText}>Edit Food</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff', // Ensure footer background
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF', // Example primary color
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 