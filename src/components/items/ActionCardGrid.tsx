import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ActionCard } from './ActionCard'; // Import the new ActionCard component

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface ActionCardGridProps {
  actions: QuickAction[];
  animation: Animated.Value;
  onActionPress: (actionOnPress: () => void) => void; // Callback to handle action press + toggle
}

export const ActionCardGrid: React.FC<ActionCardGridProps> = ({
  actions,
  animation,
  onActionPress,
}) => {
  return (
    <Animated.View
      style={[
        styles.cardsContainer,
        {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 0], // Start offscreen and move up
              }),
            },
          ],
          opacity: animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1], // Fade in
          }),
        },
      ]}
      // pointerEvents="box-none" // Allow clicks to pass through container if needed, handled by cards
    >
      <View style={styles.cardsGrid}>
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            id={action.id}
            label={action.label}
            icon={action.icon}
            onPress={() => onActionPress(action.onPress)} // Use the callback
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    // Position is handled by the parent FAB component
    // position: 'absolute',
    // bottom: 80, 
    // left: -100,
    // right: -100,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center', // Center the grid horizontally if needed
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 20, // Use gap for spacing between cards
    width: '100%', // Adjust width as needed, maybe max-width?
    maxWidth: 340, // Example max width to contain 2 cards per row
  },
  // ActionCard styles are now in ActionCard.tsx
}); 