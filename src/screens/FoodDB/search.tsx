import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Alert,
} from 'react-native';
import {Screen} from '../../components/Screen';
import {Ionicons} from '@expo/vector-icons';
import {useCustomFoodList} from '../../hooks/useCustomFoodList';
import {CustomFood} from '../../services/customFoodService';
// Import FatSecret search function and types
import {
  searchFatSecretFood,
  FatSecretFoodSearchResult,
} from '../../services/fatsecretService';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackScreenProps, NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodDBStackParamList} from '../../types/navigation'; // Import from global types
import {FoodLogItemData} from './LogEntryScreen'; // Import the interface
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../../components/common/AppText';
import {AppTextInput} from '../../components/common/AppTextInput';
import {Theme} from '../../constants/theme';
import {AppStackParamList} from '../../types/navigation'; // Import AppStack param list

// Define stack param list
// This should align with your global navigation types if possible, or be specific to this screen context

// Type for FoodSearchScreen's own route props
type FoodSearchScreenRouteProp = RouteProp<FoodDBStackParamList, 'FoodSearch'>;
type FoodSearchScreenNavigationProp = NativeStackScreenProps<
  FoodDBStackParamList,
  'FoodSearch'
>;

// Interface for unified search results
interface FoodSearchResult {
  id: string;
  name: string;
  description?: string;
  source: 'custom' | 'external';
  originalData?: CustomFood | FatSecretFoodSearchResult;
}

// Function to map CustomFood to FoodSearchResult
function mapCustomFoodToSearchResult(food: CustomFood): FoodSearchResult {
  return {
    id: `custom-${food.id}`,
    name: food.food_name,
    description: `${food.serving_size} ${food.serving_unit} - ${food.calories} kcal | P:${food.protein}g C:${food.carbs}g F:${food.fat}g`,
    source: 'custom',
    originalData: food,
  };
}

// Function to map FatSecretFoodSearchResult to FoodSearchResult
function mapFatSecretFoodToSearchResult(
  food: FatSecretFoodSearchResult,
): FoodSearchResult {
  return {
    id: `external-${food.food_id}`,
    name: food.food_name,
    description: food.food_description,
    source: 'external',
    originalData: food,
  };
}

