import {useState, useEffect} from 'react';
import {Alert, Platform} from 'react-native';
import {
  useCameraPermissions,
  PermissionStatus as ExpoPermissionStatus,
} from 'expo-camera';

export type PermissionStatus = 'checking' | 'granted' | 'denied';

export const useCameraPermission = (): PermissionStatus => {
  const [expoPermission, requestPermission] = useCameraPermissions();
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('checking');

  useEffect(() => {
    if (!expoPermission) {
      // Permissions are still loading
      setPermissionStatus('checking');
      return;
    }

    if (expoPermission.status === ExpoPermissionStatus.UNDETERMINED) {
      // Need to request permissions
      requestPermission().catch(error => {
        console.error('Failed to request camera permission:', error);
        setPermissionStatus('denied'); // Assume denied if request fails
      }); // Request permission if undetermined
      setPermissionStatus('checking'); // Stay in checking state until user responds
    } else if (expoPermission.status === ExpoPermissionStatus.GRANTED) {
      setPermissionStatus('granted');
    } else {
      // Denied or other status
      setPermissionStatus('denied');
      // Optional: Show alert only once or based on canAskAgain
      if (expoPermission.canAskAgain === false) {
        Alert.alert(
          'Camera Permission Required',
          'We need camera access to scan your food. Please enable it in your device settings.',
          [{text: 'OK'}],
        );
      }
    }
  }, [expoPermission, requestPermission]);

  // Initial request if status is null (first run)
  useEffect(() => {
    if (expoPermission === null) {
      requestPermission().catch(error => {
        console.error('Failed to request camera permission (initial):', error);
        // No need to set status here as the other useEffect will handle it based on expoPermission update
      });
    }
  }, [expoPermission, requestPermission]);

  return permissionStatus;
};
