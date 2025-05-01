import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

interface WeightProgressChartProps {
  chartData: ChartData;
}

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#007AFF', // Example color
  },
  propsForBackgroundLines: {
    strokeDasharray: '', // Solid lines
    stroke: '#e0e0e0',
  },
};

const WeightProgressChart: React.FC<WeightProgressChartProps> = ({ chartData }) => {
  // Prevent rendering chart if data is empty to avoid errors
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0 || chartData.datasets[0].data.length === 0) {
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weight Progress</Text>
        <View style={styles.emptyChartContainer}>
          <Text style={styles.emptyChartText}>Not enough data to display chart.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Weight Progress</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 48} // Adjust based on padding
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix=" kg"
        yAxisLabel=""
        withInnerLines={true}
        withOuterLines={false}
        fromZero={false} // Adjust based on your data range
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    // Add shadows or borders if desired
    borderWidth: 1,
    borderColor: '#eee',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  chart: {
    borderRadius: 16,
  },
  emptyChartContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
  },
  emptyChartText: {
    color: '#666',
    fontSize: 14,
  },
});

export default WeightProgressChart; 