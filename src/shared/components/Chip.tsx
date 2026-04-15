import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  subtle?: boolean;
};

export function Chip({ label, selected = false, onPress, subtle = false }: ChipProps) {
  const theme = useAppTheme();

  const content = (
    <View
      style={[
        styles.base,
        {
          backgroundColor: selected
            ? theme.colors.accent
            : subtle
              ? theme.colors.card
              : theme.colors.elevated,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
        },
      ]}>
      <Text
        style={[
          styles.label,
          theme.typography.label,
          {
            color: selected ? theme.colors.accentText : theme.colors.text,
            fontFamily: selected ? theme.fonts.sansBold : theme.fonts.sansMedium,
          },
        ]}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    textTransform: 'uppercase',
  },
});
