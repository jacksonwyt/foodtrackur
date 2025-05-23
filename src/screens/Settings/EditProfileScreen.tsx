import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text as RNText, // For custom gender/unit buttons
  ViewStyle,
  TextStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  getProfile,
  updateProfile,
  Profile,
  UpdateProfileData,
} from '../../services/profileService';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../../store/slices/authSlice';
// import { calculateNutritionalGoals, OnboardingDataForCalc } from '../../utils/calculations'; // For recalculating goals - commented out as per original logic
import {useNavigation} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SettingsStackParamList} from '../../types/navigation';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme'; // Import Theme
import {AppText} from '../../components/common/AppText'; // Named import
import {AppTextInput} from '../../components/common/AppTextInput'; // Named import
import {AppButton} from '../../components/common/AppButton'; // Named import

type HeightUnit = 'cm' | 'ft_in';
type GenderOption = 'male' | 'female' | 'other';

// Helper to convert YYYY-MM-DD to Age (approximate)
const calculateAgeFromDob = (dob: string): string => {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? age.toString() : '';
};

// Helper to convert Age to YYYY-MM-DD (assuming 01-01 for month/day)
const convertAgeToDob = (age: string): string => {
  if (!age) return '';
  const ageNum = parseInt(age, 10);
  if (isNaN(ageNum) || ageNum <= 0) return '';
  const currentYear = new Date().getFullYear();
  return `${currentYear - ageNum}-01-01`;
};

