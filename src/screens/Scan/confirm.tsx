import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  ImageResizeMode,
  FlexAlignType,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScanStackParamList, AppStackParamList} from '../../types/navigation';
import {
  analyzeFoodImageWithGemini,
  FoodLogItemData,
} from '../../services/ai/geminiService';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../../components/common/AppText';
import {Theme} from '../../constants/theme';

// Define the route prop type for this screen
type ScanConfirmScreenRouteProp = RouteProp<ScanStackParamList, 'ScanConfirm'>;

const makeStyles = (theme: Theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.md,
    textAlign: 'center' as const,
    color: theme.colors.text,
  },
  imagePreview: {
    width: '90%' as const,
    aspectRatio: 1,
    resizeMode: 'contain' as const,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  centeredStatusContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: theme.spacing.lg,
  },
  statusText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
  },
  errorTextTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.error,
    marginBottom: theme.spacing.sm,
    textAlign: 'center' as const,
  },
  errorText: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.error,
    textAlign: 'center' as const,
    lineHeight: theme.typography.sizes.bodySmall * theme.typography.lineHeights.normal,
  },
  resultsContainer: {
    width: '100%' as const,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  resultTitle: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  foodName: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  servingInfo: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  macrosTable: {
    marginBottom: theme.spacing.md,
  },
  macroRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  macroLabel: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.text,
  },
  macroValue: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.semibold,
  },
  aiDisclaimerText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  confirmInstruction: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: theme.spacing.sm,
  },
  buttonContainer: {
    width: '100%' as const,
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  logButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center' as const,
  },
  logButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  retryButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center' as const,
  },
  retryButtonText: {
    color: theme.colors.onError,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
});

const ScanConfirmScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<ScanConfirmScreenRouteProp>();
  const {imageUri, imageBase64, dateToLog} = route.params;

  const theme = useTheme();
  const styles = makeStyles(theme);

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FoodLogItemData | null>(
    null,
  );
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Perform analysis when the screen mounts
  useEffect(() => {
    const performAnalysis = async () => {
      if (!imageUri && !imageBase64) {
        Alert.alert('Error', 'No image data found to analyze.');
        navigation.goBack();
        return;
      }
      setIsLoading(true);
      setAnalysisResult(null);
      setAnalysisError(null);

      try {
        const imageDataForService = {
          uri: imageUri,
          base64: imageBase64,
          type: 'image/jpeg',
        };
        const result = await analyzeFoodImageWithGemini(imageDataForService);

        if (result) {
          setAnalysisResult(result);
        } else {
          setAnalysisError(
            "Could not analyze the image. The AI couldn't identify a food item or returned an unexpected result. Please try a clearer picture or a different angle.",
          );
        }
      } catch (error) {
        console.error('Error calling analyzeFoodImageWithGemini:', error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unknown error occurred during analysis.';
        setAnalysisError(`Analysis failed: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    void performAnalysis();
  }, [imageUri, imageBase64, navigation]);

  const handleConfirmLog = () => {
    if (analysisResult) {
      navigation.replace('FoodDBNav', {
        screen: 'LogEntry',
        params: {foodItem: analysisResult, dateToLog: dateToLog},
      });
    } else {
      Alert.alert('Error', 'No analysis result to log.');
    }
  };

  const handleRetry = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('ScanNav', {screen: 'ScanMain', params: {dateToLog}});
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <AppText style={styles.title}>Confirm Scanned Food</AppText>

        {imageUri && (
          <Image source={{uri: imageUri}} style={styles.imagePreview} />
        )}

        {isLoading && (
          <View style={styles.centeredStatusContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <AppText style={styles.statusText}>Analyzing your food...</AppText>
          </View>
        )}

        {analysisError && !isLoading && (
          <View style={styles.centeredStatusContainer}>
            <AppText style={styles.errorTextTitle}>Analysis Failed</AppText>
            <AppText style={styles.errorText}>{analysisError}</AppText>
          </View>
        )}

        {analysisResult && !isLoading && (
          <View style={styles.resultsContainer}>
            <AppText style={styles.resultTitle}>Identified Food:</AppText>
            <AppText style={styles.foodName}>{analysisResult.food_name}</AppText>
            <AppText style={styles.servingInfo}>
              Serving: {analysisResult.serving_unit}
            </AppText>
            <View style={styles.macrosTable}>
              <View style={styles.macroRow}>
                <AppText style={styles.macroLabel}>Calories:</AppText>
                <AppText style={styles.macroValue}>
                  {analysisResult.calories.toFixed(0)} kcal
                </AppText>
              </View>
              <View style={styles.macroRow}>
                <AppText style={styles.macroLabel}>Protein:</AppText>
                <AppText style={styles.macroValue}>
                  {analysisResult.protein.toFixed(1)} g
                </AppText>
              </View>
              <View style={styles.macroRow}>
                <AppText style={styles.macroLabel}>Carbs:</AppText>
                <AppText style={styles.macroValue}>
                  {analysisResult.carbs.toFixed(1)} g
                </AppText>
              </View>
              <View style={styles.macroRow}>
                <AppText style={styles.macroLabel}>Fat:</AppText>
                <AppText style={styles.macroValue}>
                  {analysisResult.fat.toFixed(1)} g
                </AppText>
              </View>
            </View>
            <AppText style={styles.aiDisclaimerText}>
              Note: These values are AI-powered estimations. Actual nutritional content may vary.
            </AppText>
            <AppText style={styles.confirmInstruction}>
              If this looks correct, confirm to log this item.
            </AppText>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {analysisResult && !isLoading && (
            <TouchableOpacity
              style={styles.logButton}
              onPress={handleConfirmLog}>
              <AppText style={styles.logButtonText}>Confirm & Log</AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            disabled={isLoading}>
            <AppText style={styles.retryButtonText}>Retake Photo</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScanConfirmScreen;
