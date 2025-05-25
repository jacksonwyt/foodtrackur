import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@/hooks/useTheme';
import type {Theme} from '@/constants/theme';

interface SubscriptionFooterProps {
  subscribeButtonText: string;
  termsText: string;
  guaranteeText: string;
  onSubscribe: () => void;
}

const SubscriptionFooter: React.FC<SubscriptionFooterProps> = ({
  subscribeButtonText,
  termsText,
  guaranteeText,
  onSubscribe,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <View style={styles.footer}>
      <Text style={styles.guarantee}>{guaranteeText}</Text>
      <TouchableOpacity style={styles.subscribeButton} onPress={onSubscribe}>
        <Text style={styles.buttonText}>{subscribeButtonText}</Text>
      </TouchableOpacity>
      <Text style={styles.terms}>{termsText}</Text>
    </View>
  );
};

const makeStyles = (theme: Theme) => StyleSheet.create({
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  guarantee: {
    fontSize: theme.typography.sizes.overline,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  terms: {
    fontSize: theme.typography.sizes.overline,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default SubscriptionFooter;
