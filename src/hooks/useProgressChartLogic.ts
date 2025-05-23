import {useMemo} from 'react';
import {Dimensions} from 'react-native';
import {ChartConfig} from 'react-native-chart-kit/dist/HelperTypes'; // Approximate type
import theme from '../constants/theme'; // Assuming theme path

interface DataPoint {
  value: number;
  date: string;
}

interface UseProgressChartLogicProps {
  data: DataPoint[];
  color?: string;
  // theme could be passed here if needed, or accessed via context
}

interface UseProgressChartLogicReturn {
  chartData: {
    labels: string[];
    datasets: {
      data: number[];
      color: (opacity?: number) => string;
      strokeWidth?: number;
    }[];
  };
  chartConfig: ChartConfig;
  chartWidth: number;
}

export const useProgressChartLogic = ({
  data,
  color = theme.colors.primary,
}: UseProgressChartLogicProps): UseProgressChartLogicReturn => {
  const chartWidth = useMemo(() => {
    return Dimensions.get('window').width - theme.spacing.md * 2;
  }, []); // Recalculates only if Dimensions change (though unlikely without listener)

  const chartData = useMemo(() => {
    return {
      labels: data.map(point => point.date),
      datasets: [
        {
          data: data.map(point => point.value),
          color: () => color, // Use the provided color
          strokeWidth: 2,
        },
      ],
    };
  }, [data, color]);

  const chartConfig: ChartConfig = useMemo(() => {
    return {
      backgroundColor: theme.colors.background,
      backgroundGradientFrom: theme.colors.background,
      backgroundGradientTo: theme.colors.background,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Base color, actual line color is from dataset
      labelColor: () => theme.colors.textSecondary,
      style: {
        borderRadius: theme.borderRadius.md,
      },
      propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: color, // Use the provided color for dots
      },
    };
  }, [color]); // Regenerate config if color changes

  return {
    chartData,
    chartConfig,
    chartWidth,
  };
};
