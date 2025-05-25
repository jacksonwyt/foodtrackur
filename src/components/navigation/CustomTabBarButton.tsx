import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Modal,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack'; // To type navigation prop
import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs'; // Import this
import {AppStackParamList, FoodDBStackParamList, ScanStackParamList} from '@/types/navigation'; // Import your root stack param list
import {useSelector} from 'react-redux'; // Re-add this
import {selectCurrentDate} from '@/store/slices/dateSlice'; // Use the new slice
import {formatISODate} from '@/utils/dateUtils'; // Import for date formatting
import {useTheme} from '@/hooks/useTheme'; // Corrected path
import {Theme} from '@/constants/theme'; // Corrected path

// Define the type for the navigation prop specifically for AppStackParamList
// This ensures type safety when calling navigate
type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;

// Define an interface for the styles to ensure correct types
interface ComponentStyles {
  customButtonContainer: ViewStyle;
  customButton: ViewStyle;
  icon: TextStyle;
  overlayBackdrop: ViewStyle;
  overlayContent: ViewStyle;
  optionsRowContainer: ViewStyle;
  circularOptionButton: ViewStyle;
  circularOptionButtonText: TextStyle;
}

const makeStyles = (theme: Theme, isOverlayVisible: boolean): ComponentStyles => ({
  customButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: -30,
    ...theme.shadows.lg,
    zIndex: 1,
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: isOverlayVisible ? theme.colors.error : theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: theme.colors.onPrimary,
  },
  overlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(${theme.colors.textSecondaryRGB}, 0.4)`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    width: '85%',
    alignItems: 'center',
    marginTop: 400, // As per user's previous adjustment
  },
  optionsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  circularOptionButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 33,
  },
  circularOptionButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export function CustomTabBarButton(props: BottomTabBarButtonProps) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const theme = useTheme();
  const styles = makeStyles(theme, isOverlayVisible);
  const navigation = useNavigation<AppNavigationProp>();
  const currentDate = useSelector(selectCurrentDate); // Restore usage of selector

  const handlePress = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false);
  };

  const navigateToScanFood = () => {
    const dateToLog = currentDate
      ? formatISODate(new Date(currentDate))
      : formatISODate(new Date());
    navigation.navigate('ScanNav', {
      screen: 'ScanMain',
      params: {dateToLog},
    } as NavigatorScreenParams<ScanStackParamList>); // Type assertion
    closeOverlay();
  };

  const navigateToAddFoodManually = () => {
    const initialDate = currentDate
      ? formatISODate(new Date(currentDate))
      : formatISODate(new Date());
    navigation.navigate('AddFood', { initialDate }); 
    closeOverlay();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.customButtonContainer}
        onPress={handlePress}
        activeOpacity={0.9}>
        <View style={styles.customButton}>
          <Ionicons name={isOverlayVisible ? "close" : "add"} size={34} style={styles.icon} />
        </View>
      </TouchableOpacity>
      {/* Modal is used for the backdrop and visibility toggle */}
      <Modal
        transparent={true}
        visible={isOverlayVisible} // Controlled by state, animation handles appearance
        onRequestClose={closeOverlay} // Android back button
        animationType="fade" // Reverted to fade animation
      >
        <TouchableOpacity
          style={styles.overlayBackdrop}
          activeOpacity={1}
          onPressOut={closeOverlay} // Close when pressing backdrop
        >
          {/* Removed Animated.View, using regular View with updated styles */}
          <View style={styles.overlayContent}> 
            {/* Prevent closing when pressing inside the content area */}
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.optionsRowContainer}>
                <TouchableOpacity style={styles.circularOptionButton} onPress={navigateToScanFood}>
                  <Ionicons name="scan-outline" size={30} color={theme.colors.onPrimary} />
                  <Text style={styles.circularOptionButtonText}>Scan Food</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circularOptionButton} onPress={navigateToAddFoodManually}>
                  <Ionicons name="add-circle-outline" size={30} color={theme.colors.onPrimary} />
                  <Text style={styles.circularOptionButtonText}>Add Manually</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
