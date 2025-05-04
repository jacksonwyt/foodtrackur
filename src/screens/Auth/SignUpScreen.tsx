import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { selectAuthStatus, selectAuthError } from '../../store/slices/authSlice';
import { setAuthStatus, clearAuthError } from '../../store/slices/authSlice';
import { signUpWithEmail } from '../../services/auth/authService';

// TODO: Replace with navigation prop type if using react-navigation
interface SignUpScreenProps {
  navigation?: any; // Basic navigation prop for now
}

export function SignUpScreen({ navigation }: SignUpScreenProps): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    dispatch(clearAuthError());
    dispatch(setAuthStatus('loading'));
    try {
      const { error } = await signUpWithEmail({ email, password });
      if (error) {
        console.error('Sign Up Error:', error.message);
        // Rely on listener for state change, but dispatch error for immediate feedback
        dispatch(setAuthStatus({ status: 'failed', error: error.message }));
      } 
      // On success, the onAuthStateChange listener handles setting the 'authenticated' state
      // and triggering profile creation if needed, leading to navigation change in App.tsx.
    } catch (err: any) {
      console.error('Unexpected Sign Up Error:', err);
      dispatch(setAuthStatus({ status: 'failed', error: err.message || 'An unexpected error occurred.' }));
    }
  };

  // Clear error when component mounts or inputs change
  React.useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Navigate to Login (placeholder)
  const navigateToLogin = () => {
    if (navigation && navigation.navigate) {
       navigation.navigate('Login'); // Assuming 'Login' is the route name
    } else {
       console.warn('Navigation prop not available or navigate function missing.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {authStatus === 'failed' && authError && (
        <Text style={styles.errorText}>{authError}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button
        title={authStatus === 'loading' ? 'Signing Up...' : 'Sign Up'}
        onPress={handleSignUp}
        disabled={authStatus === 'loading'}
      />
      <Button
        title="Already have an account? Login"
        onPress={navigateToLogin} // Placeholder for navigation
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
      color: 'red',
      marginBottom: 12,
      textAlign: 'center',
  }
}); 