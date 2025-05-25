import React from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import { AppText } from '@/components/common/AppText';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/constants/theme';
import type { ProgressChartData } from '@/hooks/useProgressChartData';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'; // Using @expo/vector-icons

interface KeyStatisticsProps {
  chartData: ProgressChartData;
  // userProfile: Profile | null; // For goal setting if needed later
}

// Helper to determine color based on change (adapt to your app's goal)
const getChangeColor = (change: number, theme: Theme, goal: 'lose' | 'gain' | 'maintain' = 'lose'): string => {
  // Ensure theme has success and error colors defined, or provide fallbacks if not present
  const successColor = theme.colors.success || theme.colors.primary; // Fallback to primary
  const errorColor = theme.colors.error || theme.colors.secondary; // Fallback to secondary

  if (change === 0 || goal === 'maintain') return theme.colors.text;
  if (goal === 'lose') {
    return change < 0 ? successColor : errorColor;
  } else { // gain
    return change > 0 ? successColor : errorColor;
  }
};


const KeyStatistics: React.FC<KeyStatisticsProps> = ({ chartData }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  if (!chartData || !chartData.datasets?.[0]?.data || chartData.datasets[0].data.length < 1) {
    return (
      <View style={[styles.container, styles.noDataContainer]}>
        <Icon name="chart-gantt" size={48} color={theme.colors.textSecondary} style={styles.noDataIcon} />
        <AppText style={styles.noDataTitle}>Awaiting Data</AppText>
        <AppText style={styles.noDataText}>
          Log your weight regularly to unlock key statistics about your progress.
        </AppText>
      </View>
    );
  }

  const weights = chartData.datasets[0].data;
  const labels = chartData.labels;

  const startingWeight = weights[0];
  const currentWeight = weights[weights.length - 1];

  // 1. Total Change
  const totalChange = currentWeight - startingWeight;
  // Assuming 'lose' is the default goal for weight. Adjust if necessary.
  const totalChangeColor = getChangeColor(totalChange, theme, 'lose');
  const totalChangeSign = totalChange > 0 ? '+' : (totalChange < 0 ? '-' : '');
  const totalChangeValueText = `${Math.abs(totalChange).toFixed(1)}`;
  const startDateText = labels.length > 0 ? `since day ${labels[0]}` : "since start";

  // 2. Average Weekly Change
  let averageWeeklyChangeValueText = "N/A";
  let averageWeeklyChangeColor = theme.colors.text;
  let averageWeeklyUnitText = "";
  let averageWeeklyDetailText = "";


  if (weights.length >= 2 && labels.length >= 2) {
    const firstDay = parseInt(labels[0], 10);
    const lastDay = parseInt(labels[labels.length - 1], 10);
    
    if (!isNaN(firstDay) && !isNaN(lastDay) && lastDay > firstDay) {
      const durationInDays = lastDay - firstDay;
      if (durationInDays >= 1) {
        const durationInWeeks = durationInDays / 7;
        if (durationInWeeks > 0.25) { // Require at least a quarter of a week
          const averageWeeklyChange = totalChange / durationInWeeks;
          const avgSign = averageWeeklyChange > 0 ? '+' : (averageWeeklyChange < 0 ? '-' : '');
          averageWeeklyChangeValueText = `${avgSign}${Math.abs(averageWeeklyChange).toFixed(1)}`;
          averageWeeklyUnitText = "kg/week";
          averageWeeklyChangeColor = getChangeColor(averageWeeklyChange, theme, 'lose');
          averageWeeklyDetailText = "approx.";
        } else {
          averageWeeklyChangeValueText = "Less than a week";
          averageWeeklyDetailText = "of data";
        }
      } else {
         averageWeeklyChangeValueText = "Short duration";
         averageWeeklyDetailText = "for calculation";
      }
    }
  } else if (weights.length === 1) {
    averageWeeklyChangeValueText = "Needs more data";
  }
  
  // 3. Consistency
  const logsInChartPeriod = weights.length;
  const consistencyValueText = `${logsInChartPeriod}`;
  const consistencyUnitText = `log${logsInChartPeriod === 1 ? '' : 's'}`;
  const consistencyDetail = "in chart period";

  interface StatItemProps {
    iconName: any; // Changed to any to bypass specific icon name type checking for now
    label: string;
    value: string;
    valueColor?: string;
    unit?: string;
    detail?: string;
  }

  const StatItem: React.FC<StatItemProps> = ({ iconName, label, value, valueColor = theme.colors.text, unit, detail }) => (
    <View style={styles.statItemContainer}>
      <Icon name={iconName} size={24} color={valueColor === (theme.colors.success || theme.colors.primary) || valueColor === (theme.colors.error || theme.colors.secondary) ? valueColor : theme.colors.primary} style={styles.statIcon} />
      <View style={styles.statTextContainer}>
        <AppText style={styles.statLabel}>{label}</AppText>
        <View style={styles.statValueRow}>
          <AppText style={[styles.statValue, { color: valueColor }]}>{value}</AppText>
          {unit && <AppText style={[styles.statUnit, { color: valueColor }]}> {unit}</AppText>}
        </View>
        {detail && <AppText style={styles.statDetail}>{detail}</AppText>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Key Statistics</AppText>
      <StatItem
        iconName={totalChange === 0 ? "swap-vertical" : (totalChange < 0 ? "trending-down" : "trending-up")}
        label="Total Change"
        value={`${totalChangeSign}${totalChangeValueText}`}
        valueColor={totalChangeColor}
        unit="kg"
        detail={startDateText}
      />
      <StatItem
        iconName="calendar-week-outline"
        label="Avg. Weekly Change"
        value={averageWeeklyChangeValueText}
        valueColor={averageWeeklyChangeColor}
        unit={averageWeeklyUnitText}
        detail={averageWeeklyDetailText}
      />
      <StatItem
        iconName="clipboard-check-outline"
        label="Consistency"
        value={consistencyValueText}
        unit={consistencyUnitText}
        detail={consistencyDetail}
      />
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg, // Increased padding
    borderRadius: theme.borderRadius.lg, // Larger radius for a softer look
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md, // Slightly more pronounced shadow if desired
  },
  title: {
    fontSize: theme.typography.sizes.h3, // Using h3 as h5/h6 not available
    fontWeight: theme.typography.weights.semibold, // Removed unnecessary cast
    color: theme.colors.text,
    marginBottom: theme.spacing.xl, // More space after title
  },
  // Enhanced "No Data" state
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noDataIcon: {
    marginBottom: theme.spacing.md,
  },
  noDataTitle: {
    fontSize: theme.typography.sizes.bodyLarge, // Using bodyLarge as h6 not available
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  noDataText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.normal, // Corrected to normal
  },

  // StatItem new structure
  statItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the top if text wraps
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border, // Using theme.colors.border directly
    // Last item does not need a border, can be handled by removing borderBottomWidth if it's the last child
    // This logic is easier to implement in the map/render function if StatItems are in an array.
  },
  statIcon: {
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.xs, // Align icon nicely with first line of text
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs, // Space between label and value
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align value and unit nicely
  },
  statValue: {
    fontSize: theme.typography.sizes.h3, // Using h3 as h6 not available
    color: theme.colors.text, // Default color, will be overridden by prop
    fontWeight: theme.typography.weights.bold, // Bold value
  },
  statUnit: {
    fontSize: theme.typography.sizes.caption, // Smaller unit
    color: theme.colors.textSecondary, // Default unit color
    fontWeight: theme.typography.weights.medium,
    marginLeft: theme.spacing.xs,
    paddingBottom: theme.spacing.xxs, // Align baseline with value
  },
  statDetail: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.textSecondary, // Using theme.colors.textSecondary directly
    marginTop: theme.spacing.xxs,
  },
});

export default KeyStatistics; 