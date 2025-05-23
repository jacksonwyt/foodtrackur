import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screen imports
import SubscriptionScreen from '../screens/Subscription'; // Assuming src/screens/Subscription/index.tsx

export type SubscriptionStackParamList = {
  SubscriptionMain: undefined;
};

const Stack = createNativeStackNavigator<SubscriptionStackParamList>();

function SubscriptionNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SubscriptionMain" component={SubscriptionScreen} />
    </Stack.Navigator>
  );
}

export default SubscriptionNavigator;
