import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { addFoodLog, AddFoodLogData } from '../../services/foodLogService';

// Define the structure of a parsed food item from the analysis
interface ParsedFoodItem {
  id: string; // Unique ID for selection tracking
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  serving_size?: number; // Add serving size if provided by AI
  serving_unit?: string; // Add serving unit if provided by AI
}

// Update the route prop type for this screen
type ScanResultsScreenRouteProp = RouteProp<RootStackParamList, 'ScanResults'>;

const ScanResultsScreen: React.FC = () => {
  // Use react-navigation hooks
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScanResultsScreenRouteProp>();
  const { analysis } = route.params; // Get analysis text

  // Parse the analysis string, handle errors
  const { parsedItems, parseError } = useMemo(() => {
    try {
      if (!analysis) {
          return { parsedItems: [], parseError: 'No analysis data received.' };
      }
      const items = JSON.parse(analysis);
      if (!Array.isArray(items)) {
          throw new Error('Analysis data is not an array.');
      }
      // Add an 'id' based on index for selection tracking if not present
      const itemsWithId: ParsedFoodItem[] = items.map((item, index) => ({
          ...item,
          id: item.id || `item-${index}`, // Use provided id or generate one
          name: item.name || 'Unknown Item', // Add fallback name
      }));
      return { parsedItems: itemsWithId, parseError: null };
    } catch (e) {
      console.error("Failed to parse analysis JSON:", e);
      const message = e instanceof Error ? e.message : 'Invalid analysis format.';
      return { parsedItems: [], parseError: `Failed to process results: ${message}` };
    }
  }, [analysis]);

  // State to track selected item IDs
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  // Toggle selection state for an item
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

  // State for logging process
  const [isLogging, setIsLogging] = useState(false);

  const handleLogItems = useCallback(async () => {
    const selectedItems = parsedItems.filter(item => selectedItemIds.has(item.id));

    if (selectedItems.length === 0) {
      Alert.alert("No Items Selected", "Please select items to log.");
      return;
    }

    if (isLogging) return; // Prevent double taps
    setIsLogging(true);

    console.log("Attempting to log selected items:", selectedItems);

    const logPromises: Promise<any>[] = [];
    let successfulLogs = 0;
    let failedLogs = 0;

    for (const item of selectedItems) {
      // Construct the data payload for the foodLogService
      // Use defaults if specific values are missing from the analysis
      const logData: AddFoodLogData = {
        food_name: item.name,
        calories: item.calories ?? 0,
        protein: item.protein ?? 0,
        carbs: item.carbs ?? 0,
        fat: item.fat ?? 0,
        serving_size: item.serving_size ?? 1, // Default to 1 serving if not specified
        serving_unit: item.serving_unit ?? 'item', // Default unit
        log_date: new Date().toISOString(), // Log for the current time
      };

      // Add the promise to the array
      logPromises.push(addFoodLog(logData));
    }

    try {
      // Wait for all logging attempts to complete
      const results = await Promise.allSettled(logPromises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          successfulLogs++;
        } else {
          failedLogs++;
          const failedItem = selectedItems[index];
          console.error(`Failed to log item '${failedItem.name}':`, result.status === 'rejected' ? result.reason : 'Service returned null');
        }
      });

      // Show summary alert
      let alertMessage = `${successfulLogs} item(s) logged successfully.`;
      if (failedLogs > 0) {
        alertMessage += `\n${failedLogs} item(s) failed to log. Check console for details.`;
      }
      Alert.alert("Log Complete", alertMessage);

      // Navigate back to the top of the stack (e.g., Home screen)
      navigation.popToTop();

    } catch (error) {
      // This catch block might not be strictly necessary with Promise.allSettled
      // but good for catching unexpected errors in the setup loop itself.
      console.error("Unexpected error during batch logging:", error);
      Alert.alert("Logging Error", "An unexpected error occurred while trying to log items.");
    } finally {
      setIsLogging(false);
    }
  }, [parsedItems, selectedItemIds, isLogging, navigation]);

  // Function to go back (e.g., to confirm screen if needed, though we used replace)
  const handleGoBack = () => {
      if (navigation.canGoBack()) {
          navigation.goBack();
      }
  };

  // Render item function for FlatList
  const renderFoodItem = ({ item }: { item: ParsedFoodItem }) => {
    const isSelected = selectedItemIds.has(item.id);
    return (
      <TouchableOpacity
        style={[styles.foodCard, isSelected && styles.foodCardSelected]}
        onPress={() => toggleItemSelection(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{item.name}</Text>
            {/* Display nutritional info if available */}
            {(item.calories !== undefined || item.protein !== undefined || item.carbs !== undefined || item.fat !== undefined) && (
              <View style={styles.macros}>
                {item.calories !== undefined && <Text style={styles.macro}>🔥 {item.calories.toFixed(0)} cal</Text>}
                {item.protein !== undefined && <Text style={styles.macro}> P: {item.protein.toFixed(1)}g</Text>}
                {item.carbs !== undefined && <Text style={styles.macro}> C: {item.carbs.toFixed(1)}g</Text>}
                {item.fat !== undefined && <Text style={styles.macro}> F: {item.fat.toFixed(1)}g</Text>}
              </View>
            )}
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Ionicons name="checkmark" size={18} color="#ffffff" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    // Use SafeAreaView
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          // Use handleGoBack or handleDone depending on desired flow
          onPress={handleGoBack} // Changed from router.back()
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Items to Log</Text>
      </View>

      <ScrollView style={styles.content}>
         {/* Display the raw analysis text */}
         <View style={styles.analysisContainer}>
            <Text style={styles.analysisLabel}>Raw Analysis:</Text>
            <Text style={styles.analysisText}>{analysis || 'No analysis available.'}</Text>
         </View>

         {/* Placeholder for future parsed results/logging actions */}
         <Text style={styles.todoText}>
           TODO: Parse the analysis text above and allow user to select/confirm items to log.
         </Text>

         {/* Removed complex UI based on simulated predictions */}

      </ScrollView>

      {/* Footer Button - updated disabled state and text */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, (selectedItemIds.size === 0 || isLogging) && styles.buttonDisabled]}
          onPress={handleLogItems}
          disabled={selectedItemIds.size === 0 || isLogging}
        >
          <Text style={styles.buttonText}>
            {isLogging ? 'Logging...' : `Log ${selectedItemIds.size > 0 ? `${selectedItemIds.size} Selected Item(s)` : 'Selected Items'}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Changed background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, // Reduced horizontal padding
    paddingVertical: 10,
    paddingTop: 10, // Adjusted padding for SafeAreaView
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Changed border color
    backgroundColor: '#ffffff', // Added header background
  },
  closeButton: {
    padding: 5, // Reduced padding
  },
  title: {
    fontSize: 18, // Adjusted font size
    fontWeight: '600',
    marginLeft: 10, // Reduced margin
    color: '#333',
    flex: 1, // Allow title to take space
    textAlign: 'center', // Center title
    marginRight: 30, // Offset for the back button space
  },
  content: {
    flex: 1,
  },
  analysisContainer: {
      margin: 20,
      padding: 15,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
  },
  analysisLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
      color: '#555',
  },
  analysisText: {
      fontSize: 15,
      lineHeight: 22,
      color: '#333',
  },
  todoText: {
      margin: 20,
      marginTop: 10,
      fontSize: 14,
      color: '#888',
      textAlign: 'center',
      fontStyle: 'italic',
  },
  // Removed styles related to predictions, image, loading, errors
  footer: {
    padding: 15, // Reduced padding
    paddingBottom: 30, // Extra padding for home bar
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#007AFF', // Changed button color to standard blue
    height: 50, // Adjusted height
    borderRadius: 12, // Adjusted radius
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0cfff', // Lighter blue when disabled
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Removed error container styles
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
  },
  foodCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e7f0ff',
  },
  foodInfo: {
    flex: 1,
    marginRight: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  macros: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow macros to wrap
    gap: 10,
    marginTop: 5,
  },
  macro: {
    fontSize: 13,
    color: '#555',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  listContentContainer: {
      padding: 15,
      paddingBottom: 80, // Ensure space above footer
  },
  listHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ScanResultsScreen; 