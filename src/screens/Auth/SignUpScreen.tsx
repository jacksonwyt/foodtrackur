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
import {signUpWithEmail} from '../../services/auth/authService';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../types/navigation';
import theme from '../../constants/theme';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      dispatch(
        setAuthState({
          status: 'failed',
          user: null,
          session: null,
          error: 'Please fill in all fields.',
        }),
      );
      return;
    }
    if (password !== confirmPassword) {
      dispatch(
        setAuthState({
          status: 'failed',
          user: null,
          session: null,
          error: 'Passwords do not match.',
        }),
      );
      return;
    }

    dispatch(clearAuthError());
    dispatch(setAuthState({status: 'loading', user: null, session: null, error: null}));
    try {
      const {user, error} = await signUpWithEmail({email, password});

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
      } else if (user) {
        console.log('Sign up successful, user created. Email confirmation likely required.');
        dispatch(
          setAuthState({
            status: 'unauthenticated',
            user: null,
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
      dispatch(clearAuthError());
    }
  }, [email, password, confirmPassword, dispatch]);

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

        {authStatus === 'failed' && authError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={20} color={theme.colors.error} />
            <Text style={styles.errorText}>{authError}</Text>
          </View>
        )}
        {authStatus === 'unauthenticated' && authError && authError.includes('confirm your account') && (
           <View style={[styles.errorContainer, styles.successContainer]}> {/* Using error styles for now, can be specific success style */}
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
              authError && authError.toLowerCase().includes('email') && styles.inputError,
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
              authError && authError.toLowerCase().includes('password') && !authError.toLowerCase().includes('match') && styles.inputError,
            ]}
            placeholder="Choose a strong password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.textPlaceholder}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'confirmPassword' && styles.inputFocused,
              authError && authError.toLowerCase().includes('match') && styles.inputError,
            ]}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.textPlaceholder}
            onFocus={() => setFocusedInput('confirmPassword')}
            onBlur={() => setFocusedInput(null)}
          />
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
    backgroundColor: '#FFEEEE',
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
  successContainer: {
    backgroundColor: '#E6FFFA',
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
