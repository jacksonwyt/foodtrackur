import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Screen } from '../../components/Screen';
import { useProgressChartData } from '../../hooks/useProgressChartData';
import WeightProgressChart from '../../components/progress/WeightProgressChart';

const ProgressScreen: React.FC = () => {
  const { chartData, isLoading: isLoadingChart, error: errorChart } = useProgressChartData();

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Progress</Text>

        <WeightProgressChart chartData={chartData} />

      </ScrollView>
    </Screen>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
  },
  // Styles specific to the extracted components are now within those components
}); 