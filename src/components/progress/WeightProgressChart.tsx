import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../../components/common/AppText';
import type {Theme} from '../../constants/theme';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
  }[];
}

interface WeightProgressChartProps {
  chartData: ChartData;
}

const getChartConfig = (theme: Theme) => ({
  backgroundColor: theme.colors.surface,
  backgroundGradientFrom: theme.colors.surface,
  backgroundGradientTo: theme.colors.surface,
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(${theme.colors.primaryRGB}, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(${theme.colors.textSecondaryRGB}, ${opacity})`,
  style: {
    borderRadius: theme.borderRadius.md,
  },
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: theme.colors.primary,
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: theme.colors.border,
  },
});

const WeightProgressChart: React.FC<WeightProgressChartProps> = ({
  chartData,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const chartConfig = getChartConfig(theme);

  if (
    !chartData ||
    !chartData.datasets ||
    chartData.datasets.length === 0 ||
    chartData.datasets[0].data.length === 0
  ) {
    return (
      <View style={styles.chartCard}>
        <AppText style={styles.chartTitle}>Weight Progress</AppText>
        <View style={styles.emptyChartContainer}>
          <AppText style={styles.emptyChartText}>
            Not enough data to display chart.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.chartCard}>
      <AppText style={styles.chartTitle}>Weight Progress</AppText>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - theme.spacing.lg * 2}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix=" kg"
        yAxisLabel=""
        withInnerLines={true}
        withOuterLines={false}
        fromZero={false}
      />
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    chartCard: {
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      ...theme.shadows.sm,
    },
    chartTitle: {
      fontSize: theme.typography.sizes.bodyLarge,
      fontWeight: theme.typography.weights.bold as '700',
      marginBottom: theme.spacing.md,
      color: theme.colors.text,
    },
    chart: {
      borderRadius: theme.borderRadius.md,
    },
    emptyChartContainer: {
      height: 220,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
    },
    emptyChartText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.body,
    },
  });

export default WeightProgressChart;
