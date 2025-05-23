import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screen imports
import WeightScreen from '../screens/Weight'; // Assuming src/screens/Weight/index.tsx
import LogWeightScreen from '../screens/Weight/LogWeightScreen';

export type WeightStackParamList = {
  WeightMain: undefined;
  LogWeight: undefined; // Or add params like { initialDate?: string }
};

const Stack = createNativeStackNavigator<WeightStackParamList>();

function WeightNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="WeightMain" component={WeightScreen} />
      <Stack.Screen name="LogWeight" component={LogWeightScreen} />
    </Stack.Navigator>
  );
}

export default WeightNavigator;
