import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import theme from '../../constants/theme'; // Assuming theme is in this path

interface AuthFooterLinksProps {
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

export function AuthFooterLinks({
  onTermsPress,
  onPrivacyPress,
}: AuthFooterLinksProps): React.ReactElement {
  const handleTerms = () => {
    if (onTermsPress) {
      onTermsPress();
    } else {
      Linking.openURL('https://foodtrack.app/terms').catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
  };

  const handlePrivacy = () => {
    if (onPrivacyPress) {
      onPrivacyPress();
    } else {
      Linking.openURL('https://foodtrack.app/privacy').catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTerms}>
        <Text style={styles.linkText}>Terms of Service</Text>
      </TouchableOpacity>
      <Text style={styles.separator}>|</Text>
      <TouchableOpacity onPress={handlePrivacy}>
        <Text style={styles.linkText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  linkText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fontFamily,
    textDecorationLine: 'underline',
  },
  separator: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.caption,
    marginHorizontal: theme.spacing.xs,
  },
}); 