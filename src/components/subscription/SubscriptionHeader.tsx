import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '@/hooks/useTheme';
import type {Theme} from '@/constants/theme';

interface SubscriptionHeaderProps {
  title: string;
  onClose: () => void;
}

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({
  title,
  onClose,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    paddingTop: Platform.OS === 'ios' ? theme.spacing.xxxl + theme.spacing.sm : theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  closeButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
});

export default SubscriptionHeader;
