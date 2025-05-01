import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FoodDetailsHeaderProps {
  title: string;
  onBackPress: () => void;
}

export const FoodDetailsHeader: React.FC<FoodDetailsHeaderProps> = ({ title, onBackPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, // Adjust as needed
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff', // Ensure header background
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 