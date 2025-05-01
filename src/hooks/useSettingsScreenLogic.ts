import { useRouter } from 'expo-router';
import { SettingsItemData } from '../components/settings/SettingsListItem'; // Adjust path as necessary

interface SettingsSectionData {
  title: string;
  items: SettingsItemData[];
}

export const useSettingsScreenLogic = (): { sections: SettingsSectionData[] } => {
  const router = useRouter();

  // --- Account & Personal Data Section ---
  const accountSettings: SettingsSectionData = {
    title: 'Account & Personal Data',
    items: [
      {
        icon: 'person-circle-outline',
        label: 'Profile Details',
        onPress: () => router.push('/settings/profile'),
      },
      {
        icon: 'body-outline',
        label: 'Height & Weight',
        onPress: () => router.push('/settings/details'),
      },
      {
        icon: 'trophy-outline',
        label: 'Adjust Goals',
        onPress: () => router.push('/settings/goals'),
      },
      {
        icon: 'notifications-outline',
        label: 'Notifications',
        onPress: () => router.push('/settings/notifications'),
      },
      {
        icon: 'lock-closed-outline',
        label: 'Security & Privacy',
        onPress: () => router.push('/settings/privacy'),
      },
    ],
  };

  // --- Financial & Referral Section ---
  const financialSettings: SettingsSectionData = {
    title: 'Financial & Referral',
    items: [
      {
        icon: 'card-outline',
        label: 'Subscription',
        onPress: () => router.push('/settings/subscription'),
      },
      {
        icon: 'gift-outline',
        label: 'Referral Program',
        onPress: () => router.push('/settings/referral'),
      },
    ],
  };

  // --- Preferences & Customization Section ---
  const preferencesSettings: SettingsSectionData = {
    title: 'Preferences & Customization',
    items: [
      {
        icon: 'color-palette-outline',
        label: 'Theme',
        value: 'System',
        onPress: () => router.push('/settings/theme'),
      },
      {
        icon: 'language-outline',
        label: 'Language',
        value: 'English',
        onPress: () => router.push('/settings/language'),
      },
      {
        icon: 'options-outline',
        label: 'Units (Metric/Imperial)',
        value: 'Metric',
        onPress: () => router.push('/settings/units'),
      },
      {
        icon: 'grid-outline',
        label: 'Widget Management',
        onPress: () => router.push('/settings/widgets'),
      },
    ],
  };

  // --- Support Section (Keep as is or adjust as needed) ---
  const supportSettings: SettingsSectionData = {
    title: 'Support',
    items: [
      {
        icon: 'help-circle-outline',
        label: 'Help Center',
        onPress: () => router.push('/settings/help'),
      },
      {
        icon: 'mail-outline',
        label: 'Contact Us',
        onPress: () => router.push('/settings/contact'),
      },
      {
        icon: 'document-text-outline',
        label: 'Terms of Service',
        onPress: () => router.push('/settings/terms'),
      },
      {
        icon: 'shield-checkmark-outline',
        label: 'Privacy Policy',
        onPress: () => router.push('/settings/privacy-policy'),
      },
      {
        icon: 'information-circle-outline',
        label: 'App Version',
        value: '1.0.0 (Build 1)',
        isNavigable: false,
      },
    ],
  };

  // Combine all sections
  const sections = [
    accountSettings,
    financialSettings,
    preferencesSettings,
    supportSettings,
  ];

  return {
    sections,
  };
}; 