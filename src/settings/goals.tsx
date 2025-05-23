import AdjustGoalsScreen from '../screens/Settings/AdjustGoalsScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../types/navigation';

type AdjustGoalsSettingsPageProps = NativeStackScreenProps<
  SettingsStackParamList,
  'AdjustGoals'
>;

export default function AdjustGoalsSettingsPage(
  props: AdjustGoalsSettingsPageProps,
) {
  return <AdjustGoalsScreen {...props} />;
}
