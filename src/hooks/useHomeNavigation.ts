import { useNavigation, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Remove Ionicons import if not used elsewhere in this hook
// import { Ionicons } from '@expo/vector-icons'; 

// Import shared types
import { RootStackParamList } from '@/src/types/navigation';

// Define the type for recent items if not already shared
// Reusing the one potentially defined in useHomeData or a central types file
interface RecentItem {
  id: string;
  // other fields as needed...
}

// Define type for Quick Action - Removed as quickActions are no longer used
/*
interface QuickAction {
    id: string;
    label: string;
    icon: string; // Use string type directly
    onPress: () => void;
}
*/

// Define the parameters for the screens in your navigation stack - MOVED to src/types/navigation.ts
/*
export type RootStackParamList = {
  MainTabs: undefined; // Represents the Bottom Tab Navigator itself
  Home: undefined; // If Home is also directly in the stack (unlikely with tabs)
  // Remove Food: undefined; // Represents the Food Tab
  Progress: undefined; // Represents the Progress Tab
  Exercise: undefined; // Represents the Exercise Tab
  Settings: undefined; // Represents the Settings Tab
  Scan: undefined;
  Weight: undefined;
  Subscription: undefined;
  AddMeal: undefined; // Screen for adding a meal/food
  // ... add other screens and their params here
};
*/

export const useHomeNavigation = () => {
  // Strongly type the navigation prop using the defined ParamList
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList & ParamListBase>>();

  // Navigation functions using React Navigation
  // const navigateToScan = () => navigation.navigate('Scan'); // Handled by tab bar
  const navigateToExercise = () => navigation.navigate('MainTabs', { screen: 'Exercise' }); // Keep if needed elsewhere
  // const navigateToWeight = () => navigation.navigate('Weight'); // Handled by separate screen/tab probably
  const navigateToSubscription = () => navigation.navigate('Subscription');
  const navigateToAddMeal = () => navigation.navigate('AddMeal', { mealCategory: 'breakfast'});
  const navigateToSettings = () => navigation.navigate('Settings'); // Add Settings navigation
  
  // Define Quick Actions within the hook - Removed
  /*
  const quickActions: QuickAction[] = [
    {
      id: 'scan',
      label: 'Scan Food',
      icon: 'scan', 
      onPress: navigateToScan,
    },
    {
      id: 'exercise',
      label: 'Log Exercise',
      icon: 'fitness', 
      onPress: navigateToExercise,
    },
    {
      id: 'weight',
      label: 'Log Weight',
      icon: 'scale', 
      onPress: navigateToWeight,
    },
  ];
  */

  // Return actions and individual navigation functions
  return {
    // quickActions, // Removed
    // navigateToScan, // Removed
    navigateToExercise, // Keep this one
    // navigateToWeight, // Removed
    navigateToSubscription,
    navigateToAddMeal,
    navigateToSettings, // Export Settings navigation function
  };
}; 