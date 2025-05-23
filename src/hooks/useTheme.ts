import appTheme, {type Theme} from '../constants/theme';

export function useTheme(): Theme {
  const currentTheme: Theme = appTheme;
  return currentTheme;
}