const FoodSearchScreen: React.FC<FoodSearchScreenNavigationProp> = ({
  route,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [isLoadingFatSecret, setIsLoadingFatSecret] = useState(false);
  const [errorFatSecret, setErrorFatSecret] = useState<Error | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const theme = useTheme();
  const styles = makeStyles(theme);

  const {
    customFoods,
    isLoading: isLoadingCustom,
    error: errorCustom,
    refetch: refetchCustomFoods,
  } = useCustomFoodList();

  const navigation =
    useNavigation<FoodSearchScreenNavigationProp['navigation']>();
  const {dateToLog} = route.params;

  useEffect(() => {
    if (!hasSearched && !isLoadingCustom && !errorCustom) {
      setSearchResults(customFoods.map(mapCustomFoodToSearchResult));
    }
    if (errorCustom) {
      console.error('Error loading custom foods:', errorCustom);
    }
  }, [customFoods, isLoadingCustom, errorCustom, hasSearched]);

  const handleSearch = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setSearchResults(customFoods.map(mapCustomFoodToSearchResult));
      setHasSearched(false);
      setErrorFatSecret(null);
      Keyboard.dismiss();
      return;
    }
    Keyboard.dismiss();
    setIsLoadingFatSecret(true);
    setErrorFatSecret(null);
    setHasSearched(true);
    setSearchResults([]);
    try {
      const lowerCaseQuery = trimmedQuery.toLowerCase();
      const filteredCustom = customFoods.filter(food =>
        food.food_name.toLowerCase().includes(lowerCaseQuery),
      );
      const customResults = filteredCustom.map(mapCustomFoodToSearchResult);
      const fatSecretResponse = await searchFatSecretFood(trimmedQuery);
      const fatSecretFoods = Array.isArray(
        fatSecretResponse.foods_search.results.food,
      )
        ? fatSecretResponse.foods_search.results.food
        : [];
      const externalResults = fatSecretFoods.map(
        mapFatSecretFoodToSearchResult,
      );
      setSearchResults([...customResults, ...externalResults]);
    } catch (error) {
      console.error('Food search failed (FatSecret):', error);
      setErrorFatSecret(
        error instanceof Error ? error : new Error('FatSecret search failed'),
      );
    } finally {
      setIsLoadingFatSecret(false);
    }
  }, [searchQuery, customFoods]);

  const handleSelectFood = (item: FoodSearchResult) => {
    if (
      item.source === 'external' &&
      item.originalData &&
      'food_id' in item.originalData
    ) {
      const externalFoodData = item.originalData;
      navigation.navigate('FoodDetails', {
        foodId: externalFoodData.food_id,
        source: 'fatsecret',
        dateToLog,
      });
    } else if (
      item.source === 'custom' &&
      item.originalData &&
      'serving_size' in item.originalData
    ) {
      const customFoodData = item.originalData;
      const foodLogItem: FoodLogItemData = {
        food_name: customFoodData.food_name,
        calories: customFoodData.calories,
        protein: customFoodData.protein,
        carbs: customFoodData.carbs,
        fat: customFoodData.fat,
        serving_unit: customFoodData.serving_unit,
      };
      navigation.navigate('LogEntry', {foodItem: foodLogItem, dateToLog});
    } else {
      console.warn('Selected item has missing data or unknown source:', item);
      // Provide more specific feedback if possible
      if (!item.originalData) {
        Alert.alert('Error', 'Selected food item is missing critical data.');
      } else if (
        item.source === 'external' &&
        !('food_id' in item.originalData)
      ) {
        Alert.alert(
          'Error',
          'External food data is malformed. Missing food_id.',
        );
      } else if (
        item.source === 'custom' &&
        !('serving_size' in item.originalData)
      ) {
        Alert.alert(
          'Error',
          'Custom food data is malformed. Missing serving_size.',
        );
      }
    }
  };

  const navigateToCreateCustomFood = () => {
    // Use getParent to navigate to a screen in the parent navigator (AppStack)
    const parentNavigation = navigation.getParent<NativeStackNavigationProp<AppStackParamList>>();
    if (parentNavigation) {
      parentNavigation.navigate('AddFood', {initialDate: dateToLog});
    } else {
      console.warn("Could not get parent navigator to navigate to AddFood screen");
      // Fallback or error handling if parent navigator isn't found, though unlikely with correct setup
      // Alert.alert("Navigation Error", "Could not open the add custom food screen.");
    }
  };

  const renderItem = ({item}: {item: FoodSearchResult}) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectFood(item)}>
      <View style={styles.resultTextContainer}>
        <AppText style={styles.resultName}>
          {item.name} <AppText style={styles.sourceText}>({item.source})</AppText>
        </AppText>
        {item.description && (
          <AppText style={styles.resultDescription}>{item.description}</AppText>
        )}
      </View>
      <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
    </TouchableOpacity>
  );

  const renderListEmptyComponent = () => {
    if (isLoadingCustom && !hasSearched) return null;
    if (isLoadingFatSecret) return null;
    if (hasSearched && errorFatSecret)
      return (
        <AppText style={styles.emptyText}>
          Error during search: {errorFatSecret.message}. Please try again.
        </AppText>
      );
    if (errorCustom)
      return (
        <AppText style={styles.emptyText}>
          Error loading your custom foods. Pull to refresh?
        </AppText>
      );
    if (!hasSearched && customFoods.length > 0 && searchQuery === '')
      return (
        <AppText style={styles.emptyText}>
          Your custom foods are shown below. Enter a search term to search the
          database.
        </AppText>
      );
    if (!hasSearched)
      return <AppText style={styles.emptyText}>Enter a food name to search.</AppText>;
    if (searchResults.length === 0)
      return (
        <AppText style={styles.emptyText}>
          {`No results found for "${searchQuery}".`}
        </AppText>
      );
    return null;
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.searchSectionContainer}>
        <AppTextInput
          style={styles.searchBar}
          placeholder="Search foods..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          containerStyle={styles.searchBarContainer}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => { void handleSearch(); }}>
          <Ionicons name="search" size={24} color={theme.colors.onPrimary} />
        </TouchableOpacity>
      </View>

      {isLoadingCustom && !hasSearched && (
        <ActivityIndicator style={styles.centeredLoader} size="large" color={theme.colors.primary} />
      )}
      
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={renderListEmptyComponent()}
        ListFooterComponent={
          isLoadingFatSecret ? (
            <ActivityIndicator style={styles.listLoader} size="large" color={theme.colors.primary} />
          ) : null
        }
        keyboardShouldPersistTaps="handled"
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={navigateToCreateCustomFood}>
        <Ionicons name="add" size={30} color={theme.colors.onPrimary} />
      </TouchableOpacity>
    </Screen>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchSectionContainer: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchBarContainer: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    searchBar: {
    },
    searchButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    list: {
      flex: 1,
    },
    listContentContainer: {
      paddingVertical: theme.spacing.md,
    },
    resultItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    resultTextContainer: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    resultName: {
      fontSize: theme.typography.sizes.bodyLarge,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.onSurface,
    },
    sourceText: {
      fontSize: theme.typography.sizes.caption,
      color: theme.colors.onSurfaceMedium,
    },
    resultDescription: {
      fontSize: theme.typography.sizes.bodySmall,
      color: theme.colors.onSurfaceMedium,
      marginTop: theme.spacing.xs,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: theme.spacing.xl,
      fontSize: theme.typography.sizes.body,
      color: theme.colors.onSurfaceMedium,
      paddingHorizontal: theme.spacing.lg,
    },
    centeredLoader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    listLoader: {
      marginVertical: theme.spacing.md,
    },
    fab: {
      position: 'absolute',
      right: theme.spacing.lg,
      bottom: theme.spacing.lg,
      backgroundColor: theme.colors.secondary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.md,
    },
  });

export default FoodSearchScreen;
