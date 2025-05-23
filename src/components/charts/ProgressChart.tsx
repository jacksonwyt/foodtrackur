import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useProgressChartLogic} from '../../hooks/useProgressChartLogic';
import {useTheme} from '../../hooks/useTheme';

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
  const theme = useTheme();
  const styles = makeStyles(theme);

  const {chartData, chartConfig, chartWidth} = useProgressChartLogic({
    data,
    color,
  });

  if (
    !chartData ||
    chartData.labels.length === 0 ||
    chartData.datasets[0].data.length === 0
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noDataText}>No data available for chart.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
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

const makeStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  title: {
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.sizes.h6,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  noDataText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
});

export default ProgressChart;
