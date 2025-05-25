import React, {useState} from 'react';
import {
  View,
  /* Text, */ StyleSheet,
  TouchableOpacity,
  Animated /* Dimensions */,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ActionCardGrid} from '../items/ActionCardGrid'; // Import the new grid component
import {useTheme} from '@/hooks/useTheme'; // Added
import type {Theme} from '@/constants/theme'; // Added

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface FloatingActionButtonProps {
  actions: QuickAction[];
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions,
}) => {
  const theme = useTheme(); // Added
  const styles = makeStyles(theme); // Added
  const [isExpanded, setIsExpanded] = useState(false);
  // Keep animation state here as it controls both the grid and the FAB icon
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true, // Note: useNativeDriver: true might not work with layout props like top/bottom/left/right in ActionCardGrid's container if it were positioned absolutely. Keep an eye on this.
    }).start();

    setIsExpanded(!isExpanded);
  };

  const handleActionPress = (actionOnPress: () => void) => {
    actionOnPress(); // Execute the original action
    toggleMenu(); // Close the menu
  };

  // actionCards rendering logic is moved to ActionCardGrid
  // const actionCards = (
  //   <Animated.View
  //     style={[
  //       styles.cardsContainer,
  //       {
  //         transform: [
  //           {
  //             translateY: animation.interpolate({
  //               inputRange: [0, 1],
  //               outputRange: [200, 0],
  //             }),
  //           },
  //         ],
  //         opacity: animation.interpolate({
  //           inputRange: [0, 0.5, 1],
  //           outputRange: [0, 0, 1],
  //         }),
  //       },
  //     ]}
  //   >
  //     <View style={styles.cardsGrid}>
  //       {actions.map((action) => (
  //         <TouchableOpacity
  //           key={action.id}
  //           style={styles.card}
  //           onPress={() => {
  //             action.onPress();
  //             toggleMenu();
  //           }}
  //         >
  //           <View style={styles.cardIcon}>
  //             <Ionicons name={action.icon as any} size={40} color="#007AFF" />
  //           </View>
  //           <Text style={styles.cardLabel}>{action.label}</Text>
  //         </TouchableOpacity>
  //       ))}
  //     </View>
  //   </Animated.View>
  // );

  return (
    <>
      {isExpanded && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu} // Close menu on overlay press
        />
      )}
      {/* Use View for positioning container, not TouchableOpacity */}
      <View style={styles.container} pointerEvents="box-none">
        {/* Conditionally render grid or render with 0 opacity based on animation */}
        {/* Passing animation value and actions down */}
        <View style={styles.gridPlacementContainer}>
          {/* This View helps position the grid relative to the FAB */}
          <ActionCardGrid
            actions={actions}
            animation={animation}
            onActionPress={handleActionPress}
          />
        </View>

        <TouchableOpacity
          style={[styles.fab, isExpanded && styles.fabActive]}
          onPress={toggleMenu}
          activeOpacity={0.8} // Add feedback
        >
          <Animated.View
            style={[
              styles.fabIcon,
              {
                transform: [
                  {
                    rotate: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '45deg'],
                    }),
                  },
                ],
              },
            ]}>
            <Ionicons name="add" size={30} color={theme.colors.onPrimary} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

// Added makeStyles
const makeStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(${theme.colors.textRGB}, 0.4)`,
    zIndex: 999, // Ensure overlay is above other content but below FAB menu
  },
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.xl, // Use theme spacing
    paddingRight: theme.spacing.xl, // Use theme spacing
    zIndex: 1000, // Ensure FAB and menu are above overlay
  },
  gridPlacementContainer: {
    position: 'absolute',
    // Adjust bottom based on FAB height (60) + container paddingBottom (theme.spacing.xl)
    // and desired spacing between FAB and grid (e.g., theme.spacing.md)
    bottom: 60 + theme.spacing.xl + theme.spacing.md,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30, // Half of width/height for a perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg, // Use a more prominent shadow for FAB
  },
  fabActive: {
    backgroundColor: theme.colors.error, // Or a different theme color for active/close state
  },
  fabIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // styles for cardsContainer, cardsGrid, card, cardIcon, cardLabel are moved
  // to ActionCardGrid.tsx and ActionCard.tsx
  /*
  cardsContainer: {
    position: 'absolute',
    bottom: 80,
    left: -100,
    right: -100,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: 150,
    height: 130,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 12,
  },
  cardIcon: {
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  */
});
