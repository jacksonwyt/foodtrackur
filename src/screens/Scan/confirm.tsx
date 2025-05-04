import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { supabase } from '../../services/supabaseClient';

// Define the route prop type for this screen
type ScanConfirmScreenRouteProp = RouteProp<RootStackParamList, 'ScanConfirm'>;

const ScanConfirmScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScanConfirmScreenRouteProp>();
  const { imageUri, imageBase64 } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (isLoading) return;
    setIsLoading(true);

    // Determine mimeType (assuming jpeg for now, could be improved)
    const mimeType = 'image/jpeg';

    try {
        const { data, error } = await supabase.functions.invoke('analyze-food-image', {
            body: { imageData: { mimeType, data: imageBase64 } },
        });

        if (error) {
            throw new Error(`Supabase function error: ${error.message}`);
        }

        if (data?.error) {
            // Handle errors returned by the function itself
            throw new Error(`Analysis error: ${data.error}`);
        }

        if (!data?.analysis) {
            throw new Error('Invalid response structure from analysis function.');
        }

        // Navigate to results screen on success
        navigation.replace('ScanResults', { analysis: data.analysis }); // Use replace to prevent going back here

    } catch (error) {
        console.error('Error calling analyze-food-image function:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during analysis.';
        Alert.alert('Analysis Failed', errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  const handleRetry = () => {
    // Go back to the Scan screen (index)
    if (navigation.canGoBack()) {
        navigation.goBack();
    } else {
        // Fallback if somehow confirm is the first screen
        navigation.navigate('Scan');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Confirm Photo</Text>

        {/* Display the captured image */}
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        <Text style={styles.instructions}>
          Looks good? Confirm to analyze the food items.
        </Text>

        <View style={styles.buttonContainer}>
          <Button title="Confirm & Analyze" onPress={handleConfirm} disabled={isLoading} />
          <View style={styles.spacer} />
          <Button title="Retake Photo" onPress={handleRetry} color="#ff6347" disabled={isLoading} />
        </View>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Analyzing...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 3 / 4,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 'auto',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  spacer: {
    height: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 16,
  },
});

export default ScanConfirmScreen; 