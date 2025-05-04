import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, CameraCapturedPicture } from 'expo-camera';
import { RootStackParamList } from '../types/navigation';

export const useScanScreenActions = (cameraRef: CameraView | null) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Scan'>>();

  const handleCapture = useCallback(async () => {
    if (cameraRef) {
      try {
        const photo: CameraCapturedPicture | undefined = await cameraRef.takePictureAsync({
            quality: 0.7,
            base64: true,
        });

        if (!photo?.uri) {
          throw new Error("Captured photo is missing URI.");
        }
        if (!photo.base64) {
            throw new Error("Captured photo is missing Base64 data.");
        }

        navigation.navigate('ScanConfirm', {
            imageUri: photo.uri,
            imageBase64: photo.base64
        });

      } catch (error) {
        console.error('Error during capture:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const displayError = `Capture failed: ${errorMessage}`;
        Alert.alert('Error', displayError);
      }
    }
  }, [cameraRef, navigation]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    handleCapture,
    handleClose,
  };
}; 