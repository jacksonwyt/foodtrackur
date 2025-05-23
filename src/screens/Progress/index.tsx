import React from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProgressStackParamList } from '../../types/navigation';
import { Screen } from '../../components/Screen';
import { useProgressChartData } from '../../hooks/useProgressChartData';
import WeightProgressChart from '../../components/progress/WeightProgressChart';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from '../../components/common/AppText';
import type { Theme } from '../../constants/theme';

// Define prop types for the screen
type ProgressScreenProps = NativeStackScreenProps<
  ProgressStackParamList,
  'Progress'
>;

const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const {
    chartData,
    isLoading: isLoadingChart,
    error: errorChart,
  } = useProgressChartData();

  let content;

  if (isLoadingChart) {
    content = (
      <View style={styles.centeredContent}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  } else if (errorChart) {
    content = (
      <View style={styles.centeredContent}>
        <AppText style={styles.errorText}>
          Error loading chart data: {errorChart.message}
        </AppText>
        {/* TODO: Add a retry button here? */}
      </View>
    );
  } else {
    content = <WeightProgressChart chartData={chartData} />;
  }

  return (
    <Screen>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
        <AppText style={styles.title}>Progress</AppText>
        {content}
      </ScrollView>
    </Screen>
  );
};

export default ProgressScreen;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContentContainer: {
      flexGrow: 1,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.sizes.headingLarge,
      fontWeight: theme.typography.weights.bold as '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    centeredContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.error,
      textAlign: 'center',
      fontSize: theme.typography.sizes.body,
    },
  });
