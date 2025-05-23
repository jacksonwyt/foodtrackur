import React, {useEffect} from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SettingsSection from '../../components/settings/SettingsSection';
import {
  useSettingsScreenLogic,
  PersonalData,
} from '../../hooks/useSettingsScreenLogic';
import {useIsFocused} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SettingsStackParamList} from '../../types/navigation';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../../components/common/AppText';
import {AppButton} from '../../components/common/AppButton';
import type {Theme} from '../../constants/theme';

interface PersonalDataDisplayProps {
  personalData: PersonalData | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

// Added type for SettingsScreen props
type SettingsScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  'SettingsMain'
>;

const PersonalDataDisplay: React.FC<PersonalDataDisplayProps> = ({
  personalData,
  isLoading,
  error,
  onRefresh,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  if (isLoading) {
    return (
      <View style={styles.personalDataContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <AppText style={styles.loadingText}>Loading personal data...</AppText>
      </View>
    );
  }

  if (!personalData) {
    return (
      <View style={styles.personalDataContainer}>
        <AppText style={styles.personalDataText}>
          Personal data not available.
        </AppText>
        {error && (
          <AppText style={styles.errorTextSmall}>Error: {error}</AppText>
        )}
        <AppButton
          title="Refresh"
          onPress={onRefresh}
          variant="outline"
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.personalDataContainer}>
      <AppText style={styles.personalDataTitle}>Your Summary</AppText>
      <View style={styles.personalDataGrid}>
        <View style={styles.personalDataItem}>
          <AppText style={styles.personalDataLabel}>Age</AppText>
          <AppText style={styles.personalDataValue}>
            {personalData.age !== null && personalData.age !== undefined
              ? `${personalData.age} years`
              : 'Not set'}
          </AppText>
        </View>
        <View style={styles.personalDataItem}>
          <AppText style={styles.personalDataLabel}>Height</AppText>
          <AppText style={styles.personalDataValue}>
            {personalData.height || 'Not set'}
          </AppText>
        </View>
        <View style={styles.personalDataItem}>
          <AppText style={styles.personalDataLabel}>Current Weight</AppText>
          <AppText style={styles.personalDataValue}>
            {personalData.currentWeight || 'Not logged'}
          </AppText>
        </View>
      </View>
      {error && (
        <AppText style={styles.errorTextSmall}>
          Last refresh failed: {error}. Tap below to try again.
        </AppText>
      )}
      <AppButton
        title="Refresh Summary"
        onPress={onRefresh}
        variant="ghost"
        style={styles.retryButtonSmall}
      />
    </View>
  );
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation, route}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const {
    sections,
    personalData,
    isLoading: isLoadingData,
    error: dataError,
    refreshPersonalData,
  } = useSettingsScreenLogic();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log('Settings screen focused, refreshing personal data.');
      void refreshPersonalData();
    }
  }, [isFocused, refreshPersonalData]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <AppText style={styles.title}>Settings</AppText>

        <PersonalDataDisplay
          personalData={personalData}
          isLoading={isLoadingData}
          error={dataError}
          onRefresh={() => {
            void refreshPersonalData();
          }}
        />

        {sections.map(section => (
          <SettingsSection
            key={section.title}
            title={section.title}
            items={section.items}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    title: {
      fontSize: theme.typography.sizes.h1,
      fontWeight: 'bold',
      marginBottom: theme.spacing.lg,
      color: theme.colors.text,
    },
    personalDataContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      ...theme.shadows.md,
      shadowRadius: theme.borderRadius.lg,
    },
    personalDataTitle: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    personalDataGrid: {
      // Future: consider a grid layout
    },
    personalDataItem: {
      marginBottom: theme.spacing.md,
    },
    personalDataLabel: {
      fontSize: theme.typography.sizes.caption,
      color: theme.colors.textPlaceholder,
      marginBottom: theme.spacing.xs,
    },
    personalDataValue: {
      fontSize: theme.typography.sizes.body,
      fontWeight: '500',
      color: theme.colors.text,
    },
    loadingText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.textPlaceholder,
      marginLeft: theme.spacing.sm,
    },
    errorTextSmall: {
      fontSize: theme.typography.sizes.overline,
      color: theme.colors.error,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    retryButton: {
      marginTop: theme.spacing.md,
    },
    retryButtonSmall: {
      marginTop: theme.spacing.md,
    },
    personalDataText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
  });
