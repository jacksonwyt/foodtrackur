import React, {useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {CameraView as ExpoCameraView} from 'expo-camera';
import {useRoute, RouteProp} from '@react-navigation/native';
import {ScanStackParamList} from '../../types/navigation';
import {useCameraPermission} from '../../hooks/useCameraPermission';
import {useScanScreenActions} from '../../hooks/useScanScreenActions';
import CameraPermissionDenied from '../../components/scan/CameraPermissionDenied';
import CameraView from '../../components/scan/CameraView';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../../components/common/AppText';
import {Theme} from '../../constants/theme';

type ScanScreenRouteProp = RouteProp<ScanStackParamList, 'ScanMain'>;

const makeStyles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    color: theme.colors.text,
    fontSize: theme.typography.body1.fontSize,
  },
});

const ScanScreen: React.FC = () => {
  const route = useRoute<ScanScreenRouteProp>();
  const {dateToLog} = route.params;
  const theme = useTheme();
  const styles = makeStyles(theme);

  const permissionStatus = useCameraPermission();
  const [cameraRef, setCameraRef] = useState<ExpoCameraView | null>(null);
  const {handleCapture, handleClose} = useScanScreenActions(
    cameraRef,
    dateToLog,
  );

  if (permissionStatus === 'checking') {
    return (
      <View style={styles.loadingContainer}>
        <AppText style={styles.loadingText}>Requesting camera permission...</AppText>
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
        onCapture={() => {
          void handleCapture();
        }}
      />
    </View>
  );
};

export default ScanScreen;
