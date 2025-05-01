import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigatorScreenParams, RouteProp } from '@react-navigation/native'; // Import NavigatorScreenParams
import type { ParamListBase } from '@react-navigation/native';

// Define ParamList for the Main Tab Navigator
export interface MainTabParamList extends ParamListBase {
  Home: undefined;
  Food: undefined;
  Add: undefined;
  Progress: undefined;
  Exercise: undefined;
}

// Define ParamList for the Root Stack Navigator
// Add all screens and their expected params here
// Changed from interface to type as suggested by React Navigation docs, might help with ParamListBase error
export type RootStackParamList = {
  // Use NavigatorScreenParams for nested navigators
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Scan: undefined; // Or define params like { scanType: 'barcode' | 'image' } if needed
  Weight: undefined; // Or { entryId: string } if navigating to a specific entry
  // AddMeal needs optional itemId for editing and optional mealCategory
  AddMeal: { mealCategory?: string; itemId?: string }; 
  FoodDetails: { foodId: string }; // Param to specify which food item to show details for
  Subscription: undefined; // Assuming the modal subscription screen needs no params
  Settings: undefined;
  // Removed FoodDB - it's not a screen in the RootStack anymore
};

// --- Type Helpers --- 

// Prop type for the Root Stack navigator itself
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Generic type for screen props in the Root Stack
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

// Example: Prop type for FoodDetails screen
// export type FoodDetailsScreenProps = RootStackScreenProps<'FoodDetails'>;

// If you need navigation prop type specific to a screen within the stack:
// export type FoodDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FoodDetails'>;
// If you need route prop type specific to a screen within the stack:
// export type FoodDetailsRouteProp = RouteProp<RootStackParamList, 'FoodDetails'>; 