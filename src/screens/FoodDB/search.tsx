import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  // Alert, // Keep Alert if needed for error display
} from 'react-native';
import { Screen } from '../../components/Screen';
import { Ionicons } from '@expo/vector-icons';
import { useCustomFoodList } from '../../hooks/useCustomFoodList';
import { CustomFood } from '../../services/customFoodService';
// Import FatSecret search function and types
import { searchFatSecretFood, FatSecretFoodSearchResult } from '../../services/fatsecretService';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import prop type

// Define stack param list including the new details screen
// IMPORTANT: Update this with your actual root stack param list
type FoodDBStackParamList = {
    FoodSearch: undefined;
    FoodDetails: { foodId: string; source: 'fatsecret' }; // Screen for FatSecret details
    AddFood: { mealType: string; date: string; item?: CustomFood }; // For custom food (editing or maybe logging)
    // ... other screens in this stack
};

type FoodSearchScreenNavigationProp = NativeStackNavigationProp<
    FoodDBStackParamList,
    'FoodSearch'
>;

// Interface for unified search results
interface FoodSearchResult {
  id: string; // Ensure ID is always string for FlatList key
  name: string;
  description?: string;
  source: 'custom' | 'external'; // Indicate the source
  originalData?: any; // Optionally keep original data (CustomFood or FatSecretFoodSearchResult)
}

// Function to map CustomFood to FoodSearchResult
function mapCustomFoodToSearchResult(food: CustomFood): FoodSearchResult {
    return {
        id: `custom-${food.id}`, // Prefix ID for uniqueness
        name: food.food_name,
        description: `${food.serving_size} ${food.serving_unit} - ${food.calories} kcal | P:${food.protein}g C:${food.carbs}g F:${food.fat}g`,
        source: 'custom',
        originalData: food,
    };
}

// Function to map FatSecretFoodSearchResult to FoodSearchResult
function mapFatSecretFoodToSearchResult(food: FatSecretFoodSearchResult): FoodSearchResult {
    return {
        id: `external-${food.food_id}`, // Prefix ID for uniqueness
        name: food.food_name,
        description: food.food_description, // Use the description provided by FatSecret
        source: 'external',
        originalData: food,
    };
}

const FoodSearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  // Rename state for FatSecret search
  const [isLoadingFatSecret, setIsLoadingFatSecret] = useState(false);
  const [errorFatSecret, setErrorFatSecret] = useState<Error | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Use the custom hook to get custom foods
  const {
      customFoods,
      isLoading: isLoadingCustom,
      error: errorCustom,
      refetch: refetchCustomFoods
  } = useCustomFoodList();

  const navigation = useNavigation<FoodSearchScreenNavigationProp>(); // Initialize navigation

  // Effect to display custom foods initially or on error
  useEffect(() => {
      if (!hasSearched && !isLoadingCustom && !errorCustom) {
           // Pre-populate results with custom foods only if no search has been performed yet
           setSearchResults(customFoods.map(mapCustomFoodToSearchResult));
      }
      if (errorCustom) {
          console.error("Error loading custom foods:", errorCustom);
          // Optionally set an error message state to display to user, perhaps merge with errorFatSecret?
      }
  }, [customFoods, isLoadingCustom, errorCustom, hasSearched]); // Add hasSearched dependency


  const handleSearch = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      // Show all custom foods when search is cleared
      setSearchResults(customFoods.map(mapCustomFoodToSearchResult));
      setHasSearched(false);
      setErrorFatSecret(null); // Clear FatSecret error too
      Keyboard.dismiss();
      return;
    }

    Keyboard.dismiss();
    // Use renamed state setters
    setIsLoadingFatSecret(true);
    setErrorFatSecret(null);
    setHasSearched(true);
    setSearchResults([]); // Clear previous results immediately

    try {
      // 1. Filter local custom foods (case-insensitive)
      const lowerCaseQuery = trimmedQuery.toLowerCase();
      const filteredCustom = customFoods.filter(food =>
        food.food_name.toLowerCase().includes(lowerCaseQuery)
      );
      const customResults = filteredCustom.map(mapCustomFoodToSearchResult);

      // 2. Fetch FatSecret results
      const fatSecretResponse = await searchFatSecretFood(trimmedQuery);
      // Ensure 'food' is an array before mapping
      const fatSecretFoods = Array.isArray(fatSecretResponse.foods_search.results.food)
        ? fatSecretResponse.foods_search.results.food
        : [];
      const externalResults = fatSecretFoods.map(mapFatSecretFoodToSearchResult);


      // 3. Combine results (custom first)
      setSearchResults([...customResults, ...externalResults]);

    } catch (error) {
      console.error('Food search failed (FatSecret):', error);
      // Use renamed state setter
      setErrorFatSecret(error instanceof Error ? error : new Error('FatSecret search failed'));
      // Optionally display an Alert here or rely on renderListEmptyComponent
      // Alert.alert('Search Error', error instanceof Error ? error.message : 'Could not perform search');
    } finally {
      // Use renamed state setter
      setIsLoadingFatSecret(false);
    }
  }, [searchQuery, customFoods]); // Depend on customFoods

  const handleSelectFood = (item: FoodSearchResult) => {
    console.log('Selected food:', item);

    if (item.source === 'external' && item.originalData?.food_id) {
        // Navigate to a details screen for FatSecret items
        navigation.navigate('FoodDetails', {
            foodId: item.originalData.food_id,
            source: 'fatsecret'
        });
    } else if (item.source === 'custom' && item.originalData?.id) {
        // Option 1: Navigate to AddFood screen in a 'logging' mode (if supported)
        // navigation.navigate('AddFood', { item: item.originalData, mode: 'log' });

        // Option 2: Navigate to AddFood screen for editing (current behavior seems more like edit)
        // navigation.navigate('AddFood', { item: item.originalData });

        // Option 3: For now, just log, assuming logging happens elsewhere or on a dedicated screen
        console.log('Selected custom food, implement logging navigation:', item.originalData);
        // Example: navigation.navigate('LogEntryScreen', { foodItem: item.originalData });
    } else {
        console.warn('Selected item has missing data or unknown source:', item);
    }
  };

  const renderItem = ({ item }: { item: FoodSearchResult }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectFood(item)}>
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultName}>{item.name} <Text style={styles.sourceText}>({item.source})</Text></Text>
        {item.description && <Text style={styles.resultDescription}>{item.description}</Text>}
      </View>
      <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
    </TouchableOpacity>
  );

  const renderListEmptyComponent = () => {
      // Loading states
      if (isLoadingCustom && !hasSearched) return null; // Handled by main loader
      if (isLoadingFatSecret) return null; // Handled by main loader

      // Error states - Show FatSecret error first if it exists after a search
       if (hasSearched && errorFatSecret) return <Text style={styles.emptyText}>Error during search: {errorFatSecret.message}. Please try again.</Text>;
       // Show custom food error if it occurred and wasn't overwritten by a search error
      if (errorCustom) return <Text style={styles.emptyText}>Error loading your custom foods. Pull to refresh?</Text>; // Basic error display

      // Search/Empty states
      if (!hasSearched && customFoods.length > 0 && searchQuery === '') return <Text style={styles.emptyText}>Your custom foods are shown below. Enter a search term to search the database.</Text>;
      if (!hasSearched) return <Text style={styles.emptyText}>Enter a food name to search.</Text>;
      if (searchResults.length === 0) return <Text style={styles.emptyText}>No results found for "{searchQuery}".</Text>; // No results after search

      return null;
  };

  // Update overall loading state check
  const showLoadingIndicator = isLoadingCustom || isLoadingFatSecret;

  return (
    <Screen style={styles.screen}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search custom foods or FatSecret..." // Updated placeholder
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {/* Disable button only when a search is actively running */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={isLoadingFatSecret}>
           {/* Show loader specifically for FatSecret search if it's running */}
           {isLoadingFatSecret ? <ActivityIndicator size="small" color="#007AFF" /> : <Ionicons name="search" size={20} color="#007AFF" />}
        </TouchableOpacity>
      </View>

      {/* Show main loading indicator if loading custom foods initially OR during search with no results yet */}
      {(isLoadingCustom && !hasSearched) || (isLoadingFatSecret && searchResults.length === 0) ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>{isLoadingCustom && !hasSearched ? 'Loading custom foods...' : 'Searching FatSecret...'}</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id} // Use prefixed ID
          style={styles.resultsList}
          contentContainerStyle={styles.resultsListContent}
          ListEmptyComponent={renderListEmptyComponent}
          keyboardShouldPersistTaps="handled"
          // Optional: Add pull-to-refresh to refetch custom foods
           onRefresh={refetchCustomFoods}
           refreshing={isLoadingCustom}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
   loadingText: { // Added style for loading text
      marginTop: 10,
      fontSize: 14,
      color: '#666',
  },
  resultsList: {
    flex: 1,
  },
  resultsListContent: {
    paddingBottom: 20, // Added padding at the bottom
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '500',
  },
  sourceText: { // Added style for source indicator
      fontSize: 12,
      color: '#888',
      fontWeight: 'normal',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
      color: '#888',
      paddingHorizontal: 20, // Add padding for longer messages
  }
});

export default FoodSearchScreen; 