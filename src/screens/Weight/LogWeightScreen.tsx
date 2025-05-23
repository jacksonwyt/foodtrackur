import React, {useState} from 'react';
import {
  View,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {WeightStackParamList, AppStackParamList} from '../../types/navigation';
import {Screen} from '../../components/Screen';
import {useLogWeightForm} from '../../hooks/useLogWeightForm';
import {useWeightHistoryData} from '../../hooks/useWeightHistoryData';
import {AddWeightLogParams} from '../../types/weightLog';
import {
  WeightUnits,
  WeightUnit,
} from '../../services/weightLogService';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  formatISODateForStorage,
  formatReadableDate,
} from '../../utils/dateUtils';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../../components/common/AppText';
import {AppTextInput} from '../../components/common/AppTextInput';
import {Theme} from '../../constants/theme';

type LogWeightScreenProps = NativeStackScreenProps<
  WeightStackParamList,
  'LogWeight'
>;

const makeStyles = (theme: Theme) => ({
  screen: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center' as const,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  unitToggleContainer: {
    flexDirection: 'row' as const,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden' as const,
  },
  unitButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.surface,
  },
  unitButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  unitButtonText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  unitButtonTextSelected: {
    color: theme.colors.onPrimary,
  },
  dateDisplay: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 50,
    justifyContent: 'center' as const,
  },
  dateText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center' as const,
    marginTop: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.surfaceDisabled,
    ...theme.shadows.none,
  },
  saveButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  disabledButtonText: {
    color: theme.colors.onSurfaceDisabled,
  },
});

const LogWeightScreen: React.FC<LogWeightScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const {
    weight,
    setWeight,
    selectedUnit,
    setSelectedUnit,
    selectedDate,
    setSelectedDate,
    isFormValid,
    resetForm,
  } = useLogWeightForm();

  const {addWeightEntry} = useWeightHistoryData();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveWeight = async () => {
    if (!isFormValid()) {
      Alert.alert(
        'Invalid Input',
        'Please ensure all fields are correctly filled.',
      );
      return;
    }
    const numericWeight = parseFloat(weight);
    if (isNaN(numericWeight)) {
      Alert.alert('Invalid Weight', 'Please enter a valid number for weight.');
      return;
    }

    const logData: AddWeightLogParams = {
      weight: numericWeight,
      unit: selectedUnit,
      log_date: formatISODateForStorage(selectedDate),
    };

    const success = await addWeightEntry(logData);
    if (success) {
      Alert.alert('Success', 'Weight logged successfully!');
      resetForm();
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        const parentNav =
          navigation.getParent<NativeStackNavigationProp<AppStackParamList>>();
        if (parentNav) {
          parentNav.navigate('Main', {screen: 'ProgressTab'});
        } else {
          console.warn(
            'LogWeightScreen is not nested within AppStack, cannot navigate to MainTabs',
          );
        }
      }
    } else {
      Alert.alert('Error', 'Failed to log weight. Please try again.');
    }
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AppText style={styles.header}>Log Weight</AppText>

          <View style={styles.inputContainer}>
            <AppText style={styles.label}>Weight</AppText>
            <AppTextInput
              value={weight}
              onChangeText={setWeight}
              placeholder={`Enter weight in ${selectedUnit}`}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <AppText style={styles.label}>Unit</AppText>
            <View style={styles.unitToggleContainer}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  selectedUnit === WeightUnits.KG && styles.unitButtonSelected,
                ]}
                onPress={() => setSelectedUnit(WeightUnits.KG)}>
                <AppText
                  style={[
                    styles.unitButtonText,
                    selectedUnit === WeightUnits.KG &&
                      styles.unitButtonTextSelected,
                  ]}>
                  KG
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  selectedUnit === WeightUnits.LBS && styles.unitButtonSelected,
                ]}
                onPress={() => setSelectedUnit(WeightUnits.LBS)}>
                <AppText
                  style={[
                    styles.unitButtonText,
                    selectedUnit === WeightUnits.LBS &&
                      styles.unitButtonTextSelected,
                  ]}>
                  LBS
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <AppText style={styles.label}>Date</AppText>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateDisplay}>
              <AppText style={styles.dateText}>
                {formatReadableDate(selectedDate)}
              </AppText>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
              />
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              !isFormValid() && styles.saveButtonDisabled,
            ]}
            onPress={() => {
              void handleSaveWeight();
            }}
            disabled={!isFormValid()}>
            <AppText style={[
              styles.saveButtonText,
              !isFormValid() && styles.disabledButtonText
            ]}>Save Weight</AppText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default LogWeightScreen;
