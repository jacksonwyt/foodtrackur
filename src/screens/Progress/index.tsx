import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Screen } from '../../components/Screen';
import { useProgressTimeFrame, TimeFrame } from '../../hooks/useProgressTimeFrame';
import { useProgressStatsData } from '../../hooks/useProgressStatsData';
import { useProgressChartData } from '../../hooks/useProgressChartData';
import { useProgressAchievementsData } from '../../hooks/useProgressAchievementsData';
import TimeFrameSelector from '../../components/progress/TimeFrameSelector';
import StatsGrid from '../../components/progress/StatsGrid';
import WeightProgressChart from '../../components/progress/WeightProgressChart';
import AchievementsList from '../../components/progress/AchievementsList';

// Define available time frames here or import from hook/config
const TIME_FRAMES: TimeFrame[] = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

const ProgressScreen: React.FC = () => {
  const { timeFrame, setTimeFrame } = useProgressTimeFrame();
  const { stats, isLoading: isLoadingStats, error: errorStats } = useProgressStatsData(timeFrame);
  const { chartData, isLoading: isLoadingChart, error: errorChart } = useProgressChartData(timeFrame);
  const { achievements, isLoading: isLoadingAchievements, error: errorAchievements } = useProgressAchievementsData(timeFrame);

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Progress</Text>

        <TimeFrameSelector
          currentTimeFrame={timeFrame}
          onSelectTimeFrame={setTimeFrame}
          timeFrames={TIME_FRAMES}
        />

        <StatsGrid stats={stats} />

        <WeightProgressChart chartData={chartData} />

        <AchievementsList achievements={achievements} />

      </ScrollView>
    </Screen>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
  },
  // Styles specific to the extracted components are now within those components
}); 