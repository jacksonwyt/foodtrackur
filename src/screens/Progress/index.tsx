import React from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProgressStackParamList } from '@/types/navigation';
import { Screen } from '@/components/Screen';
import { useProgressChartData } from '@/hooks/useProgressChartData';
import ProgressChart from '@/components/charts/ProgressChart';
import { useTheme } from '@/hooks/useTheme';
import { AppText } from '@/components/common/AppText';
import type { Theme } from '@/constants/theme';
import { getProfile, type Profile } from '@/services/profileService';
import { useFocusEffect } from '@react-navigation/native';
import GoalProgressBar from '@/components/progress/GoalProgressBar';
import KeyStatistics from '@/components/progress/KeyStatistics';

// Define prop types for the screen
type ProgressScreenProps = NativeStackScreenProps<
  ProgressStackParamList,
  'Progress'
>;

interface DataPoint {
  value: number;
  date: string;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [userProfile, setUserProfile] = React.useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const [errorProfile, setErrorProfile] = React.useState<string | null>(null);

  const {
    chartData: rawChartData,
    isLoading: isLoadingChart,
    error: errorChart,
  } = useProgressChartData();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        setIsLoadingProfile(true);
        setErrorProfile(null);
        try {
          const profile = await getProfile();
          setUserProfile(profile);
        } catch (e) {
          if (e instanceof Error) {
            setErrorProfile(e.message);
          } else {
            setErrorProfile('Failed to fetch user profile.');
          }
        } finally {
          setIsLoadingProfile(false);
        }
      };

      void fetchUserProfile();
    }, [])
  );

  const formattedChartData: DataPoint[] = React.useMemo(() => {
    if (!rawChartData || !rawChartData.labels || !rawChartData.datasets?.[0]?.data) {
      return [];
    }
    return rawChartData.labels.map((label, index) => ({
      date: label,
      value: rawChartData.datasets[0].data[index],
    }));
  }, [rawChartData]);

  let content;
  let goalOverviewContent = null;
  let keyStatisticsContent = null;

  if (isLoadingChart || isLoadingProfile) {
    content = (
      <View style={styles.centeredContent}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  } else if (errorChart) {
    content = (
      <View style={styles.centeredContent}>
        <AppText style={styles.errorText}>
          Error loading chart data: {errorChart?.message || 'Unknown error'}
        </AppText>
      </View>
    );
  } else if (errorProfile) {
    content = (
      <View style={styles.centeredContent}>
        <AppText style={styles.errorText}>
          Error loading profile data: {errorProfile || 'Unknown error'}
        </AppText>
      </View>
    );
  } else {
    content = <ProgressChart data={formattedChartData} unit=" kg" lineColor={theme.colors.primary} />;

    if (rawChartData?.datasets?.[0]?.data?.length > 0 && userProfile?.goal_weight) {
      const weights = rawChartData.datasets[0].data;
      const startingWeight = weights[0];
      const currentWeight = weights[weights.length - 1];
      const goalWeight = userProfile.goal_weight;

      goalOverviewContent = (
        <View style={styles.goalOverviewContainer}>
          <GoalProgressBar 
            startingWeight={startingWeight}
            currentWeight={currentWeight}
            goalWeight={goalWeight}
          />
        </View>
      );
    } else if (userProfile && !userProfile.goal_weight) {
      goalOverviewContent = (
        <View style={styles.goalOverviewContainer}>
          <AppText style={styles.goalText}>No goal weight set. You can set one in Settings.</AppText>
        </View>
      );
    }

    if (rawChartData?.datasets?.[0]?.data?.length > 0) {
      keyStatisticsContent = <KeyStatistics chartData={rawChartData} />;
    }
  }

  return (
    <Screen>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
        <AppText style={styles.title}>Progress</AppText>
        {content} 
        {goalOverviewContent}
        {keyStatisticsContent}
      </ScrollView>
    </Screen>
  );
};

export default ProgressScreen;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContentContainer: {
      flexGrow: 1,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.sizes.h1,
      fontWeight: theme.typography.weights.bold as '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    goalOverviewContainer: {
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
    },
    goalText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    centeredContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    errorText: {
      color: theme.colors.error,
      textAlign: 'center',
      fontSize: theme.typography.sizes.body,
    },
  });
