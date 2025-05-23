import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {FoodLogListItem, FoodLogItem} from '../items/FoodLogListItem';
import {RecentlyLoggedEmptyState} from '../items/RecentlyLoggedEmptyState';

interface RecentlyLoggedProps {
  items: FoodLogItem[];
  onItemPress: (item: FoodLogItem) => void;
  onViewAllPress: () => void;
  onAddPress: () => void;
}

export const RecentlyLogged: React.FC<RecentlyLoggedProps> = ({
  items,
  onItemPress,
  onViewAllPress,
  onAddPress,
}) => {
  const renderItem = ({item}: {item: FoodLogItem}) => (
    <FoodLogListItem item={item} onPress={onItemPress} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recently Logged</Text>
        {items.length > 0 && (
          <TouchableOpacity
            onPress={onViewAllPress}
            style={styles.viewAllButton}>
            <Text style={styles.viewAll}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>

      {items.length > 0 ? (
        <FlatList
          data={items.slice(0, 3)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <RecentlyLoggedEmptyState onAddPress={onAddPress} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 16 + 32 + 12,
    marginRight: 16,
  },
});
