import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {NavigatorScreenParams, RouteProp} from '@react-navigation/native';
import type {FoodLogItemData} from '../screens/FoodDB/LogEntryScreen'; // Import from its actual location

// Define ParamList for individual Stacks within MainTabs
export type HomeStackParamList = {
  Home: {selectedDateISO?: string; refreshTimestamp?: number}; // Screen within HomeStack can receive this
  // Add other screens navigable from Home tab here
};

export type ProgressStackParamList = {
  Progress: undefined;
  // Add other screens navigable from Progress tab here
};

export type ExerciseStackParamList = {
  Exercise: undefined;
  // Add other screens navigable from Exercise tab here
};

// Define ParamList for the Scan Stack (new)
export type ScanStackParamList = {
  ScanMain: {dateToLog: string};
  ScanConfirm: {imageUri: string; imageBase64: string; dateToLog: string};
  ScanResults: {analysis: string; dateToLog: string};
};

// Define ParamList for the FoodDB Stack (new)
export type FoodDBStackParamList = {
  FoodDBMain: {initialDate?: string};
  FoodDetails: {
    foodId: string;
    source: 'fatsecret' | 'custom';
    dateToLog: string;
  }; // Updated FoodDetails
  LogEntry: {foodItem: FoodLogItemData; dateToLog: string}; // Updated LogEntry
  FoodSearch: {dateToLog: string; query?: string};
};

// Define ParamList for the Subscription Stack (new)
export type SubscriptionStackParamList = {
  SubscriptionMain: undefined;
};

// Define ParamList for the Weight Stack (new)
export type WeightStackParamList = {
  WeightMain: undefined;
  LogWeight: undefined;
};

// Define ParamList for a new Settings Stack
export type SettingsStackParamList = {
  SettingsMain: undefined;
  EditProfile: undefined; // Assuming EditProfileScreen exists
  AdjustGoals: undefined; // For AdjustGoalsScreen
  // Add other specific settings screens here
};

// Define ParamList for the Main Tab Navigator
export type MainTabParamList = {
  FoodDBTab: NavigatorScreenParams<FoodDBStackParamList>; // ADDED FoodDBTab
  HomeTab: NavigatorScreenParams<HomeStackParamList>; // HomeTab now contains a stack
  AddModal: undefined; // Placeholder for the central button action
  ProgressTab: NavigatorScreenParams<ProgressStackParamList>; // ProgressTab contains a stack
  ExerciseTab: NavigatorScreenParams<ExerciseStackParamList>; // ExerciseTab contains a stack
};

// Define ParamList for the Root Stack Navigator (now AppStackParamList)
// This matches the structure in AppNavigator.tsx
export type AppStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>; // Added Onboarding route
  Main: NavigatorScreenParams<MainTabParamList>;
  AddFood: {initialDate: string};
  SettingsNav: NavigatorScreenParams<SettingsStackParamList>; // MODIFIED to use SettingsStackParamList
  ScanNav: NavigatorScreenParams<ScanStackParamList>; // Added ScanNav
  FoodDBNav: NavigatorScreenParams<FoodDBStackParamList>; // Added FoodDBNav
  SubscriptionNav: NavigatorScreenParams<SubscriptionStackParamList>; // Added SubscriptionNav
  WeightNav: NavigatorScreenParams<WeightStackParamList>; // Added WeightNav
};

// Types for user data collected during onboarding
export type GoalType = 'lose' | 'maintain' | 'gain';
export type GenderType = 'male' | 'female' | 'other' | null | undefined; // Allow undefined
// export type ActivityLevelType = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra' | null | undefined; // Allow undefined
export type ActivityLevelType =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'extra_active'
  | null
  | undefined; // Matched to profileService

export interface OnboardingData {
  name?: string;
  goal?: GoalType;
  height?: number;
  weight?: number;
  dob?: string;
  gender?: GenderType;
  // desiredWeight?: number; // If goal is lose/gain
  // goalPace?: number; // e.g., kg/week or lbs/week
  goal_weight?: number | null; // Renamed to match Profile/UpdateProfileData
  goal_pace?: number | null; // Renamed to match Profile/UpdateProfileData
  activityLevel?: ActivityLevelType;
}

// Parameter list for the dedicated Onboarding stack
export type OnboardingStackParamList = {
  Welcome: undefined;
  Goals: undefined;
  Details: {goal: GoalType}; // Receive the chosen goal from GoalsScreen
  NutritionGoals: undefined; // Added NutritionGoals screen
  // Add other screens like DesiredWeight, GoalPace if they become separate steps
};

// Parameter list for the dedicated Auth stack
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// --- Utility Type Helpers ---

// Generic type for navigation props in the App Stack
export type AppStackNavigationProp<T extends keyof AppStackParamList> =
  NativeStackNavigationProp<AppStackParamList, T>;

// Generic type for route props in the App Stack
export type AppStackRouteProp<T extends keyof AppStackParamList> = RouteProp<
  AppStackParamList,
  T
>;

// You might need composite types if navigating between nested stacks/tabs frequently,
// but start simple and add them if required by TypeScript errors.
