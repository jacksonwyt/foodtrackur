import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screen imports - Assuming paths and default exports
// These will likely need adjustment after migration to src/screens
import ScanScreen from '../screens/Scan'; // Assuming app/Scan/index.tsx
import ScanConfirmScreen from '../screens/Scan/confirm';
import ScanResultsScreen from '../screens/Scan/results';

export type ScanStackParamList = {
  ScanMain: undefined;
  ScanConfirm: {imageUri: string; imageBase64: string; dateToLog: string}; // Params from existing RootStackParamList
  ScanResults: {analysis: string}; // Params from existing RootStackParamList
};

const Stack = createNativeStackNavigator<ScanStackParamList>();

function ScanNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ScanMain" component={ScanScreen} />
      <Stack.Screen name="ScanConfirm" component={ScanConfirmScreen} />
      <Stack.Screen name="ScanResults" component={ScanResultsScreen} />
    </Stack.Navigator>
  );
}

export default ScanNavigator;
