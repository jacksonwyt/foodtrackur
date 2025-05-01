import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StreaksProps {
  currentStreak: number;
}

export const Streaks: React.FC<StreaksProps> = ({ currentStreak }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="flame" size={24} color="#FF6B6B" />
      <Text style={styles.streakText}>{currentStreak}</Text>
      <Text style={styles.daysText}>days</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 4,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  daysText: {
    fontSize: 14,
    color: '#666',
  },
}); 