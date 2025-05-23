import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SettingsItemData} from '../components/settings/SettingsListItem'; // Adjust path as necessary
import {signOut} from '../services/auth/authService'; // Added for logout
import {useDispatch, useSelector} from 'react-redux'; // Standard Redux hook
import {setAuthState, selectCurrentUser} from '../store/slices/authSlice'; // Import auth actions and selector
import {useEffect, useState, useCallback} from 'react'; // Added useEffect, useState, useCallback
import {Profile, getProfile} from '../services/profileService'; // Added
import {WeightLog, getLatestWeightLog} from '../services/weightLogService'; // Added
import {Alert} from 'react-native'; // Added for error handling
import type {SettingsStackParamList} from '../types/navigation';

interface SettingsSectionData {
  title: string;
  items: SettingsItemData[];
}

// Helper to calculate age from DOB string
const calculateAge = (dobString?: string): number | null => {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export interface PersonalData {
  age?: number | null;
  height?: string;
  currentWeight?: string;
}

export const useSettingsScreenLogic = (): {
  sections: SettingsSectionData[];
  personalData: PersonalData | null;
  isLoading: boolean;
  error: string | null;
  refreshPersonalData: () => Promise<void>;
} => {
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonalData = useCallback(async () => {
    if (!currentUser?.id) {
      //setError('User not authenticated. Cannot fetch settings data.');
      //setIsLoading(false); // Set loading to false even if user not found yet, to avoid infinite load screen
      // It's possible the user data is still loading from auth state, so we don't throw error immediately
      // The useEffect dependency on currentUser.id will re-trigger once it's available.
      return;
    }

    console.log('Fetching personal data for settings screen...');
    setIsLoading(true);
    setError(null);
    try {
      const profile = await getProfile(); // Assumes getProfile fetches for the current auth user
      const latestWeightLog = await getLatestWeightLog();

      const age = profile?.dob ? calculateAge(profile.dob) : null;
      const height = profile?.height_cm ? `${profile.height_cm} cm` : 'Not set';
      const currentWeight = latestWeightLog
        ? `${latestWeightLog.weight} ${latestWeightLog.unit}`
        : 'Not logged';

      setPersonalData({age, height, currentWeight});
    } catch (e: unknown) {
      console.error('Error fetching personal data for settings:', e);
      const errorMessage =
        e instanceof Error ? e.message : 'Failed to load personal data.';
      setError(errorMessage);
      Alert.alert(
        'Error',
        'Could not load your personal information. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]); // Depend on currentUser.id to refetch if it changes

  useEffect(() => {
    void fetchPersonalData(); // Use void here
    // fetchPersonalData().catch(e => {
    //   // Errors are handled within fetchPersonalData, this logs if the promise itself rejects unexpectedly.
    //   console.error("Error invoking fetchPersonalData from useEffect:", e);
    //   // Optionally set a generic error if not already handled by fetchPersonalData's specific alert.
    //   // if (!error) setError("Failed to load initial settings data.");
    // });
  }, [fetchPersonalData]);

  const handleSignOut = async () => {
    const {error: signOutError} = await signOut();
    if (signOutError) {
      console.error('Error signing out:', signOutError.message);
      Alert.alert('Logout Error', signOutError.message);
    } else {
      // Dispatch action to update auth state in Redux (e.g., clear session and user)
      dispatch(
        setAuthState({session: null, user: null, status: 'unauthenticated'}),
      );
      console.log('User signed out successfully');
      // This is a common pattern, but consider if a global auth listener makes more sense
      // for your app's architecture, especially for handling session restoration and
      // reacting to auth state changes.
      if (!session) {
        console.log('No session, navigating to Auth');
      }
    }
  };

  // --- Account & Personal Data Section (MVP) ---
  const accountSettings: SettingsSectionData = {
    title: 'Account & Personal Data',
    items: [
      {
        icon: 'person-circle-outline',
        label: 'Edit Personal Details', // Updated label for clarity
        onPress: () => navigation.navigate('EditProfile'),
      },
      {
        icon: 'trophy-outline',
        label: 'Adjust Goals',
        onPress: () => navigation.navigate('AdjustGoals'),
      },
      {
        icon: 'log-out-outline',
        label: 'Logout',
        onPress: () => {
          // Wrap async function
          const handlePress = async () => {
            try {
              await handleSignOut();
            } catch (e) {
              console.error('Error during sign out press:', e);
              Alert.alert(
                'Logout Failed',
                'An unexpected error occurred during logout.',
              );
            }
          };
          void handlePress(); // Call with void
        },
      },
    ],
  };

  // --- Financial & Referral Section ---
  // const financialSettings: SettingsSectionData = { // MVP: Removed
  // title: 'Financial & Referral',
  // items: [
  // {
  // icon: 'card-outline',
  // label: 'Subscription',
  // onPress: () => router.push('/settings/subscription'),
  // },
  // {
  // icon: 'gift-outline',
  // label: 'Referral Program',
  // onPress: () => router.push('/settings/referral'),
  // },
  // ],
  // };

  // --- Preferences & Customization Section ---
  // const preferencesSettings: SettingsSectionData = { // MVP: Removed
  // title: 'Preferences & Customization',
  // items: [
  // {
  // icon: 'color-palette-outline',
  // label: 'Theme',
  // value: 'System',
  // onPress: () => router.push('/settings/theme'),
  // },
  // {
  // icon: 'language-outline',
  // label: 'Language',
  // value: 'English',
  // onPress: () => router.push('/settings/language'),
  // },
  // {
  // icon: 'options-outline',
  // label: 'Units (Metric/Imperial)',
  // value: 'Metric',
  // onPress: () => router.push('/settings/units'),
  // },
  // {
  // icon: 'grid-outline',
  // label: 'Widget Management',
  // onPress: () => router.push('/settings/widgets'),
  // },
  // ],
  // };

  // --- Support Section (Keep as is or adjust as needed) ---
  // const supportSettings: SettingsSectionData = { // MVP: Removed
  // title: 'Support',
  // items: [
  // {
  // icon: 'help-circle-outline',
  // label: 'Help Center',
  // onPress: () => router.push('/settings/help'),
  // },
  // {
  // icon: 'mail-outline',
  // label: 'Contact Us',
  // onPress: () => router.push('/settings/contact'),
  // },
  // {
  // icon: 'document-text-outline',
  // label: 'Terms of Service',
  // onPress: () => router.push('/settings/terms'),
  // },
  // {
  // icon: 'shield-checkmark-outline',
  // label: 'Privacy Policy',
  // onPress: () => router.push('/settings/privacy-policy'),
  // },
  // {
  // icon: 'information-circle-outline',
  // label: 'App Version',
  // value: '1.0.0 (Build 1)',
  // isNavigable: false,
  // },
  // ],
  // };

  // Combine all sections
  const sections = [
    accountSettings,
    // financialSettings, // MVP: Removed
    // preferencesSettings, // MVP: Removed
    // supportSettings, // MVP: Removed
  ];

  return {
    sections,
    personalData,
    isLoading,
    error,
    refreshPersonalData: fetchPersonalData, // Expose a refresh function
  };
};
