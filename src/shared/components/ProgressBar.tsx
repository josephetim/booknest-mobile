import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const theme = useAppTheme();
  const boundedValue = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.track, { backgroundColor: theme.colors.card }]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: theme.colors.accent,
            width: `${boundedValue}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
    height: '100%',
  },
});
