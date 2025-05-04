import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { selectAuthStatus, selectAuthError } from '../../store/slices/authSlice';
import { setAuthStatus, clearAuthError } from '../../store/slices/authSlice';
import { signInWithEmail } from '../../services/auth/authService';

// TODO: Replace with navigation prop type if using react-navigation
interface LoginScreenProps {
  navigation?: any; // Basic navigation prop for now
}

export function LoginScreen({ navigation }: LoginScreenProps): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    dispatch(clearAuthError());
    dispatch(setAuthStatus('loading'));
    try {
      const { error } = await signInWithEmail({ email, password });
      if (error) {
        console.error('Login Error:', error.message);
        // The onAuthStateChange listener in index.js will handle setting the state
        // based on Supabase events, but we might want to set 'failed' here too
        // depending on desired UX for immediate feedback.
        // For now, rely on the listener. Let's dispatch the error though.
        dispatch(setAuthStatus({ status: 'failed', error: error.message }));

      }
      // On success, the onAuthStateChange listener in index.js will dispatch
      // setAuthState({ status: 'authenticated', user: session.user })
      // which will trigger the navigation change in App.tsx
    } catch (err: any) {
      // Catch any unexpected errors during the sign-in process itself
      console.error('Unexpected Login Error:', err);
      dispatch(setAuthStatus({ status: 'failed', error: err.message || 'An unexpected error occurred.' }));
    }
  };

  // Clear error when component mounts or inputs change
  React.useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);


  // Navigate to Sign Up (placeholder)
  const navigateToSignUp = () => {
     if (navigation && navigation.navigate) {
        navigation.navigate('SignUp'); // Assuming 'SignUp' is the route name
     } else {
        console.warn('Navigation prop not available or navigate function missing.');
     }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      <Button
        title={authStatus === 'loading' ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={authStatus === 'loading'}
      />
       <Button
         title="Don't have an account? Sign Up"
         onPress={navigateToSignUp} // Placeholder for navigation
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

// Note: Navigation logic (navigateToSignUp) is basic.
// You'll need to integrate this with your navigation setup (e.g., React Navigation). 