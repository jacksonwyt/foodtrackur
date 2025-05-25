import React from 'react';
import {View, Text, StyleSheet, Platform, Dimensions} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LineChart} from 'react-native-chart-kit';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme';

// Define the expected structure for the chart data
interface LineChartDataset {
  data: number[];
  color?: (opacity: number) => string; // Optional color function
  strokeWidth?: number; // Optional stroke width
}

interface LineChartData {
  labels: string[];
  datasets: LineChartDataset[];
  legend?: string[]; // Optional legend
}

interface Props {
  chartData: LineChartData;
  weightTrend: number;
  currentWeight: number | null;
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
    r: '4',
    strokeWidth: '2',
    stroke: theme.colors.primary,
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: theme.colors.border,
  },
});

export const WeightChartCard: React.FC<Props> = ({
  chartData,
  weightTrend,
  currentWeight,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const chartConfig = getChartConfig(theme);

  const trendColor = weightTrend <= 0 ? theme.colors.success : theme.colors.error;
  const trendIcon = weightTrend <= 0 ? 'trending-down' : 'trending-up';

  const chartWidth = Dimensions.get('window').width - (theme.spacing.md * 2 + theme.spacing.sm * 2);

  const renderChart = () => {
    if (!chartData || !chartData.labels || chartData.labels.length === 0) {
      return <Text style={styles.noDataText}>No weight data yet.</Text>;
    }
    // react-native-chart-kit requires at least one data point
    if (chartData.datasets[0].data.length === 0) {
      return <Text style={styles.noDataText}>Waiting for data...</Text>;
    }

    return (
      <LineChart
        data={chartData}
        width={chartWidth}
        height={180}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        fromZero={false}
      />
    );
  };

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartTitle}>7-Day Progress</Text>
          {chartData.labels && chartData.labels.length >= 2 && (
            <Text style={[styles.trendText, {color: trendColor}]}>
              {weightTrend.toFixed(1)} kg
              <Ionicons name={trendIcon} size={16} color={trendColor} />
            </Text>
          )}
        </View>
        {currentWeight !== null && (
          <Text style={styles.currentWeight}>
            {currentWeight.toFixed(1)} kg
          </Text>
        )}
      </View>
      {renderChart()}
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  chartTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  trendText: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentWeight: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'center',
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: theme.spacing.xl,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
});
