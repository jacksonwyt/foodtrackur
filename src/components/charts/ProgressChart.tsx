import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import theme from '../../constants/theme';
import { useProgressChartLogic } from '../../hooks/useProgressChartLogic';

interface DataPoint {
  value: number;
  date: string;
}

interface ProgressChartProps {
  data: DataPoint[];
  title: string;
  unit: string;
  color?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title,
  unit,
  color,
}) => {
  const { chartData, chartConfig, chartWidth } = useProgressChartLogic({ data, color });

  if (!chartData || chartData.labels.length === 0 || chartData.datasets[0].data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.noDataText}>No data available for chart.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix={unit}
        yAxisInterval={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.sizes.lg || 20,
    fontWeight: '600',
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  noDataText: {
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default ProgressChart; 