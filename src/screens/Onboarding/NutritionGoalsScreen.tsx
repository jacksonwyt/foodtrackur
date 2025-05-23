import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {
  OnboardingStackParamList,
  AppStackParamList,
} from '../../types/navigation';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {getProfile, Profile} from '../../services/profileService';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';

// interface NutritionGoalsScreenProps {
//   navigation: NativeStackNavigationProp<OnboardingStackParamList, 'NutritionGoals'>;
// }

// Define makeStyles outside the component
const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      justifyContent: 'flex-start',
      alignItems: 'center',
      // backgroundColor: theme.colors.background, // Already on safeArea
    },
    descriptiveText: {
      fontSize: theme.typography.sizes.body,
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    goalsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: theme.spacing.xl,
    },
    goalItem: {
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface, // Use theme colors
      borderRadius: theme.borderRadius.sm, // Use theme border radius
      minWidth: 80, // Or calculate based on screen width / number of items
      ...theme.shadows.sm, // Add shadow or elevation if desired, e.g., ...theme.shadows.sm
    },
    goalValue: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.semibold,
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.primary, // Use theme primary color
    },
    goalLabel: {
      fontSize: theme.typography.sizes.caption,
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    infoText: {
      fontSize: theme.typography.sizes.caption,
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.textPlaceholder, // Use theme placeholder text color
      textAlign: 'center',
      marginBottom: theme.spacing.xxl, // Use theme spacing
    },
    button: {
      backgroundColor: theme.colors.primary, // Use theme primary color
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.md, // Use theme border radius
      width: '80%',
      alignItems: 'center',
      ...theme.shadows.sm, // Apply a small shadow from the theme
    },
    buttonPressed: {
      opacity: 0.8, // Standard pressed opacity
    },
    buttonText: {
      fontSize: theme.typography.sizes.bodyLarge, // Use theme typography
      fontWeight: theme.typography.weights.medium,
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.onPrimary, // Text color for onPrimary background
    },
    errorContainer: {
      backgroundColor: theme.colors.errorBackground, // Light red for error message backgrounds
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      width: '100%',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      // Consider adding an icon here if you have an icon library
    },
    // Error text style from the original component, ensure it uses theme
    errorText: {
      fontSize: theme.typography.sizes.body, // Example, adjust as needed
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.error, // Use theme error color
      textAlign: 'center',
      padding: theme.spacing.md, // Use theme spacing
    },
  });

export default function NutritionGoalsScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme); // Call makeStyles here
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        const userProfile = await getProfile();
        if (userProfile) {
          setProfile(userProfile);
        } else {
          setError('Could not load profile. Please try again.');
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unexpected error occurred while fetching profile.');
        }
        console.error('Failed to fetch profile:', e);
      } finally {
        setIsLoading(false);
      }
    }
    void fetchProfileData();
  }, []);

  const handleContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Main', params: {screen: 'HomeTab'}}],
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <OnboardingHeader title="Your Daily Goals" />
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error || 'Profile data is unavailable.'}
            </Text>
          </View>
          {/* Optionally, add a retry button here */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader title="Your Daily Goals" />
      <View style={styles.container}>
        {/* <Text style={styles.title}>Your Daily Goals</Text> */}
        {/* <Text style={styles.subtitle}> */}
        {/*  Based on your information, here are your recommended daily targets: */}
        {/* </Text> */}
        <Text style={styles.descriptiveText}>
          Based on your information, here are your recommended daily targets:
        </Text>

        <View style={styles.goalsContainer}>
          <View style={styles.goalItem}>
            <Text style={styles.goalValue}>
              {Math.round(profile.target_calories || 0)}
            </Text>
            <Text style={styles.goalLabel}>Calories</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalValue}>
              {Math.round(profile.target_protein_g || 0)}g
            </Text>
            <Text style={styles.goalLabel}>Protein</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalValue}>
              {Math.round(profile.target_carbs_g || 0)}g
            </Text>
            <Text style={styles.goalLabel}>Carbs</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalValue}>
              {Math.round(profile.target_fat_g || 0)}g
            </Text>
            <Text style={styles.goalLabel}>Fat</Text>
          </View>
        </View>

        <Text style={styles.infoText}>
          You can adjust these goals anytime in the Settings.
        </Text>

        <Pressable
          style={({pressed}) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleContinue}>
          <Text style={styles.buttonText}>Let&apos;s Get Started!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
