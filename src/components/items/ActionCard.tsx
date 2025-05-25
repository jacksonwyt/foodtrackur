import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../hooks/useTheme';
import type {Theme} from '../../constants/theme';

interface ActionCardProps {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  id,
  label,
  icon,
  onPress,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <TouchableOpacity key={id} style={styles.card} onPress={onPress}>
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={40} color={theme.colors.primary} />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    width: 150,
    height: 130,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  cardIcon: {
    marginBottom: theme.spacing.md,
  },
  cardLabel: {
    fontSize: theme.typography.sizes.bodyLarge,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
    textAlign: 'center',
  },
});
