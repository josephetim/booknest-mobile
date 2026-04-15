import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

export default function NotFoundScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>
          That page has gone missing.
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.mutedText, textAlign: 'center' }]}>
          Head back to Home or Search to continue exploring BookNest.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/(tabs)/home')}
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.accent,
            },
          ]}>
          <Text
            style={[
              theme.typography.label,
              {
                color: theme.colors.accentText,
                fontFamily: theme.fonts.sansBold,
              },
            ]}>
            Return Home
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    padding: 20,
  },
});
