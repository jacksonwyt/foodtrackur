import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import screens
// Assuming these are the correct paths and that the components are exported as default or named accordingly.
// We'll need to verify these imports and component names later if issues arise.
import SettingsScreen from '../screens/Settings'; // Assuming app/Settings/index.tsx exports the main screen
import EditProfileScreen from '../screens/Settings/EditProfileScreen';
import AdjustGoalsScreen from '../screens/Settings/AdjustGoalsScreen';

// Define ParamList
export type SettingsStackParamList = {
  SettingsMain: undefined; // Renamed from 'SettingsScreen' to avoid conflict with component name
  EditProfile: undefined;
  AdjustGoals: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

function SettingsNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Default to no header, can be overridden per screen
      }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AdjustGoals" component={AdjustGoalsScreen} />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
