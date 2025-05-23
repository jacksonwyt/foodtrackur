import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {useSelector} from 'react-redux';
import {selectIsAuthenticated} from '@/store/slices/authSlice';
import {Platform, StyleSheet} from 'react-native';
import {CustomTabBarButton} from '@/components/navigation/CustomTabBarButton';
import {useTheme} from '@/hooks/useTheme';

// Import your screen components here
// Auth Screens
import {LoginScreen} from '@/screens/Auth/LoginScreen';
import {SignUpScreen} from '@/screens/Auth/SignUpScreen';

// Main App Screens (Tabs)
import HomeScreen from '@/screens/Home/index';
import ProgressScreen from '@/screens/Progress';
import ExerciseScreen from '@/screens/Exercise';
import AddFoodScreen from '@/screens/FoodDB/add';

// Import SettingsNavigator
import SettingsNavigator from './SettingsNavigator';
import ScanNavigator from './ScanNavigator';
import FoodDBNavigator from './FoodDBNavigator';
import SubscriptionNavigator from './SubscriptionNavigator';
import WeightNavigator from './WeightNavigator';

// Import common navigation types
import {
  AppStackParamList,
  AuthStackParamList,
  MainTabParamList,
  HomeStackParamList,
  ProgressStackParamList,
  ExerciseStackParamList,
  ScanStackParamList,
  FoodDBStackParamList,
  SubscriptionStackParamList,
  WeightStackParamList,
} from '@/types/navigation';

const Stack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStackNavigator = createNativeStackNavigator<HomeStackParamList>();
const ProgressStackNavigator =
  createNativeStackNavigator<ProgressStackParamList>();
const ExerciseStackNavigator =
  createNativeStackNavigator<ExerciseStackParamList>();

// Define Stack Navigators for each tab
function HomeStack() {
  return (
    <HomeStackNavigator.Navigator screenOptions={{headerShown: false}}>
      <HomeStackNavigator.Screen name="Home" component={HomeScreen} />
      {/* Add other screens specific to the Home tab here */}
    </HomeStackNavigator.Navigator>
  );
}

function ProgressStack() {
  return (
    <ProgressStackNavigator.Navigator screenOptions={{headerShown: false}}>
      <ProgressStackNavigator.Screen
        name="Progress"
        component={ProgressScreen}
      />
      {/* Add other screens specific to the Progress tab here */}
    </ProgressStackNavigator.Navigator>
  );
}

function ExerciseStack() {
  return (
    <ExerciseStackNavigator.Navigator screenOptions={{headerShown: false}}>
      <ExerciseStackNavigator.Screen
        name="Exercise"
        component={ExerciseScreen}
      />
      {/* Add other screens specific to the Exercise tab here */}
    </ExerciseStackNavigator.Navigator>
  );
}

// Auth Stack
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// A component that renders nothing, to satisfy React Navigation
function NullComponent() {
  return null;
}

// Main Tab Navigator
function MainTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Consistent with previous setup
        tabBarActiveTintColor: '#007AFF', // From previous setup
        tabBarInactiveTintColor: 'gray', // From previous setup
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({
            focused,
            color,
            size,
          }: {
            focused: boolean;
            color: string;
            size: number;
          }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size * 0.9}
              color={color}
            /> // size * 0.9 from original
          ),
        }}
      />
      <Tab.Screen
        name="AddModal" // This name is for the tab, navigation to modal is separate
        component={NullComponent} // Use the defined NullComponent
        options={{
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressStack}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({
            focused,
            color,
            size,
          }: {
            focused: boolean;
            color: string;
            size: number;
          }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={size * 0.9}
              color={color}
            /> // size * 0.9 from original
          ),
        }}
      />
      <Tab.Screen
        name="ExerciseTab"
        component={ExerciseStack}
        options={{
          tabBarLabel: 'Exercise',
          tabBarIcon: ({
            focused,
            color,
            size,
          }: {
            focused: boolean;
            color: string;
            size: number;
          }) => (
            <Ionicons
              name={focused ? 'barbell' : 'barbell-outline'}
              size={size * 0.9}
              color={color}
            /> // size * 0.9 from original
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root App Navigator
export default function AppNavigator() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="SettingsNav" component={SettingsNavigator} />
            <Stack.Screen name="ScanNav" component={ScanNavigator} />
            <Stack.Screen name="FoodDBNav" component={FoodDBNavigator} />
            <Stack.Screen
              name="SubscriptionNav"
              component={SubscriptionNavigator}
            />
            <Stack.Screen name="WeightNav" component={WeightNavigator} />
            {/* Modal screens can be grouped here if needed */}
            <Stack.Group screenOptions={{presentation: 'modal'}}>
              <Stack.Screen name="AddFood" component={AddFoodScreen} />
              {/* <Stack.Screen name="FoodDetailsModal" component={FoodDetailsScreen} /> */}
            </Stack.Group>
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles for the Tab Bar (copied from app/(app)/_layout.tsx)
const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 25 : 20,
    left: 20,
    right: 20,
    elevation: 0, // Note: elevation for shadow on Android is often applied to the container, not the bar style directly for complex layouts.
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 70,
    borderTopWidth: 0, // Explicitly set to remove default top border if any
    // For shadow on iOS, it's often applied via shadowProps on the View, but react-navigation might handle this differently or require it on a wrapper.
    // The custom button has its own shadow. For the bar itself, these are typical for iOS if needed directly on style:
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -3 }, // Shadow pointing upwards
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
  },
});

// TODO:
// 1. Finalize dark mode / light mode theming for all nav elements.
// 2. Ensure all necessary params are passed (e.g., initialDate to AddFood).
// 3. Thoroughly test all navigation paths after this refactor.
// 4. Ensure initialDate param logic for AddFoodScreen is handled.
// 5. Remove old layout files once confident.

//
