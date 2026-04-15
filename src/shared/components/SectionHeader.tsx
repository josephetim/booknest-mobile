import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[theme.typography.heading, { color: theme.colors.text }]}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction}>
          <Text
            style={[
              theme.typography.label,
              {
                color: theme.colors.accent,
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
