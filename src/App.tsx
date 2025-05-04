import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, TouchableOpacity, StyleSheet, Platform, GestureResponderEvent, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useSelector } from 'react-redux'; // Import Redux hook
import { selectAuthStatus } from '@/src/store/slices/authSlice'; // Import auth selector

// Import Param List types
import {
  RootStackParamList,
  MainTabParamList,
  OnboardingStackParamList,
  AuthStackParamList, // Add Auth Stack Param List
} from '@/src/types/navigation';

// Import screen components
import HomeScreen from '@/src/screens/Home';
import ProgressScreen from '@/src/screens/Progress';
import ExerciseScreen from '@/src/screens/Exercise';
import SettingsScreen from '@/src/screens/Settings';
import ScanScreen from '@/src/screens/Scan';
import WeightScreen from '@/src/screens/Weight';
import AddMealScreen from '@/src/screens/FoodDB/add';
import FoodLogHubScreen from '@/src/screens/FoodDB';
import FoodSearchScreen from '@/src/screens/FoodDB/search';
import ScanConfirmScreen from '@/src/screens/Scan/confirm';
import SubscriptionScreen from '@/src/screens/Subscription';

// Import Onboarding Screens
import WelcomeScreen from '@/src/screens/Onboarding/Welcome';
import GoalsScreen from '@/src/screens/Onboarding/Goals';
import DetailsScreen from '@/src/screens/Onboarding/Details';

// Import Auth Screens
import { LoginScreen } from '@/src/screens/Auth/LoginScreen';
import { SignUpScreen } from '@/src/screens/Auth/SignUpScreen';

// Create Navigators
const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>(); // Create Auth Navigator

// Custom Tab Button Component (remains the same)
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

// Extracted dummy screen (remains the same)
const AddPlaceholderScreen: React.FC = () => null;

// Define the Bottom Tab Navigator component (remains the same)
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
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="Add"
          component={AddPlaceholderScreen} // Still uses placeholder
          options={{
            tabBarLabel: () => null,
            tabBarIcon: () => <Ionicons name="add" size={34} color="#fff" />,
            tabBarButton: (props) => (
              <CustomTabBarButton
                {...props}
                onPress={props.onPress as any}
              />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              // Type assertion needed here for navigating from Tab to Stack parent
              const parentNav = navigation.getParent();
              if (parentNav) {
                parentNav.navigate('FoodLogHub');
              } else {
                console.error("Could not find parent navigator to navigate to FoodLogHub");
              }
            },
          })}
        />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Exercise" component={ExerciseScreen} />
    </Tab.Navigator>
  );
}

// Define the Root Stack Navigator (remains largely the same)
function RootStackNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
      {/* Other stack screens */}
      <RootStack.Screen name="Scan" component={ScanScreen} />
      <RootStack.Screen name="ScanConfirm" component={ScanConfirmScreen} />
      <RootStack.Screen name="Weight" component={WeightScreen} />
      <RootStack.Screen name="AddMeal" component={AddMealScreen} />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
      <RootStack.Screen name="FoodLogHub" component={FoodLogHubScreen} />
      <RootStack.Screen name="FoodSearch" component={FoodSearchScreen} />
      <RootStack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ presentation: 'modal' }}
      />
    </RootStack.Navigator>
  );
}

// Define the Onboarding Stack Navigator
// Accept the callback prop
function OnboardingStackNavigator({ onOnboardingComplete }: { onOnboardingComplete: () => void }) {
  // TODO: Need a way to signal completion from DetailsScreen
  // This could involve passing a callback, using context, or a state management library.
  // For now, DetailsScreen will handle setting AsyncStorage.
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="Goals" component={GoalsScreen} />
      {/* Pass the onComplete callback down to DetailsScreen */}
      <OnboardingStack.Screen name="Details">
        {(props) => <DetailsScreen route={props.route} onComplete={onOnboardingComplete} />}
      </OnboardingStack.Screen>
      {/* Add other onboarding screens here */}
    </OnboardingStack.Navigator>
  );
}

// Define the Auth Stack Navigator
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// Define the main App component with conditional rendering based on Auth state
export default function App() {
  const authStatus = useSelector(selectAuthStatus); // Get auth status from Redux
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true); // Renamed for clarity
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  // Define the callback function
  const handleOnboardingComplete = useCallback(() => {
    setIsOnboardingComplete(true);
    // Optionally, clear any sensitive onboarding state here if needed
  }, []);

  // Check onboarding status only if authenticated
  useEffect(() => {
    if (authStatus === 'authenticated') {
      const checkOnboardingStatus = async () => {
        setIsLoadingOnboarding(true); // Start loading check
        try {
          const value = await AsyncStorage.getItem('onboardingComplete');
          if (value !== null && value === 'true') {
            setIsOnboardingComplete(true);
          } else {
            setIsOnboardingComplete(false); // Explicitly set to false if not found or not 'true'
          }
        } catch (e) {
          console.error('Failed to load onboarding status', e);
          setIsOnboardingComplete(false); // Default to onboarding on error
        } finally {
          setIsLoadingOnboarding(false); // Finish loading check
        }
      };
      checkOnboardingStatus();
    } else {
      // If not authenticated, no need to check onboarding status yet
      setIsLoadingOnboarding(false);
      setIsOnboardingComplete(false); // Reset onboarding status if user logs out
    }
  }, [authStatus]); // Re-run check when authStatus changes

  // Loading state for initial auth check or onboarding check
  if (authStatus === 'idle' || authStatus === 'loading' || (authStatus === 'authenticated' && isLoadingOnboarding)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {authStatus === 'authenticated' ? (
          // If authenticated, check onboarding status
          isOnboardingComplete ? (
            <RootStackNavigator />
          ) : (
            <OnboardingStackNavigator onOnboardingComplete={handleOnboardingComplete} />
          )
        ) : (
          // If not authenticated, show Auth stack
          <AuthStackNavigator />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Add StyleSheet (add loadingContainer)
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
    borderTopWidth: 0,
  },
  customButtonContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});