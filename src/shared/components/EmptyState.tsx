import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

type EmptyStateProps = {
  eyebrow?: string;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  eyebrow,
  title,
  body,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      {eyebrow ? (
        <Text style={[theme.typography.label, { color: theme.colors.accent }]}>{eyebrow}</Text>
      ) : null}
      <Text style={[theme.typography.heading, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>{body}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
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
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
