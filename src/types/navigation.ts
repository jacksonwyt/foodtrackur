import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigatorScreenParams, RouteProp } from '@react-navigation/native';

// Define ParamList for the Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Add: undefined; // Placeholder for the central button action
  Progress: undefined;
  Exercise: undefined; // Retained as per user request
};

// Define ParamList for the Root Stack Navigator
// This includes screens accessible OUTSIDE the main tabs, like modals or hubs.
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Scan: undefined;
  ScanConfirm: { imageUri: string; imageBase64: string };
  ScanResults: { analysis: string };
  Weight: undefined;
  AddMeal: { mealCategory?: string; itemId?: string };
  Settings: undefined;
  FoodLogHub: undefined;
  FoodSearch: undefined;
  Subscription: undefined; // Modal screen
};

// Types for user data collected during onboarding
export type GoalType = 'lose' | 'maintain' | 'gain';
export type GenderType = 'male' | 'female' | 'other';
export type ActivityLevelType = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';

export interface OnboardingData {
  name?: string; // Add name field
  goal?: GoalType;
  height?: number; // Consider storing units (cm/in) separately or converting on input
  weight?: number; // Consider storing units (kg/lb) separately or converting on input
  dob?: string; // Store as ISO string (YYYY-MM-DD) for consistency
  gender?: GenderType;
  desiredWeight?: number; // If goal is lose/gain
  goalPace?: number; // e.g., kg/week or lbs/week
  activityLevel?: ActivityLevelType;
}

// Parameter list for the dedicated Onboarding stack
export type OnboardingStackParamList = {
  Welcome: undefined;
  Goals: undefined;
  Details: { goal: GoalType }; // Receive the chosen goal from GoalsScreen
  // Add other screens like DesiredWeight, GoalPace if they become separate steps
};

// Parameter list for the dedicated Auth stack
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// --- Utility Type Helpers --- 

// Generic type for navigation props in the Root Stack
export type RootStackNavigationProp<T extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, T>;

// Generic type for route props in the Root Stack
export type RootStackRouteProp<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;

// You might need composite types if navigating between nested stacks/tabs frequently,
// but start simple and add them if required by TypeScript errors.