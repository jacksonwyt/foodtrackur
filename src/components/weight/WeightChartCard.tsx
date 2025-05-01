import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, LineChartData } from 'react-native-chart-kit';

interface Props {
  chartData: LineChartData;
  weightTrend: number;
  currentWeight: number | null;
}

const chartWidth = Dimensions.get('window').width - 48; // padding * 2

export const WeightChartCard: React.FC<Props> = ({ chartData, weightTrend, currentWeight }) => {
  const trendColor = weightTrend <= 0 ? '#4CAF50' : '#FF6B6B';
  const trendIcon = weightTrend <= 0 ? 'trending-down' : 'trending-up';

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
        chartConfig={{
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
            r: '4',
            strokeWidth: '2',
            stroke: '#000'
          }
        }}
        bezier
        style={styles.chart}
      />
    );
  }

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartTitle}>7-Day Progress</Text>
          {chartData.labels && chartData.labels.length >= 2 && (
            <Text style={[styles.trendText, { color: trendColor }]}>
              {weightTrend.toFixed(1)} kg
              <Ionicons name={trendIcon} size={16} color={trendColor} />
            </Text>
          )}
        </View>
        {currentWeight !== null && (
          <Text style={styles.currentWeight}>{currentWeight.toFixed(1)} kg</Text>
        )}
      </View>
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  trendText: {
    fontSize: 16,
    fontWeight: '600',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentWeight: {
    fontSize: 24,
    fontWeight: '700',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 40,
    fontSize: 16,
    color: '#666',
  },
}); 