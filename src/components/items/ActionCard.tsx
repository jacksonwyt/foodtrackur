import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionCardProps {
  id: string;
  label: string;
  icon: string; // Consider using keyof typeof Ionicons.glyphMap for stricter typing if possible
  onPress: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ id, label, icon, onPress }) => {
  return (
    <TouchableOpacity key={id} style={styles.card} onPress={onPress}>
      <View style={styles.cardIcon}>
        <Ionicons name={icon as any} size={40} color="#007AFF" />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: 150,
    height: 130,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 12, // This might be better handled by the grid layout (gap)
  },
  cardIcon: {
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
}); 