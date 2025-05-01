import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, CameraCapturedPicture } from 'expo-camera';
import { analyzeFoodImage } from '../services/ai/geminiService';
import { RootStackParamList } from '../types/navigation';

export const useScanScreenActions = (cameraRef: CameraView | null) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleCapture = useCallback(async () => {
    if (cameraRef && !isAnalyzing) {
      setIsAnalyzing(true);
      setAnalysisResult(null);
      setAnalysisError(null);
      try {
        const photo: CameraCapturedPicture = await cameraRef.takePictureAsync({ quality: 0.7 });

        const result = await analyzeFoodImage(photo);

        if (result.startsWith('Error:')) {
          setAnalysisError(result);
        } else {
          setAnalysisResult(result);
          console.log("Analysis Result:", result);
        }

      } catch (error) {
        console.error('Error during capture or analysis:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setAnalysisError(`Capture/Analysis failed: ${errorMessage}`);
        Alert.alert('Error', 'Could not capture or analyze image. Please try again.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  }, [cameraRef, isAnalyzing]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setAnalysisError(null);
  }, []);

  return {
    handleCapture,
    handleClose,
    isAnalyzing,
    analysisResult,
    analysisError,
    clearAnalysis,
  };
}; 