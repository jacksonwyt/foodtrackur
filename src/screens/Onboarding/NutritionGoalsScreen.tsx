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
} from '../../store/slices/profileSlice'; 
// import {selectCurrentUser} from '../../store/slices/authSlice'; // No longer needed for dispatching
import type {RootState} from '../../store/store'; // Removed AppDispatch
// import type {Profile} from '../../services/profileService'; // Removed Profile type import

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
  // const [profile, setProfile] = useState<Profile | null>(null); // Replaced by Redux state
  // const [isLoading, setIsLoading] = useState(true); // Replaced by Redux state
  // const [error, setError] = useState<string | null>(null); // Replaced by Redux state
  // const dispatch = useDispatch<AppDispatch>(); // No longer dispatching from here

  // Get profile data from Redux store
  const reduxProfile = useSelector(selectUserProfile); // Use the correct selector
  const profileStatus = useSelector(selectProfileStatus);
  const profileErrorFromSlice = useSelector(selectProfileError); // Get error from slice

  // Local state for this screen if needed, or rely on Redux for profile data
  // const [currentProfile, setCurrentProfile] = useState<Profile | null>(reduxProfile);
  // No longer need local currentProfile state if directly using reduxProfile for display
  // useEffect(() => {
  //   if (reduxProfile) {
  //     setCurrentProfile(reduxProfile);
  //   }
  // }, [reduxProfile]);

  const handleContinue = () => {
    // This button might not even be strictly necessary if AppNavigator handles redirection.
    // If it is kept, it could be a fallback or a way to explicitly acknowledge.
    // For now, let AppNavigator handle the primary redirection.
    console.log("Let's Get Started! pressed. AppNavigator should handle redirection.");
    // Optionally, navigate to a specific tab if AppNavigator doesn't default as desired:
    // navigation.reset({
    //   index: 0,
    //   routes: [{name: 'Main', params: {screen: 'HomeTab'}}],
    // });
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
              {Math.round(displayProfile.target_calories || 0)}
            </Text>
            <Text style={styles.goalLabel}>Calories</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalValue}>
              {Math.round(displayProfile.target_protein_g || 0)}g
            </Text>
            <Text style={styles.goalLabel}>Protein</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalValue}>
              {Math.round(displayProfile.target_carbs_g || 0)}g
            </Text>
            <Text style={styles.goalLabel}>Carbs</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalValue}>
              {Math.round(displayProfile.target_fat_g || 0)}g
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
