import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  FlatListProps,
  ActivityIndicator,
  Button,
} from 'react-native';
import { FoodListItem } from './FoodListItem'; // Assuming same directory

// Re-define or import the item structure
interface FoodListItemData {
  id: string;
  name: string;
  calories: number;
  // Add other fields passed to FoodListItem
}

interface FoodListProps extends Omit<FlatListProps<FoodListItemData>, 'renderItem' | 'data'> {
  items: FoodListItemData[];
  onItemPress: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const FoodList: React.FC<FoodListProps> = ({
  items,
  onItemPress,
  isLoading,
  error,
  onRefresh,
  refreshing,
  ListEmptyComponent,
  ...props
}) => {

  const renderItem = ({ item }: { item: FoodListItemData }) => (
    <FoodListItem
      name={item.name}
      calories={item.calories}
      onPress={() => onItemPress(item.id)}
    />
  );

  const renderEmpty = () => {
    if (isLoading) {
      return <ActivityIndicator style={styles.centeredMessage} size="large" />;
    }
    if (error) {
      return (
        <View style={styles.centeredMessage}>
          <Text style={styles.errorText}>{error}</Text>
          {onRefresh && <Button title="Retry" onPress={onRefresh} />}
        </View>
      );
    }
    // Allow custom empty component, or provide a default
    if (ListEmptyComponent) return ListEmptyComponent;
    return (
        <View style={styles.centeredMessage}>
            <Text style={styles.emptyText}>No food items found.</Text>
        </View>
    );
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={items.length === 0 && styles.emptyContainer} // Style when empty
      onRefresh={onRefresh}
      refreshing={refreshing}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flexGrow: 1, // Ensure empty component can center if needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
}); 