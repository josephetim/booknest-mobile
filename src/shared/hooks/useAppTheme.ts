import { useColorScheme } from 'react-native';

import { getAppTheme } from '@/src/shared/theme/tokens';

export function useAppTheme() {
  const colorScheme = useColorScheme();

  return getAppTheme(colorScheme);
}
