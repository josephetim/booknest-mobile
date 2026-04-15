import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

export function HeaderSearchButton() {
  const theme = useAppTheme();
  const router = useRouter();

  return (
    <Pressable
      accessibilityLabel="Open search"
      accessibilityRole="button"
      onPress={() => router.push('/search')}
      style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
      <Ionicons color={theme.colors.text} name="search-outline" size={20} />
    </Pressable>
  );
}
