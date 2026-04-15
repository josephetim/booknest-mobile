import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

type MetadataRowProps = {
  label: string;
  value: string;
};

export function MetadataRow({ label, value }: MetadataRowProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      <Text style={[theme.typography.label, { color: theme.colors.mutedText }]}>{label}</Text>
      <Text style={[theme.typography.body, styles.value, { color: theme.colors.text }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 6,
    paddingVertical: 12,
  },
  value: {
    fontFamily: 'Manrope_500Medium',
  },
});