// Added prop type
type EditProfileScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  'EditProfile'
>;

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme); // Initialize styles here

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useSelector(selectCurrentUser);

  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [ageValue, setAgeValue] = useState(''); // Renamed from age to avoid conflict
  const [gender, setGender] = useState<GenderOption | undefined>(undefined);

  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);

  const toggleHeightUnit = () => {
    setHeightUnit(prev => (prev === 'cm' ? 'ft_in' : 'cm'));
  };

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!currentUser || !currentUser.id) {
        throw new Error('User not authenticated.');
      }

      const profileData = await getProfile();
      if (profileData) {
        setOriginalProfile(profileData);
        if (profileData.height_cm) {
          if (heightUnit === 'cm') {
            setHeight(profileData.height_cm.toString());
          } else {
            const totalInches = profileData.height_cm / 2.54;
            setFeet(Math.floor(totalInches / 12).toString());
            setInches(Math.round(totalInches % 12).toString());
          }
        }
        if (profileData.dob) {
          setAgeValue(calculateAgeFromDob(profileData.dob));
        }
        setGender(profileData.gender as GenderOption | undefined);
      } else {
        setError('Could not load profile data.');
      }
    } catch (e) {
      // Typed catch
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Failed to fetch profile.');
      }
      console.error(
        'Fetch profile error:',
        e instanceof Error ? e.stack || e.message : String(e),
      );
    } finally {
      setIsLoading(false);
    }
  }, [heightUnit, currentUser]);

  useEffect(() => {
    void fetchProfileData();
  }, [fetchProfileData]);

  const handleSave = async () => {
    if (!currentUser || !currentUser.id || !originalProfile) {
      Alert.alert('Error', 'User data is not available. Cannot save.');
      return;
    }

    // Basic Validation
    let heightCm: number | undefined;
    if (heightUnit === 'cm') {
      if (!height || isNaN(parseFloat(height)) || parseFloat(height) <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid height in cm.');
        return;
      }
      heightCm = parseFloat(height);
    } else {
      const ft = parseFloat(feet);
      const ins = parseFloat(inches);
      if (
        ((isNaN(ft) || ft < 0) && (isNaN(ins) || ins < 0)) ||
        (ft === 0 && ins === 0)
      ) {
        Alert.alert(
          'Validation Error',
          'Please enter a valid height in feet and/or inches.',
        );
        return;
      }
      heightCm = (ft || 0) * 30.48 + (ins || 0) * 2.54;
      if (heightCm <= 0) {
        Alert.alert('Validation Error', 'Calculated height must be positive.');
        return;
      }
    }

    if (!ageValue || isNaN(parseInt(ageValue)) || parseInt(ageValue) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid age.');
      return;
    }
    const dob = convertAgeToDob(ageValue);
    if (!dob) {
      Alert.alert(
        'Validation Error',
        'Could not convert age to Date of Birth.',
      );
      return;
    }

    if (!gender) {
      Alert.alert('Validation Error', 'Please select a gender.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updates: UpdateProfileData = {
        height_cm: heightCm,
        dob: dob,
        gender: gender,
      };

      const profileDetailsChanged =
        originalProfile.height_cm !== heightCm ||
        originalProfile.dob !== dob ||
        originalProfile.gender !== gender;

      await updateProfile(currentUser.id, updates);

      if (profileDetailsChanged) {
        Alert.alert(
          'Success',
          "Profile details updated. Please review your nutritional goals in 'Adjust Goals' as they may need to be updated based on these changes.",
        );
      } else {
        Alert.alert('Success', 'Profile details updated successfully!');
      }
      navigation.goBack();
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'An unknown error occurred while saving profile.';
      setError(message);
      Alert.alert('Error Saving Profile', message);
      console.error(
        'Save profile error:',
        e instanceof Error ? e.stack || e.message : String(e),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <AppText style={styles.loadingText}>Loading profile...</AppText>
      </SafeAreaView>
    );
  }

  if (error && !originalProfile) {
    // Show error prominently if profile load failed
    return (
      <SafeAreaView style={styles.centered}>
        <AppText style={styles.errorText}>Error: {error}</AppText>
        <AppButton
          title="Retry"
          onPress={() => {
            void fetchProfileData();
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjusted offset
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <AppText style={styles.title}>Edit Personal Details</AppText>

          {error && !isSaving && (
            <AppText style={styles.errorText}>Error: {error}</AppText>
          )}

          <View style={styles.inputRow}>
            {heightUnit === 'cm' ? (
              <AppTextInput
                label="Height (cm)"
                value={height}
                onChangeText={setHeight}
                placeholder="e.g., 175"
                keyboardType="numeric"
                returnKeyType="done"
                containerStyle={styles.inputRowItem}
              />
            ) : (
              <>
                <AppTextInput
                  label="Height (ft)"
                  value={feet}
                  onChangeText={setFeet}
                  placeholder="e.g., 5"
                  keyboardType="numeric"
                  returnKeyType="done"
                  containerStyle={styles.inputRowItem}
                />
                <AppTextInput
                  label="(in)"
                  value={inches}
                  onChangeText={setInches}
                  placeholder="e.g., 9"
                  keyboardType="numeric"
                  returnKeyType="done"
                  containerStyle={styles.inputRowItem}
                />
              </>
            )}
            <TouchableOpacity
              onPress={toggleHeightUnit}
              style={styles.unitToggleButton}>
              <RNText style={styles.unitToggleText}>
                {heightUnit === 'cm' ? 'ft/in' : 'cm'}
              </RNText>
            </TouchableOpacity>
          </View>

          <AppTextInput
            label="Age"
            value={ageValue}
            onChangeText={setAgeValue}
            placeholder="e.g., 30"
            keyboardType="number-pad"
            returnKeyType="done"
            containerStyle={styles.inputGroup}
          />

          <AppText style={styles.label}>Gender</AppText>
          <View style={styles.genderSelectionContainer}>
            {(['male', 'female', 'other'] as GenderOption[]).map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.genderButton,
                  gender === option && styles.genderButtonSelected,
                ]}
                onPress={() => setGender(option)}>
                <RNText
                  style={[
                    styles.genderButtonText,
                    gender === option && styles.genderButtonTextSelected,
                  ]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </RNText>
              </TouchableOpacity>
            ))}
          </View>

          <AppButton
            title={isSaving ? 'Saving...' : 'Save Profile'}
            onPress={() => {
              void handleSave();
            }}
            disabled={isSaving || isLoading}
            isLoading={isSaving}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

interface EditProfileStyles {
  screen: ViewStyle;
  centered: ViewStyle;
  loadingText: TextStyle;
  errorText: TextStyle;
  container: ViewStyle;
  title: TextStyle;
  inputRow: ViewStyle;
  inputRowItem: ViewStyle; // for AppTextInput containerStyle
  unitToggleButton: ViewStyle;
  unitToggleText: TextStyle;
  genderSelectionContainer: ViewStyle;
  genderButton: ViewStyle;
  genderButtonSelected: ViewStyle;
  genderButtonText: TextStyle;
  genderButtonTextSelected: TextStyle;
  inputGroup: ViewStyle; // for AppTextInput containerStyle
  label: TextStyle; // Added for section labels
  // Add any other styles used in the component
}

const getStyles = (theme: Theme): EditProfileStyles =>
  StyleSheet.create<EditProfileStyles>({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    loadingText: {
      marginTop: theme.spacing.md,
      fontSize: theme.typography.sizes.body,
      color: theme.colors.textPlaceholder,
      fontFamily: theme.typography.fontFamily,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.typography.sizes.body,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    container: {
      padding: theme.spacing.lg,
      flexGrow: 1,
    },
    title: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center', // Align items to center for AppTextInput and Button
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.sm, // Add gap between items in the row
    },
    inputRowItem: {
      flex: 1, // Allow input items to grow
    },
    unitToggleButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm, // Ensure this aligns with AppTextInput height
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center', // Center text vertically
      alignItems: 'center', // Center text horizontally
      height: 48, // Match typical input height, adjust as needed
    },
    unitToggleText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.medium,
      fontFamily: theme.typography.fontFamily,
    },
    genderSelectionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Or space-around
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    genderButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    genderButtonSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    genderButtonText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weights.medium,
      fontFamily: theme.typography.fontFamily,
    },
    genderButtonTextSelected: {
      color: theme.colors.onPrimary,
      fontWeight: theme.typography.weights.semibold,
    },
    inputGroup: {
      // Added for age input
      marginBottom: theme.spacing.lg,
    },
    label: {
      // Definition for label style
      fontSize: theme.typography.sizes.bodyLarge,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      fontFamily: theme.typography.fontFamily,
    },
  });

export default EditProfileScreen;
