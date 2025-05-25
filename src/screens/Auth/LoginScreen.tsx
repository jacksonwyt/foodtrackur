import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  // Button, // Will replace with TouchableOpacity
  StyleSheet,
  Alert,
  TouchableOpacity, // Added
  ActivityIndicator, // Added for loading state
  KeyboardAvoidingView, // Added
  Platform, // Added
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {
  selectAuthStatus,
  selectAuthError,
  setAuthState,
  clearAuthError,
} from '../../store/slices/authSlice';
import {signInWithEmail} from '../../services/auth/authService';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../types/navigation';
import theme from '../../constants/theme'; // Import theme
import {Ionicons} from '@expo/vector-icons'; // For potential icons
import {useSafeAreaInsets} from 'react-native-safe-area-context'; // For safe area

// interface LoginScreenProps {
//   navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
// }
// The props are directly destructured in the component definition, so this interface is not strictly needed if we type it there.
// However, for clarity and consistency with how SignUpScreen might be typed, let's keep it but ensure it matches the component signature.

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
}

export function LoginScreen({
  navigation,
}: LoginScreenProps): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null); // For input focus
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email || !password) {
      // Consider inline errors over Alerts for better UX
      dispatch(
        setAuthState({
          status: 'failed',
          user: null,
          session: null,
          error: 'Please enter both email and password.',
        }),
      );
      return;
    }

    dispatch(clearAuthError());
    dispatch(setAuthState({status: 'loading', user: null, session: null, error: null}));
    try {
      const {error} = await signInWithEmail({email, password});
      if (error) {
        console.error('Login Error:', error.message);
        dispatch(
          setAuthState({
            status: 'failed',
            user: null,
            session: null,
            error: error.message,
          }),
        );
      }
      // Successful login is handled by onAuthStateChange listener
    } catch (err: unknown) {
      console.error('Unexpected Login Error:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      dispatch(
        setAuthState({
          status: 'failed',
          user: null,
          session: null,
          error: errorMessage,
        }),
      );
    }
  };

  React.useEffect(() => {
    // Clear error when email or password changes, or component mounts
    if (authError) {
      dispatch(clearAuthError());
    }
  }, [email, password, dispatch, authError]);

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {paddingBottom: insets.bottom, paddingTop: insets.top}]}>
      <View style={styles.contentContainer}>
        {/* Consider adding an App Logo here */}
        {/* <LogoComponent width={150} height={150} style={styles.logo} /> */}
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        {authStatus === 'failed' && authError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={20} color={theme.colors.error} />
            <Text style={styles.errorText}>{authError}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'email' && styles.inputFocused,
              authError && (authError.toLowerCase().includes('email') || authError.toLowerCase().includes('user')) && styles.inputError,
            ]}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={theme.colors.textPlaceholder}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'password' && styles.inputFocused,
               authError && authError.toLowerCase().includes('password') && styles.inputError,
            ]}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.textPlaceholder}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
          />
          {/* Consider adding a "Forgot Password?" link here */}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => {
            void handleLogin();
          }}
          disabled={authStatus === 'loading'}>
          {authStatus === 'loading' ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <Text style={styles.primaryButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={navigateToSignUp}
          disabled={authStatus === 'loading'}>
          <Text style={styles.secondaryButtonText}>
            Don&apos;t have an account? <Text style={styles.signUpLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  // logo: {
  //   alignSelf: 'center',
  //   marginBottom: theme.spacing.xl,
  // },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.body,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? theme.spacing.md : theme.spacing.sm + 2, // Fine-tune padding
    height: 50, // Explicit height for inputs
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    // Consider adding a subtle shadow as in DetailsScreen if desired
    // ...theme.shadows.xs,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorBackground, // Placeholder for theme.colors.errorBackground
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  errorText: {
    flex: 1, // Allow text to wrap
    color: theme.colors.error,
    fontSize: theme.typography.sizes.caption, // Was bodySmall
    fontFamily: theme.typography.fontFamily,
  },
  button: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50, // Ensure buttons have a good tap target size
    marginBottom: theme.spacing.md, // Spacing between buttons
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.sm, // Add subtle shadow
  },
  primaryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.sizes.bodyLarge, // Was button
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  secondaryButton: {
    // No background for a link-style button
    // backgroundColor: theme.colors.surface,
    // borderWidth: 1,
    // borderColor: theme.colors.border,
  },
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  signUpLink: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
  },
});

// Note: Navigation logic (navigateToSignUp) is basic.
// You'll need to integrate this with your navigation setup (e.g., React Navigation).
// The navigation call itself (navigation.navigate('SignUp')) is correct for react-navigation.
