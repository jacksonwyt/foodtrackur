import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { Screen } from '../../components/Screen';
import SettingsSection from '../../components/settings/SettingsSection';
import { useSettingsScreenLogic } from '../../hooks/useSettingsScreenLogic';

const SettingsScreen: React.FC = () => {
  const { sections } = useSettingsScreenLogic();

  return (
    <Screen style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>
        {sections.map((section) => (
          <SettingsSection
            key={section.title}
            title={section.title}
            items={section.items}
          />
        ))}
      </ScrollView>
    </Screen>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f0f0f0', // Light gray background for the whole screen
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40, // Extra padding at the bottom
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#111',
  },
  // Styles for Section and ListItem are now in their respective component files
}); 