import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import type {
  FoodDBStackParamList,
  AppStackParamList,
} from '../../types/navigation';
import {Screen} from '../../components/Screen';
import {formatISODate} from '../../utils/dateUtils';
import {useTheme} from '../../hooks/useTheme';
import {AppText} from '../../components/common/AppText';
import {Theme} from '../../constants/theme';

// Define prop types for the screen using the centralized types
type FoodDBMainScreenProps = NativeStackScreenProps<
  FoodDBStackParamList,
  'FoodDBMain'
>;

const FoodDBMainScreen: React.FC<FoodDBMainScreenProps> = ({
  navigation,
  route,
}) => {
  const dateForLog: string =
    route.params?.initialDate || formatISODate(new Date());

  // Typed navigation for navigating within FoodDBStack or to AppStack routes
  const appNavigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const theme = useTheme();
  const styles = makeStyles(theme);

  const navigateToSearch = () => {
    navigation.navigate('FoodSearch', {dateToLog: dateForLog});
  };

  const navigateToScan = () => {
    // Navigate to ScanNav, then to ScanMain screen within that stack, passing dateForLog
    appNavigation.navigate('ScanNav', {
      screen: 'ScanMain',
      params: {dateToLog: dateForLog},
    });
  };

  const navigateToCreateCustomFood = () => {
    // Navigate to the AddFood modal in the root AppStack
    appNavigation.navigate('AddFood', {initialDate: dateForLog});
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <AppText style={styles.title}>Log Food</AppText>
        <AppText
          style={
            styles.subtitle
          }>{`Logging for: ${new Date(dateForLog).toLocaleDateString()}`}</AppText>

        <TouchableOpacity style={styles.button} onPress={navigateToSearch}>
          <AppText style={styles.buttonText}>Search Food Database</AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={navigateToScan}>
          <AppText style={styles.buttonText}>Scan Food with AI</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={navigateToCreateCustomFood}>
          <AppText style={styles.buttonText}>Create Custom Food</AppText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    container: {
      width: '85%',
      alignItems: 'center',
      gap: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.sizes.h1,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.onBackground,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.onSurfaceMedium,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      width: '100%',
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.button.fontWeight,
    },
  });

export default FoodDBMainScreen;
