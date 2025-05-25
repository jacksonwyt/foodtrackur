import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {WeightStackParamList} from '../../types/navigation';
import {useWeightHistoryData} from '../../hooks/useWeightHistoryData';
import {useWeightDerivedData} from '../../hooks/useWeightDerivedData';
import {WeightChartCard} from '../../components/weight/WeightChartCard';
import {WeightHistoryItem} from '../../components/weight/WeightHistoryItem';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme';

// Added prop type
type WeightScreenProps = NativeStackScreenProps<
  WeightStackParamList,
  'WeightMain'
>;

const WeightScreen: React.FC<WeightScreenProps> = ({navigation, route}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const {weightHistory} = useWeightHistoryData();

  const {chartData, weightTrend, currentWeight, history} =
    useWeightDerivedData(weightHistory);

  const navigateToLogWeight = () => {
    navigation.navigate('LogWeight');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Weight Progress</Text>

        <WeightChartCard
          chartData={chartData}
          weightTrend={weightTrend}
          currentWeight={currentWeight}
        />

        <Text style={styles.sectionTitle}>History</Text>
        <View style={styles.historyListContainer}>
          {history.length > 0 ? (
            history.map(entry => (
              <WeightHistoryItem key={entry.id.toString()} entry={entry} />
            ))
          ) : (
            <Text style={styles.emptyHistoryText}>
              No weight entries yet. Log your first weight!
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={navigateToLogWeight}>
          <Text style={styles.buttonText}>Log New Weight</Text>
          <Ionicons name="add-circle-outline" size={24} color={theme.colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.sizes.h1,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.lg,
      color: theme.colors.text,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.semibold,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      color: theme.colors.textSecondary,
    },
    historyListContainer: {
      marginBottom: theme.spacing.lg,
    },
    emptyHistoryText: {
      textAlign: 'center',
      fontSize: theme.typography.sizes.body,
      color: theme.colors.textPlaceholder,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    history: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    footer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.button.fontWeight,
    },
  });

export default WeightScreen;
