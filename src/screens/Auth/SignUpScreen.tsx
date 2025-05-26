import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../store/store';
import {
  selectAuthStatus,
  selectAuthError,
  setAuthState,
  clearAuthError,
} from '../../store/slices/authSlice';
import {createUserProfile} from '../../store/slices/profileSlice';
import {signUpWithEmail} from '../../services/auth/authService';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../types/navigation';
import theme from '../../constants/theme';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AuthFooterLinks} from '../../components/auth/AuthFooterLinks';

interface SignUpScreenProps {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
}

export function SignUpScreen({
  navigation,
}: SignUpScreenProps): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const insets = useSafeAreaInsets();

  // Specific error states for inline messages
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const clearInlineErrors = () => {
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  };

  const handleSignUp = async () => {
    clearInlineErrors(); // Clear previous inline errors
    dispatch(clearAuthError()); // Clear general auth error from Redux

    let isValid = true;
    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) { // Example: Basic password length check
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      isValid = false;
    } else if (password && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    if (!isValid) {
       // Set a general error for the top-level display if needed, or rely on inline
      dispatch(
        setAuthState({
          status: 'failed',
          user: null,
          session: null,
          error: 'Please correct the errors below.', // General message
        }),
      );
      return;
    }

    dispatch(setAuthState({status: 'loading', user: null, session: null, error: null}));
    try {
      const {user, session, error} = await signUpWithEmail({email, password});

      if (error) {
        console.error('Sign Up Error:', error.message);
        dispatch(
          setAuthState({
            status: 'failed',
            user: null,
            session: null,
            error: error.message,
          }),
        );
      } else if (user && session) {
        console.log('Sign up successful, user created and session initiated.');
        dispatch(
          setAuthState({
            status: 'authenticated',
            user: user,
            session: session,
            error: null,
          }),
        );
        console.log('[SignUpScreen] User authenticated. Trigger will handle initial profile creation.');
      } else if (user && !session) {
        console.warn('Sign up successful, user created but no session returned (email verification likely pending).');
        dispatch(
          setAuthState({
            status: 'unauthenticated',
            user: user,
            session: null,
            error: 'Sign up successful! Please check your email to confirm your account and then login.',
          }),
        );
      } else {
        console.warn('Sign up call completed without error, but no user object returned.');
        dispatch(
          setAuthState({
            status: 'failed',
            user: null,
            session: null,
            error: 'Sign up process did not complete as expected. Please try again.',
          }),
        );
      }
    } catch (err: unknown) {
      console.error('Unexpected Sign Up Error:', err);
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
    if (authError) {
      // If a general authError from Redux (e.g., server error, email taken), display it.
      // Specific field validation errors are now handled by local state.
      // This logic might need refinement based on how Redux errors should interact with local form validation.
      // For now, let's assume Redux authError is for server-side messages.
    }
    // Clear inline errors when inputs change
    clearInlineErrors();
  }, [email, password, confirmPassword]);

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {paddingBottom: insets.bottom, paddingTop: insets.top}]}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us and start tracking your nutrition!</Text>

        {/* General error message display (optional, if inline errors are primary) */}
        {authStatus === 'failed' && authError && !emailError && !passwordError && !confirmPasswordError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={20} color={theme.colors.error} />
            <Text style={styles.errorText}>{authError}</Text>
          </View>
        )}
        {authStatus === 'unauthenticated' && authError && authError.includes('confirm your account') && (
           <View style={[styles.errorContainer, styles.successContainer]}>
            <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.success} />
            <Text style={[styles.errorText, styles.successText]}>{authError}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'email' && styles.inputFocused,
              emailError && styles.inputError, // Use local emailError
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
          {emailError && <Text style={styles.inlineErrorText}>{emailError}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'password' && styles.inputFocused,
              passwordError && styles.inputError, // Use local passwordError
            ]}
            placeholder="At least 6 characters" // Hint for password requirement
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.textPlaceholder}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
          />
          {passwordError && <Text style={styles.inlineErrorText}>{passwordError}</Text>}
          {!passwordError && <Text style={styles.passwordHintText}>Password must be at least 6 characters.</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'confirmPassword' && styles.inputFocused,
              confirmPasswordError && styles.inputError, // Use local confirmPasswordError
            ]}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.textPlaceholder}
            onFocus={() => setFocusedInput('confirmPassword')}
            onBlur={() => setFocusedInput(null)}
          />
          {confirmPasswordError && (<Text style={styles.inlineErrorText}>{confirmPasswordError}</Text>)}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => {
            void handleSignUp();
          }}
          disabled={authStatus === 'loading'}>
          {authStatus === 'loading' ? (
            <ActivityIndicator color={theme.colors.onPrimary} />
          ) : (
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={navigateToLogin}
          disabled={authStatus === 'loading'}>
          <Text style={styles.secondaryButtonText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
        <AuthFooterLinks />
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
    paddingVertical: Platform.OS === 'ios' ? theme.spacing.md : theme.spacing.sm + 2,
    height: 50,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorBackground,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  errorText: {
    flex: 1,
    color: theme.colors.error,
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fontFamily,
  },
  inlineErrorText: { // Added style for inline errors
    color: theme.colors.error,
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fontFamily,
    marginTop: theme.spacing.xxs,
    marginLeft: theme.spacing.xs, // Optional: indent slightly
  },
  passwordHintText: { // Added style for password hint
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fontFamily,
    marginTop: theme.spacing.xxs,
    marginLeft: theme.spacing.xs, // Optional: indent slightly
  },
  successContainer: {
    backgroundColor: theme.colors.successBackground,
  },
  successText: {
    color: theme.colors.success,
  },
  button: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginBottom: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  primaryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  secondaryButton: {},
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
  },
});
