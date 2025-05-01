import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { CameraView as ExpoCameraView } from 'expo-camera';
import { useCameraPermission } from '../../hooks/useCameraPermission';
import { useScanScreenActions } from '../../hooks/useScanScreenActions';
import CameraPermissionDenied from '../../components/scan/CameraPermissionDenied';
import CameraView from '../../components/scan/CameraView';

const ScanScreen: React.FC = () => {
  const permissionStatus = useCameraPermission();
  const [cameraRef, setCameraRef] = useState<ExpoCameraView | null>(null);
  const {
    handleCapture,
    handleClose,
    isAnalyzing,
    analysisResult,
    analysisError,
    clearAnalysis,
  } = useScanScreenActions(cameraRef);

  if (permissionStatus === 'checking') {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <View style={styles.container}>
        <CameraPermissionDenied onGoBack={handleClose} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        setCameraRef={setCameraRef}
        onClose={handleClose}
        onCapture={handleCapture}
        isAnalyzing={isAnalyzing}
      />

      {(isAnalyzing || analysisResult || analysisError) && (
        <View style={styles.overlayContainer}>
          {isAnalyzing && (
            <View style={styles.analysisBox}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.overlayText}>Analyzing...</Text>
            </View>
          )}
          {analysisResult && (
            <View style={styles.analysisBox}>
              <Text style={styles.overlayTitle}>Analysis Result:</Text>
              <ScrollView style={styles.resultScrollView}>
                 <Text style={styles.overlayText}>{analysisResult}</Text>
              </ScrollView>
              <TouchableOpacity style={styles.dismissButton} onPress={clearAnalysis}>
                <Text style={styles.dismissButtonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}
          {analysisError && (
            <View style={styles.analysisBox}>
              <Text style={styles.overlayTitle}>Analysis Error:</Text>
               <ScrollView style={styles.resultScrollView}>
                  <Text style={[styles.overlayText, styles.errorText]}>{analysisError}</Text>
              </ScrollView>
              <TouchableOpacity style={styles.dismissButton} onPress={clearAnalysis}>
                <Text style={styles.dismissButtonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  analysisBox: {
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    maxHeight: '70%',
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
   resultScrollView: {
    maxHeight: 200,
    marginBottom: 20,
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  errorText: {
    color: '#ffdddd',
  },
  dismissButton: {
    marginTop: 10,
    backgroundColor: '#555',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  dismissButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ScanScreen; 