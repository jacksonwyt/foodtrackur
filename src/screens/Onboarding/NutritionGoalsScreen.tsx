import React from 'react';
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
  AppStackParamList,
} from '../../types/navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
// Removed getProfile as profile data should now come from Redux store via fetchUserProfile
// import {getProfile, Profile} from '../../services/profileService'; 
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme';
import {OnboardingHeader} from '../../components/onboarding/OnboardingHeader';
import {useSelector} from 'react-redux'; // Removed useDispatch
import {
  selectUserProfile, // Corrected: use selectUserProfile
  selectProfileStatus,
  selectProfileError, // Added to use for error display
  selectOnboardingComplete, // <-- Import this selector
} from '../../store/slices/profileSlice'; 
// import {selectCurrentUser} from '../../store/slices/authSlice'; // No longer needed for dispatching
import type {RootState} from '../../store/store'; // Removed AppDispatch
// import type {Profile} from '../../services/profileService'; // Removed Profile type import
import {Ionicons} from '@expo/vector-icons'; // Added for icons
import * as Haptics from 'expo-haptics'; // Added for haptic feedback
import CircularProgressIndicator from 'react-native-circular-progress-indicator'; // Added for circular progress

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
      flexWrap: 'wrap', // Allow wrapping if items are too wide
    },
    goalItem: {
      alignItems: 'center',
      padding: theme.spacing.md, // Increased padding for card feel
      backgroundColor: theme.colors.surface, 
      borderRadius: theme.borderRadius.lg, // More pronounced border radius
      minWidth: 150, // Increased minWidth to accommodate circle + text
      margin: theme.spacing.xs, // Add margin for separation between cards
      ...theme.shadows.md, // More pronounced shadow for card effect
      justifyContent: 'center', 
      marginBottom: theme.spacing.md, // Space below each card
    },
    goalIcon: {
      marginBottom: theme.spacing.sm, // Space between icon and progress circle
    },
    goalValue: { // This style is for the text within the circular progress
      fontSize: theme.typography.sizes.h3, // Adjusted for fitting in circle
      fontWeight: theme.typography.weights.semibold,
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.primary,
    },
    goalLabel: {
      fontSize: theme.typography.sizes.caption,
      fontFamily: theme.typography.fontFamily,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm, // Increased margin for spacing from circle
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
  // const [profile, setProfile] = useState<Profile | null>(null); // Replaced by Redux state
  // const [isLoading, setIsLoading] = useState(true); // Replaced by Redux state
  // const [error, setError] = useState<string | null>(null); // Replaced by Redux state
  // const dispatch = useDispatch<AppDispatch>(); // No longer dispatching from here

  // Get profile data from Redux store
  const reduxProfile = useSelector(selectUserProfile); // Use the correct selector
  const profileStatus = useSelector(selectProfileStatus);
  const profileErrorFromSlice = useSelector(selectProfileError); // Get error from slice
  const onboardingComplete = useSelector(selectOnboardingComplete); // <-- Get the state

  // Local state for this screen if needed, or rely on Redux for profile data
  // const [currentProfile, setCurrentProfile] = useState<Profile | null>(reduxProfile);
  // No longer need local currentProfile state if directly using reduxProfile for display
  // useEffect(() => {
  //   if (reduxProfile) {
  //     setCurrentProfile(reduxProfile);
  //   }
  // }, [reduxProfile]);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Add haptic feedback
    if (onboardingComplete) {
      console.log(
        "Let's Get Started! pressed. Onboarding is complete. Navigating to Subscription Screen.",
      );
      navigation.navigate('SubscriptionNav', {screen: 'SubscriptionMain'});
    } else {
      console.warn(
        "NutritionGoalsScreen: 'Let's Get Started!' pressed, but onboardingComplete is still false. AppNavigator might not be ready.",
      );
      // Optionally, you could add a small delay and re-check, or navigate to a loading/transition screen.
      // For now, this logs a warning. The navigation might still fail if AppNavigator hasn't switched.
      // Consider if AppNavigator should handle this transition more centrally.
    }
  };

  if (profileStatus === 'loading' || profileStatus === 'idle') {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  // Use profileErrorFromSlice for error display
  if (profileErrorFromSlice || !reduxProfile) { 
    return (
      <SafeAreaView style={styles.safeArea}>
        <OnboardingHeader title="Your Daily Goals" />
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {profileErrorFromSlice || 'Profile data is unavailable.'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Use reduxProfile directly for rendering data
  const displayProfile = reduxProfile; 

  return (
    <SafeAreaView style={styles.safeArea}>
      <OnboardingHeader title="You're All Set!" />
      <View style={styles.container}>
        {/* <Text style={styles.title}>Your Daily Goals</Text> */}
        {/* <Text style={styles.subtitle}> */}
        {/*  Based on your information, here are your recommended daily targets: */}
        {/* </Text> */}
        <Text style={styles.descriptiveText}>
          Congratulations! Based on your information, here are your personalized daily nutritional targets. You're ready to begin your journey!
        </Text>

        <View style={styles.goalsContainer}>
          <View style={styles.goalItem}>
            <Ionicons
              name="flame-outline"
              size={32} 
              color={theme.colors.primary}
              style={styles.goalIcon}
            />
            <CircularProgressIndicator
              value={displayProfile.target_calories || 0}
              maxValue={displayProfile.target_calories || 0} 
              radius={40}
              activeStrokeColor={theme.colors.primary}
              inActiveStrokeColor={theme.colors.border} 
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={8}
              inActiveStrokeWidth={8}
              title={'kcal'}
              titleStyle={{
                fontSize: theme.typography.sizes.caption,
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily,
              }}
              valueSuffix=''
              progressValueStyle={styles.goalValue} // Use defined style
            />
            <Text style={styles.goalLabel}>Calories</Text>
          </View>

          <View style={styles.goalItem}>
            <Ionicons
              name="barbell-outline"
              size={32}
              color={theme.colors.primary}
              style={styles.goalIcon}
            />
            <CircularProgressIndicator
              value={displayProfile.target_protein_g || 0}
              maxValue={displayProfile.target_protein_g || 0}
              radius={40}
              activeStrokeColor={theme.colors.primary}
              inActiveStrokeColor={theme.colors.border}
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={8}
              inActiveStrokeWidth={8}
              title={'grams'}
              titleStyle={{
                fontSize: theme.typography.sizes.caption,
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily,
              }}
              valueSuffix={'g'}
              progressValueStyle={styles.goalValue} // Use defined style
            />
            <Text style={styles.goalLabel}>Protein</Text>
          </View>

          <View style={styles.goalItem}>
            <Ionicons
              name="nutrition-outline"
              size={32}
              color={theme.colors.primary}
              style={styles.goalIcon}
            />
            <CircularProgressIndicator
              value={displayProfile.target_carbs_g || 0}
              maxValue={displayProfile.target_carbs_g || 0}
              radius={40}
              activeStrokeColor={theme.colors.primary}
              inActiveStrokeColor={theme.colors.border}
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={8}
              inActiveStrokeWidth={8}
              title={'grams'}
              titleStyle={{
                fontSize: theme.typography.sizes.caption,
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily,
              }}
              valueSuffix={'g'}
              progressValueStyle={styles.goalValue} // Use defined style
            />
            <Text style={styles.goalLabel}>Carbs</Text>
          </View>

          <View style={styles.goalItem}>
            <Ionicons
              name="water-outline" 
              size={32}
              color={theme.colors.primary}
              style={styles.goalIcon}
            />
            <CircularProgressIndicator
              value={displayProfile.target_fat_g || 0}
              maxValue={displayProfile.target_fat_g || 0}
              radius={40}
              activeStrokeColor={theme.colors.primary}
              inActiveStrokeColor={theme.colors.border}
              inActiveStrokeOpacity={0.5}
              activeStrokeWidth={8}
              inActiveStrokeWidth={8}
              title={'grams'}
              titleStyle={{
                fontSize: theme.typography.sizes.caption,
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily,
              }}
              valueSuffix={'g'}
              progressValueStyle={styles.goalValue} // Use defined style
            />
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
