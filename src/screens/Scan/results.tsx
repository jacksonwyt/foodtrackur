import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  // Removed Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, FlatList, Alert
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity, // Keep for now, will style it or replace with AppButton if available
  ActivityIndicator, // Added for loading state during logging
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScanStackParamList, AppStackParamList} from '../../types/navigation';
import {Ionicons} from '@expo/vector-icons';
import {
  addFoodLog,
  AddFoodLogData,
  FoodLog,
} from '../../services/foodLogService';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../../components/common/AppText';
// import {AppButton} from '../../components/buttons/AppButton'; // Assuming AppButton might be used later
import {Theme} from '../../constants/theme';

// Define the structure of a parsed food item from the analysis
interface ParsedFoodItem {
  id: string; // Unique ID for selection tracking
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  serving_size?: number;
  serving_unit?: string;
}

// Interface for the expected raw structure from AI analysis
interface RawAnalyzedItem {
  id?: string | number;
  name?: string;
  calories?: string | number | undefined;
  protein?: string | number | undefined;
  carbs?: string | number | undefined;
  fat?: string | number | undefined;
  serving_size?: string | number | undefined;
  serving_unit?: string | undefined;
}

type ScanResultsScreenRouteProp = RouteProp<
  ScanStackParamList,
  'ScanResults'
>;

const makeStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.error,
    textAlign: 'center' as const,
    marginBottom: theme.spacing.md,
  },
  foodCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    ...theme.shadows.sm,
  },
  foodCardSelected: {
    backgroundColor: theme.colors.primaryRGB
      ? `rgba(${theme.colors.primaryRGB}, 0.1)`
      : theme.colors.primary, // Fallback if RGB is not defined
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  foodInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  foodName: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  macros: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: theme.spacing.sm, // For spacing between macro items
  },
  macro: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxIcon: {
    color: theme.colors.onPrimary,
  },
  listContentContainer: {
    paddingBottom: theme.spacing.xxl, // Ensure space for log button
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background, // Match screen background
  },
  logButton: { // Using TouchableOpacity for now
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  logButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  disabledLogButton: {
    backgroundColor: theme.colors.surfaceDisabled,
  },
  disabledLogButtonText: {
    color: theme.colors.onSurfaceDisabled,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.lg,
  },
  emptyListText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  },
});

