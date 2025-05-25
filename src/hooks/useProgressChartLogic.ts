import {useMemo} from 'react';
import {Dimensions} from 'react-native';
import {ChartConfig} from 'react-native-chart-kit/dist/HelperTypes';
import theme from '../constants/theme';

interface DataPoint {
  value: number;
  date: string;
}

interface UseProgressChartLogicProps {
  data: DataPoint[];
  color?: string;
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
    return Dimensions.get('window').width - theme.spacing.lg * 2;
  }, []);

  const chartData = useMemo(() => {
    return {
      labels: data.map(point => point.date),
      datasets: [
        {
          data: data.map(point => point.value),
          color: () => color,
          strokeWidth: 2,
        },
      ],
    };
  }, [data, color]);

  const chartConfig: ChartConfig = useMemo(() => {
    const defaultPrimaryRGB = '100,100,100'; // A neutral grey
    const defaultTextSecondaryRGB = '150,150,150'; // A slightly lighter grey

    const primaryRgbToUse = theme.colors.primaryRGB || defaultPrimaryRGB;
    const textSecondaryRgbToUse = theme.colors.textSecondaryRGB || defaultTextSecondaryRGB;

    return {
      backgroundColor: theme.colors.background,
      backgroundGradientFrom: theme.colors.background,
      backgroundGradientTo: theme.colors.background,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(${primaryRgbToUse}, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(${textSecondaryRgbToUse}, ${opacity})`,
      style: {
        borderRadius: theme.borderRadius.md,
      },
      propsForDots: {
        r: '4',
        strokeWidth: '2',
        stroke: color,
      },
    };
  }, [color]);

  return {
    chartData,
    chartConfig,
    chartWidth,
  };
};
