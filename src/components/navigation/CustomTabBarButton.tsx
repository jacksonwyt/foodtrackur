import React from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  GestureResponderEvent,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack'; // To type navigation prop
import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs'; // Import this
import {AppStackParamList} from '@/types/navigation'; // Import your root stack param list
import {useSelector} from 'react-redux'; // Re-add this
import {selectCurrentDate} from '@/store/slices/dateSlice'; // Use the new slice
import {formatISODate} from '@/utils/dateUtils'; // Import for date formatting
import {useTheme} from '@/hooks/useTheme'; // Corrected path
import {Theme} from '@/constants/theme'; // Corrected path

// Define the type for the navigation prop specifically for AppStackParamList
// This ensures type safety when calling navigate
type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;

// interface CustomTabBarButtonProps { // Old interface
//   // children: React.ReactNode;
//   onPress?: () => void;
// }

// Use BottomTabBarButtonProps and pick or omit as needed, or add to it.
// For simplicity, let's assume we want all BottomTabBarButtonProps and potentially add more.
// interface CustomTabBarButtonProps extends BottomTabBarButtonProps { // Comment out or remove this
//   // You can add custom props here if needed, e.g.:
//   // customProp?: string;
// }

const makeStyles = (theme: Theme) => ({
  customButtonContainer: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    top: -30, // This might need to be dynamic or a theme variable
    // Using theme shadows
    ...theme.shadows.lg, // Using a larger shadow for a floating button effect
    // shadowColor: theme.colors.text, (covered by theme.shadows)
    // shadowOffset: {width: 0, height: 5}, (covered by theme.shadows)
    // shadowOpacity: 0.3, (covered by theme.shadows)
    // shadowRadius: 5, (covered by theme.shadows)
  },
  customButton: {
    width: 70, // Consider making this a theme variable if used elsewhere
    height: 70,
    borderRadius: 35, // Or theme.borderRadius.round / 2 if width/height are from theme
    backgroundColor: theme.colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    // Elevation is part of theme.shadows.lg for Android
  },
  icon: {
    color: theme.colors.onPrimary,
  },
});

export function CustomTabBarButton(props: BottomTabBarButtonProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const navigation = useNavigation<AppNavigationProp>();
  const currentDate = useSelector(selectCurrentDate); // Restore usage of selector

  const handlePress = (e: GestureResponderEvent) => {
    // onPress from TouchableOpacity provides an event
    const initialDateString = currentDate
      ? formatISODate(new Date(currentDate))
      : formatISODate(new Date());
    navigation.navigate('FoodDBNav', { screen: 'FoodDBMain', params: { dateToLog: initialDateString } });

    // Call the original onPress from react-navigation if it exists
    // This is important for accessibility and default tab behavior if not fully overriding
    if (props.onPress) {
      props.onPress(e);
    }
  };

  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      onPress={handlePress}
      activeOpacity={0.9}>
      <View style={styles.customButton}>
        <Ionicons name="add" size={34} style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
}
