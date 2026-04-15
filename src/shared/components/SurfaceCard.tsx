import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { PropsWithChildren } from 'react';

import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

type SurfaceCardProps = PropsWithChildren<{
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}>;

export function SurfaceCard({ children, onPress, style }: SurfaceCardProps) {
  const theme = useAppTheme();

  const cardStyle = [
    styles.base,
    {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    theme.shadows.soft,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyle,
          {
            transform: [{ scale: pressed ? 0.985 : 1 }],
            opacity: pressed ? 0.96 : 1,
          },
        ]}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
});
