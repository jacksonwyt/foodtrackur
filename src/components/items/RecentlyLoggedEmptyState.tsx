import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface RecentlyLoggedEmptyStateProps {
  onAddPress: () => void;
}

export const RecentlyLoggedEmptyState: React.FC<
  RecentlyLoggedEmptyStateProps
> = ({onAddPress}) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="restaurant-outline" size={40} color="#8E8E93" />
      </View>
      <Text style={styles.emptyTitle}>No meals logged yet</Text>
      <Text style={styles.emptySubtitle}>
        Log your meals using the + button or quick actions below.
      </Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Ionicons name="add" size={20} color="#fff" style={styles.addIcon} />
        <Text style={styles.addButtonText}>Add Your First Meal</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles extracted from RecentlyLogged.tsx specific to the empty state
const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30, // Increased padding
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7', // Lighter background
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E', // Darker text
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#636366', // Slightly darker subtitle
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25, // More rounded
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
