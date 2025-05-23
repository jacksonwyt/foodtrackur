import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FoodDBStackParamList} from '../types/navigation'; // Import global type

// Screen imports - Will need adjustment based on actual file names and exports in src/screens/food-db
import FoodDBScreen from '../screens/FoodDB'; // Assuming src/screens/FoodDB/index.tsx is the main screen
import FoodDetailsScreen from '../screens/FoodDB/FoodDetailsScreen';
import LogEntryScreen from '../screens/FoodDB/LogEntryScreen';
import FoodSearchScreen from '../screens/FoodDB/search'; // Assuming src/screens/FoodDB/search.tsx

// Note: add.tsx (AddFoodScreen) is handled as a modal in AppNavigator.tsx

// export type FoodDBStackParamList = {
// FoodDBMain: undefined;
// FoodDetails: { foodId: string }; // Example param, adjust as needed
// LogEntry: { date: string; mealType?: string }; // Example params, adjust as needed
// FoodSearch: { query?: string }; // Example param
// };

const Stack = createNativeStackNavigator<FoodDBStackParamList>();

function FoodDBNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="FoodDBMain" component={FoodDBScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
      <Stack.Screen name="LogEntry" component={LogEntryScreen} />
      <Stack.Screen name="FoodSearch" component={FoodSearchScreen} />
    </Stack.Navigator>
  );
}

export default FoodDBNavigator;