const ScanResultsScreen: React.FC = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<ScanResultsScreenRouteProp>();
  const {analysis, dateToLog} = route.params; // Added dateToLog from params

  const {parsedItems, parseError} = useMemo(() => {
    try {
      if (!analysis) {
        return {parsedItems: [], parseError: 'No analysis data received.'};
      }
      const rawItems = JSON.parse(analysis) as RawAnalyzedItem[];
      if (!Array.isArray(rawItems)) {
        throw new Error('Analysis data is not an array.');
      }
      const itemsWithId: ParsedFoodItem[] = rawItems.map(
        (item, index: number) => ({
          id: String(item?.id ?? `item-${index}`),
          name: String(item?.name ?? 'Unknown Item'),
          calories:
            typeof item?.calories === 'number' ? item.calories : undefined,
          protein: typeof item?.protein === 'number' ? item.protein : undefined,
          carbs: typeof item?.carbs === 'number' ? item.carbs : undefined,
          fat: typeof item?.fat === 'number' ? item.fat : undefined,
          serving_size:
            typeof item?.serving_size === 'number'
              ? item.serving_size
              : undefined,
          serving_unit:
            typeof item?.serving_unit === 'string'
              ? item.serving_unit
              : undefined,
        }),
      );
      return {parsedItems: itemsWithId, parseError: null};
    } catch (e) {
      console.error('Failed to parse analysis JSON:', e);
      const message =
        e instanceof Error ? e.message : 'Invalid analysis format.';
      return {
        parsedItems: [],
        parseError: `Failed to process results: ${message}`,
      };
    }
  }, [analysis]);

  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    new Set(),
  );

  const toggleItemSelection = (itemId: string) => {
    setSelectedItemIds(prevSelectedIds => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(itemId)) {
        newSelectedIds.delete(itemId);
      } else {
        newSelectedIds.add(itemId);
      }
      return newSelectedIds;
    });
  };

  const [isLogging, setIsLogging] = useState(false);

  const handleLogItems = useCallback(async () => {
    const selectedItems = parsedItems.filter(item =>
      selectedItemIds.has(item.id),
    );

    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select items to log.');
      return;
    }

    if (isLogging) return;
    setIsLogging(true);

    const logPromises: Promise<FoodLog | null>[] = [];
    let successfulLogs = 0;
    let failedLogs = 0;

    for (const item of selectedItems) {
      const logData: AddFoodLogData = {
        food_name: item.name,
        calories: item.calories ?? 0,
        protein: item.protein ?? 0,
        carbs: item.carbs ?? 0,
        fat: item.fat ?? 0,
        serving_size: item.serving_size ?? 1,
        serving_unit: item.serving_unit ?? 'item',
        log_date: dateToLog, // Use dateToLog from route params
      };
      logPromises.push(addFoodLog(logData));
    }

    try {
      const results = await Promise.allSettled(logPromises);
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          successfulLogs++;
        } else {
          failedLogs++;
          const failedItem = selectedItems[index];
          console.error(
            `Failed to log item '${failedItem.name}':`,
            result.status === 'rejected'
              ? result.reason
              : 'Service returned null',
          );
        }
      });

      let alertMessage = `${successfulLogs} item(s) logged successfully.`;
      if (failedLogs > 0) {
        alertMessage += `\n${failedLogs} item(s) failed to log. Check console for details.`;
      }
      Alert.alert('Log Complete', alertMessage, [
        {text: 'OK', onPress: () => navigation.popToTop()},
      ]);
    } catch (error) {
      console.error('Unexpected error during batch logging:', error);
      Alert.alert(
        'Logging Error',
        'An unexpected error occurred while trying to log items.',
      );
    } finally {
      setIsLogging(false);
    }
  }, [parsedItems, selectedItemIds, isLogging, navigation, dateToLog, theme]); // Added theme to dependencies

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const renderFoodItem = ({item}: {item: ParsedFoodItem}) => {
    const isSelected = selectedItemIds.has(item.id);
    return (
      <TouchableOpacity
        style={[styles.foodCard, isSelected && styles.foodCardSelected]}
        onPress={() => toggleItemSelection(item.id)}
        activeOpacity={0.7}>
        <View style={styles.foodInfo}>
          <AppText style={styles.foodName}>{item.name}</AppText>
          {(item.calories !== undefined ||
            item.protein !== undefined ||
            item.carbs !== undefined ||
            item.fat !== undefined) && (
            <View style={styles.macros}>
              {item.calories !== undefined && (
                <AppText style={styles.macro}>
                  🔥 {item.calories.toFixed(0)} cal
                </AppText>
              )}
              {item.protein !== undefined && (
                <AppText style={styles.macro}> P: {item.protein.toFixed(1)}g</AppText>
              )}
              {item.carbs !== undefined && (
                <AppText style={styles.macro}> C: {item.carbs.toFixed(1)}g</AppText>
              )}
              {item.fat !== undefined && (
                <AppText style={styles.macro}> F: {item.fat.toFixed(1)}g</AppText>
              )}
            </View>
          )}
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={18} style={styles.checkboxIcon} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (parseError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AppText style={styles.errorText}>{parseError}</AppText>
          {/* Replace Button with themed TouchableOpacity */}
          <TouchableOpacity style={styles.logButton} onPress={handleGoBack}>
            <AppText style={styles.logButtonText}>Go Back</AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (parsedItems.length === 0 && !parseError) {
    return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} hitSlop={{top:10, bottom:10, left:10, right:10}}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <AppText style={styles.headerTitle}>Scan Results</AppText>
          <View style={{width: 24}} />{/* Spacer */}
        </View>
        <View style={styles.emptyListContainer}>
          <AppText style={styles.emptyListText}>
            No food items were identified in the scan.
          </AppText>
          <TouchableOpacity style={styles.logButton} onPress={handleGoBack}>
            <AppText style={styles.logButtonText}>Try Again</AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Select Items to Log</AppText>
        <View style={{width: 24}} />{/* Spacer */}
      </View>
      <FlatList
        data={parsedItems}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <AppText style={styles.emptyListText}>
              No items to display. This shouldn&apos;t happen if parseError is null and parsedItems is not empty.
            </AppText>
          </View>
        }
      />
      {parsedItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.logButton,
              (isLogging || selectedItemIds.size === 0) && styles.disabledLogButton,
            ]}
            onPress={() => { void handleLogItems(); }}
            disabled={isLogging || selectedItemIds.size === 0}>
            {isLogging ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              <AppText style={[
                styles.logButtonText,
                (isLogging || selectedItemIds.size === 0) && styles.disabledLogButtonText,
              ]}>
                Log Selected ({selectedItemIds.size})
              </AppText>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScanResultsScreen;
