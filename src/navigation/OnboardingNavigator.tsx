import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import type {OnboardingStackParamList} from '../types/navigation';
import WelcomeScreen from '../screens/Onboarding/WelcomeScreen';
import {GoalsScreen} from '../screens/Onboarding/Goals'; // Assuming Goals.tsx exports GoalsScreen
import {DetailsScreen} from '../screens/Onboarding/Details'; // Assuming Details.tsx exports DetailsScreen
import NutritionGoalsScreen from '../screens/Onboarding/NutritionGoalsScreen';

// Import actions and selectors if needed for the navigator itself, though likely done in screens
// For example, to dispatch profile updates or check auth state if necessary at this level

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator(): React.ReactElement {
  // const dispatch = useDispatch();
  // const currentUser = useSelector(selectCurrentUser); // From authSlice

  // The final screen of onboarding (e.g., NutritionGoalsScreen or DetailsScreen)
  // will be responsible for collecting all data and calling a thunk like
  // updateUserProfileAndCompleteOnboarding, which then updates the Redux state.
  // AppNavigator will then see `onboardingComplete` is true and switch to MainTabs.

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="NutritionGoals" component={NutritionGoalsScreen} />
      {/* Add other onboarding screens here as defined in OnboardingStackParamList */}
      {/* e.g., <Stack.Screen name="DesiredWeight" component={DesiredWeightScreen} /> */}
    </Stack.Navigator>
  );
} 