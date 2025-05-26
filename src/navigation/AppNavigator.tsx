import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';
import {useSelector} from 'react-redux';
import {
  selectIsAuthenticated,
  selectAuthStatus,
} from '@/store/slices/authSlice';
import {
  selectOnboardingComplete,
  selectProfileStatus,
} from '@/store/slices/profileSlice';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {CustomTabBarButton} from '@/components/navigation/CustomTabBarButton';
import {useTheme} from '@/hooks/useTheme';
import {formatISODate} from '@/utils/dateUtils';
import OnboardingNavigator from './OnboardingNavigator';
import {Platform} from 'react-native';

// Import your screen components here
// Auth Screens
import {LoginScreen} from '@/screens/Auth/LoginScreen';
import {SignUpScreen} from '@/screens/Auth/SignUpScreen';

// Main App Screens (Tabs)
import HomeScreen from '@/screens/Home/index';
import ProgressScreen from '@/screens/Progress';
import ExerciseScreen from '@/screens/Exercise';
import AddFoodScreen from '@/screens/FoodDB/add';
import NutritionGoalsScreen from '@/screens/Onboarding/NutritionGoalsScreen';

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
  OnboardingStackParamList,
} from '@/types/navigation';

const Stack = createNativeStackNavigator<AppStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
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
    <AuthStackNav.Navigator screenOptions={{headerShown: false}}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="SignUp" component={SignUpScreen} />
    </AuthStackNav.Navigator>
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
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
      }}>
      <Tab.Screen
        name="FoodDBTab"
        component={FoodDBNavigator}
        options={{
          tabBarLabel: 'Food DB',
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
              name={focused ? 'search-circle' : 'search-circle-outline'}
              size={size * 0.9}
              color={color}
            />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('FoodDBTab', { 
              screen: 'FoodSearch', 
              params: { dateToLog: formatISODate(new Date()) } 
            });
          },
        })}
      />
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

// Helper hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Root App Navigator
export default function AppNavigator() {
  const authStatus = useSelector(selectAuthStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const onboardingComplete = useSelector(selectOnboardingComplete);
  const profileStatus = useSelector(selectProfileStatus);
  const theme = useTheme();

  const prevOnboardingComplete = usePrevious(onboardingComplete);

  if (authStatus === 'idle' || authStatus === 'loading') {
    return (
      <View style={[styles.centered, {backgroundColor: theme.colors.background}]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isAuthenticated && (profileStatus === 'idle' || profileStatus === 'loading')) {
    return (
      <View style={[styles.centered, {backgroundColor: theme.colors.background}]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !onboardingComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <>
            <Stack.Screen name="PostOnboardingNutritionGoals" component={NutritionGoalsScreen} />
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
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// TODO:
// 1. Finalize dark mode / light mode theming for all nav elements.
// 2. Ensure all necessary params are passed (e.g., initialDate to AddFood).
// 3. Thoroughly test all navigation paths after this refactor.
// 4. Ensure initialDate param logic for AddFoodScreen is handled.
// 5. Remove old layout files once confident.

//
