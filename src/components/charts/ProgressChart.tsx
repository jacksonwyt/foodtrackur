import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useProgressChartLogic} from '@/hooks/useProgressChartLogic';
import {useTheme} from '@/hooks/useTheme';

interface DataPoint {
  value: number;
  date: string;
}

interface ProgressChartProps {
  data: DataPoint[];
  unit: string;
  lineColor?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  unit,
  lineColor,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const {chartData, chartConfig, chartWidth} = useProgressChartLogic({
    data,
    color: lineColor || theme.colors.primary,
  });

  if (
    !chartData ||
    !chartData.labels ||
    chartData.labels.length === 0 ||
    !chartData.datasets ||
    chartData.datasets.length === 0 ||
    !chartData.datasets[0] ||
    chartData.datasets[0].data.length === 0
  ) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data available for chart.</Text>
      </View>
    );
  }

  return (
    <LineChart
      data={chartData}
      width={chartWidth}
      height={220}
      chartConfig={chartConfig}
      bezier
      style={styles.chart}
      yAxisSuffix={unit}
      yAxisLabel=""
      yAxisInterval={1}
      withInnerLines={true}
      withOuterLines={false}
      fromZero={false}
    />
  );
};

const makeStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  chart: {
    alignSelf: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
    height: 220,
    borderRadius: theme.borderRadius.md,
  },
  noDataText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ProgressChart;
