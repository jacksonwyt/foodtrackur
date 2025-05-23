import EditProfileScreen from '../screens/Settings/EditProfileScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../types/navigation';

type ProfileSettingsPageProps = NativeStackScreenProps<
  SettingsStackParamList,
  'EditProfile'
>;

export default function ProfileSettingsPage(props: ProfileSettingsPageProps) {
  return <EditProfileScreen {...props} />;
}
