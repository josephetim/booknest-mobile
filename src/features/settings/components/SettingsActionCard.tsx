import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SurfaceCard } from '@/src/shared/components/SurfaceCard';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

type SettingsActionCardProps = {
  title: string;
  body: string;
  actionLabel: string;
  onPress: () => void;
  tone?: 'default' | 'danger';
};

export function SettingsActionCard({
  title,
  body,
  actionLabel,
  onPress,
  tone = 'default',
}: SettingsActionCardProps) {
  const theme = useAppTheme();
  const actionColor = tone === 'danger' ? theme.colors.danger : theme.colors.accent;
  const actionTextColor = tone === 'danger' ? theme.colors.text : theme.colors.accentText;

  return (
    <SurfaceCard>
      <View style={styles.container}>
        <View style={styles.textGroup}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>{body}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={[
            styles.button,
            {
              backgroundColor: actionColor,
            },
          ]}>
          <Text
            style={[
              theme.typography.label,
              {
                color: actionTextColor,
                fontFamily: theme.fonts.sansBold,
              },
            ]}>
            {actionLabel}
          </Text>
        </Pressable>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  textGroup: {
    gap: 8,
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
