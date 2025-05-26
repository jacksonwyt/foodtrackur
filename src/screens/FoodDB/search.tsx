import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Alert,
  Pressable,
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
import {useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackScreenProps, NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FoodDBStackParamList, AppStackParamList} from '@/types/navigation'; // Import from global types
import {FoodLogItemData} from './LogEntryScreen'; // Import the interface
import {useTheme} from '@/hooks/useTheme';
import {AppText} from '@/components/common/AppText';
import {FoodSearchBar} from '../../components/food/FoodSearchBar'; // Import FoodSearchBar
import {Theme} from '@/constants/theme';
import {debounce} from 'lodash-es';

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
  foodType?: string; // Added for FatSecret items
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
    foodType: food.food_type, // Populate foodType
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
  const [isDebouncing, setIsDebouncing] = useState(false);

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

  const debouncedSearchHandler = useCallback(
    debounce(async (query: string) => {
      setIsDebouncing(false);
      if (!query) {
        setSearchResults(customFoods.map(mapCustomFoodToSearchResult));
        setHasSearched(false);
        setErrorFatSecret(null);
        return;
      }
      Keyboard.dismiss();
      setIsLoadingFatSecret(true);
      setErrorFatSecret(null);
      setHasSearched(true);
      setSearchResults([]);
      try {
        const lowerCaseQuery = query.toLowerCase();
        const filteredCustom = customFoods.filter(food =>
          food.food_name.toLowerCase().includes(lowerCaseQuery),
        );
        const customResults = filteredCustom.map(mapCustomFoodToSearchResult);
        const fatSecretResponse = await searchFatSecretFood(query);
        const fatSecretFoods = Array.isArray(
          fatSecretResponse.foods_search.results.food,
        )
          ? fatSecretResponse.foods_search.results.food
          : fatSecretResponse.foods_search.results.food
          ? [fatSecretResponse.foods_search.results.food]
          : [];
        const externalResults = fatSecretFoods.map(
          mapFatSecretFoodToSearchResult,
        );
        setSearchResults([...customResults, ...externalResults]);
      } catch (err) {
        console.error('Food search failed (FatSecret):', err);
        setErrorFatSecret(
          err instanceof Error ? err : new Error('FatSecret search failed'),
        );
      } finally {
        setIsLoadingFatSecret(false);
      }
    }, 500),
    [customFoods, dateToLog, mapCustomFoodToSearchResult, searchFatSecretFood],
  );

  useEffect(() => {
    if (!hasSearched && !isLoadingCustom && !errorCustom) {
      setSearchResults(customFoods.map(mapCustomFoodToSearchResult));
    }
    if (errorCustom) {
      console.error('Error loading custom foods:', errorCustom);
    }
  }, [customFoods, isLoadingCustom, errorCustom, hasSearched]);

  const handleQueryChange = (text: string) => {
    setSearchQuery(text);
    const trimmedText = text.trim();
    if (trimmedText.length > 2 || trimmedText.length === 0) {
      setIsDebouncing(true);
      void debouncedSearchHandler(trimmedText);
    } else {
      debouncedSearchHandler.cancel();
      setIsDebouncing(false);
      if (trimmedText.length === 0 && hasSearched) {
        setSearchResults(customFoods.map(mapCustomFoodToSearchResult));
        setHasSearched(false);
        setErrorFatSecret(null);
      } else if (trimmedText.length > 0) {
        // Optionally clear results or show a "type more" message
        // setSearchResults([]);
      }
    }
  };

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

  const renderItem = ({item}: {item: FoodSearchResult}) => (
    <Pressable
      style={({pressed}) => [
        styles.resultItem,
        pressed && styles.resultItemPressed,
      ]}
      onPress={() => handleSelectFood(item)}>
      <View style={styles.resultTextContainer}>
        <View style={styles.resultNameContainer}>
          <AppText style={styles.resultName} numberOfLines={1} ellipsizeMode="tail">{item.name}</AppText>
          {item.source === 'external' && item.foodType === 'Brand' && (
            <Ionicons name="star" size={16} color={theme.colors.accent} style={styles.brandIcon} />
          )}
          <View style={[styles.sourceTagBase, item.source === 'custom' ? styles.sourceTagCustom : styles.sourceTagExternal]}>
            <AppText style={[styles.sourceTagText, item.source === 'custom' ? styles.sourceTagTextCustom : styles.sourceTagTextExternal]}>
              {item.source === 'external' && item.foodType === 'Brand' ? 'Brand' : item.source}
            </AppText>
          </View>
        </View>
        {item.description && (
          <AppText style={styles.resultDescription} numberOfLines={2} ellipsizeMode="tail">
            {item.description}
          </AppText>
        )}
      </View>
      <View style={styles.addIconContainer}>
        <Ionicons name="add-circle-outline" size={28} color={theme.colors.primary} />
      </View>
    </Pressable>
  );

  const renderListEmptyComponent = () => {
    if (isLoadingCustom && !hasSearched) return null;
    if (isLoadingFatSecret && !isDebouncing) return null;

    let iconName: keyof typeof Ionicons.glyphMap | null = null;
    let message: string = '';

    if (hasSearched && errorFatSecret) {
      iconName = 'alert-circle-outline';
      message = `Error during search: ${errorFatSecret.message}. Please try again.`;
    } else if (errorCustom) {
      iconName = 'cloud-offline-outline';
      message = 'Error loading your custom foods. Pull to refresh?';
    } else if (!hasSearched && customFoods.length > 0 && searchQuery === '') {
      iconName = 'list-outline';
      message = 'Your custom foods are shown. Enter a search term to search the database.';
    } else if (!hasSearched && searchQuery === '') {
      iconName = 'search-outline';
      message = 'Enter a food name to search.';
    } else if (searchResults.length === 0 && hasSearched) {
      iconName = 'sad-outline';
      message = `No results found for "${searchQuery}".`;
    }

    if (!message) return null;

    return (
      <View style={styles.emptyContainer}>
        {iconName && <Ionicons name={iconName} size={48} color={theme.colors.onSurfaceMedium} style={styles.emptyIcon} />}
        <AppText style={styles.emptyText}>{message}</AppText>
      </View>
    );
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.searchSectionContainer}>
        <FoodSearchBar
          value={searchQuery}
          onChangeText={handleQueryChange}
          placeholder="Search foods (e.g., apple)"
          // clearButtonMode is handled internally by FoodSearchBar if it supports it
          // style={styles.foodSearchBar} // Apply specific container styles if needed
        />
      </View>

      {(isLoadingCustom && !hasSearched) || isDebouncing ? (
        <ActivityIndicator style={styles.centeredLoader} size="large" color={theme.colors.primary} />
      ) : null}
      
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={renderListEmptyComponent()}
        ListFooterComponent={
          isLoadingFatSecret && !isDebouncing ? (
            <ActivityIndicator style={styles.listLoader} size="large" color={theme.colors.primary} />
          ) : null
        }
        keyboardShouldPersistTaps="handled"
      />
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
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    list: {
      flex: 1,
      paddingHorizontal: theme.spacing.xs,
    },
    listContentContainer: {
      paddingVertical: theme.spacing.md,
    },
    resultItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    },
    resultItemPressed: {
      backgroundColor: theme.colors.border,
    },
    resultTextContainer: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    resultNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    resultName: {
      fontSize: theme.typography.sizes.bodyLarge,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.onSurface,
      flexShrink: 1,
      marginRight: theme.spacing.xs,
    },
    brandIcon: {
      marginRight: theme.spacing.xs,
    },
    sourceTagBase: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 1.5,
      borderRadius: theme.borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sourceTagCustom: {
      backgroundColor: theme.colors.primaryRGB ? `rgba(${theme.colors.primaryRGB}, 0.1)` : theme.colors.border,
    },
    sourceTagExternal: {
      backgroundColor: theme.colors.border,
    },
    sourceTagText: {
      fontSize: theme.typography.sizes.caption,
      fontWeight: theme.typography.weights.medium,
    },
    sourceTagTextCustom: {
      color: theme.colors.primary,
    },
    sourceTagTextExternal: {
      color: theme.colors.secondary,
    },
    resultDescription: {
      fontSize: theme.typography.sizes.bodySmall,
      color: theme.colors.onSurfaceMedium,
    },
    addIconContainer: {
      paddingLeft: theme.spacing.sm,
      padding: theme.spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      textAlign: 'center',
      fontSize: theme.typography.sizes.body,
      color: theme.colors.onSurfaceMedium,
      paddingHorizontal: theme.spacing.lg,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
      marginTop: theme.spacing.xl * 2,
    },
    emptyIcon: {
      marginBottom: theme.spacing.md,
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
  });

export default FoodSearchScreen;
