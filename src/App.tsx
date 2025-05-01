import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet, Platform, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import Param List type
import { RootStackParamList, MainTabParamList } from '@/src/types/navigation';

// Import your screen components here
import HomeScreen from '@/src/screens/Home';
import FoodScreen from '@/src/screens/Food';
import ProgressScreen from '@/src/screens/Progress';
import ExerciseScreen from '@/src/screens/Exercise';
import SettingsScreen from '@/src/screens/Settings';
import ScanScreen from '@/src/screens/Scan';
import WeightScreen from '@/src/screens/Weight';
import AddMealScreen from '@/src/screens/Food/Add';
import FoodDetailsScreen from '@/src/screens/Food/Details';
import SubscriptionScreen from '@/src/screens/Subscription';

/* // Commented out unused PlaceholderScreen
function PlaceholderScreen({ route }: { route: any }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Screen: {route.name}</Text>
      {route.params && <Text>Params: {JSON.stringify(route.params)}</Text>}
    </View>
  );
}
*/

// Create Navigators
const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Custom Tab Button Component
const CustomTabBarButton: React.FC<{ children: React.ReactNode; onPress?: (event: GestureResponderEvent) => void }> = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButtonContainer}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View style={styles.customButton}>
      {children}
    </View>
  </TouchableOpacity>
);

// Extracted dummy screen to avoid inline component definitions (prevents state loss & perf warnings)
const AddPlaceholderScreen: React.FC = () => null;

// Define the Bottom Tab Navigator component separately (SRP)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          const iconSize = size * 0.9;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Food') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Exercise') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else {
            iconName = 'alert-circle-outline'; // Fallback
          }
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
        {/* Order: Home, Food, Add (custom), Progress, Exercise */}
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Food" component={FoodScreen} />
        <Tab.Screen
          name="Add"
          component={AddPlaceholderScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: () => <Ionicons name="add" size={34} color="#fff" />,
            // Provide a completely custom button so we keep FAB look & feel
            tabBarButton: (props) => (
              <CustomTabBarButton
                {...props}
                // Navigation is handled via listener to avoid multiple triggers
                onPress={props.onPress as any}
              />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Prevent navigation to the placeholder screen
              e.preventDefault();
              // TODO: Replace with action-selector bottom sheet/modal when ready
              navigation.navigate('Scan');
            },
          })}
        />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Exercise" component={ExerciseScreen} />
    </Tab.Navigator>
  );
}

// Define the Root Stack Navigator
function RootStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      {/* Actual screens */}
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Weight" component={WeightScreen} />
      <Stack.Screen name="AddMeal" component={AddMealScreen} />
      <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

// Define the App component
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Add StyleSheet for the custom button and tab bar
const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 25 : 20,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 70,
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    borderTopWidth: 0,
  },
  customButtonContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});