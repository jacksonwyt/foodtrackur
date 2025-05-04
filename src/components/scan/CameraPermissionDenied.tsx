import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CameraPermissionDeniedProps {
  onGoBack: () => void;
}

const CameraPermissionDenied: React.FC<CameraPermissionDeniedProps> = ({ onGoBack }) => {
  return (
    <View style={styles.permissionDenied}>
      <Ionicons name="camera-reverse-outline" size={64} color="#FF3B30" />
      <Text style={styles.permissionTitle}>Camera Access Denied</Text>
      <Text style={styles.permissionText}>
        We need camera access to scan your food. Please enable it in your device settings.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onGoBack}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  permissionDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff', // Assuming a white background for the denied message area
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraPermissionDenied; 