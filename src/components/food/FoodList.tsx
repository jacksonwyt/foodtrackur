import React, {ComponentType, ReactElement} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  FlatListProps,
  ActivityIndicator,
  Button,
} from 'react-native';
import {FoodListItem} from './FoodListItem'; // Assuming same directory
import { useTheme } from '@/hooks/useTheme'; // Added import
import { Theme } from '@/constants/theme'; // Added import

// Re-define or import the item structure
interface FoodListItemData {
  id: string;
  name: string;
  calories: number;
  // Add other fields passed to FoodListItem
}

interface FoodListProps
  extends Omit<
    FlatListProps<FoodListItemData>,
    'renderItem' | 'data' | 'ListEmptyComponent'
  > {
  items: FoodListItemData[];
  onItemPress: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  ListEmptyComponent?:
    | ComponentType<Record<string, never>>
    | ReactElement
    | null
    | undefined;
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
  const theme = useTheme(); // Added useTheme hook
  const styles = makeStyles(theme); // Added makeStyles call

  const renderItem = ({item}: {item: FoodListItemData}) => (
    <FoodListItem
      name={item.name}
      calories={item.calories}
      onPress={() => onItemPress(item.id)}
    />
  );

  const renderEmpty = () => {
    if (isLoading) {
      return <ActivityIndicator style={styles.centeredMessage} size="large" color={theme.colors.primary} />;
    }
    if (error) {
      return (
        <View style={styles.centeredMessage}>
          <Text style={styles.errorText}>{error}</Text>
          {onRefresh && <Button title="Retry" onPress={onRefresh} color={theme.colors.primary} />}
        </View>
      );
    }
    // Allow custom empty component, or provide a default
    if (ListEmptyComponent) {
      // Check if it's a component type (function or class) or a rendered element
      if (
        typeof ListEmptyComponent === 'function' ||
        (ListEmptyComponent &&
          typeof ListEmptyComponent === 'object' &&
          'type' in ListEmptyComponent)
      ) {
        // If it's a component type, render it
        const CustomEmptyComponent = ListEmptyComponent as ComponentType<
          Record<string, never>
        >; // Assert type
        return <CustomEmptyComponent />;
      } else {
        // If it's already a ReactElement, return it directly
        return ListEmptyComponent;
      }
    }
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
      keyExtractor={item => item.id}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={items.length === 0 && styles.emptyContainer} // Style when empty
      onRefresh={onRefresh}
      refreshing={refreshing}
      {...props}
    />
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  emptyContainer: {
    flexGrow: 1, // Ensure empty component can center if needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md, // Changed to theme variable
  },
  emptyText: {
    fontSize: theme.typography.sizes.body, // Changed to theme variable
    color: theme.colors.textSecondary, // Changed to theme variable
    textAlign: 'center',
  },
  errorText: {
    fontSize: theme.typography.sizes.body, // Changed to theme variable
    color: theme.colors.error, // Changed to theme variable
    textAlign: 'center',
    marginBottom: theme.spacing.sm, // Changed to theme variable
  },
});
