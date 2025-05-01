import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

interface CameraViewProps {
  setCameraRef: (ref: CameraView | null) => void;
  onClose: () => void;
  onCapture: () => void;
  isAnalyzing: boolean;
}

const CameraViewComponent: React.FC<CameraViewProps> = ({ setCameraRef, onClose, onCapture, isAnalyzing }) => {
  return (
    <CameraView
      style={styles.camera}
      ref={setCameraRef} // Use the passed setter function
      facing={'back'} // Changed 'type' prop to 'facing'
    >
      <View style={styles.overlay}>
        {/* Header with Close Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Guidelines Text */}
        <View style={styles.guidelines}>
          <Text style={styles.guideText}>
            Position food in the center of the frame
          </Text>
        </View>

        {/* Controls with Capture Button */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
            onPress={onCapture}
            disabled={isAnalyzing}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    </CameraView>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent overlay
    justifyContent: 'space-between', // Pushes header up, controls down
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40, // Adjust for status bar
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', // Darker background for visibility
    alignItems: 'center',
    justifyContent: 'center',
  },
  guidelines: {
    alignItems: 'center',
    paddingHorizontal: 20,
    // Positioned by space-between in overlay
  },
  guideText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Background for readability
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 50 : 40, // Ensure space from bottom
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)', // Outer ring
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff', // Inner circle
  },
  captureButtonDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(128,128,128,0.3)', // Greyed out outer ring
  },
});

export default CameraViewComponent; 