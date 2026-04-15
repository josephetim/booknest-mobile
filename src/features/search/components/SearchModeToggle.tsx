import { StyleSheet, View } from 'react-native';

import { Chip } from '@/src/shared/components/Chip';
import type { SearchMode } from '@/src/features/search/models/search-book';

type SearchModeToggleProps = {
  value: SearchMode;
  onChange: (mode: SearchMode) => void;
};

export function SearchModeToggle({ value, onChange }: SearchModeToggleProps) {
  return (
    <View style={styles.row}>
      <Chip label="Title" onPress={() => onChange('title')} selected={value === 'title'} />
      <Chip label="Author" onPress={() => onChange('author')} selected={value === 'author'} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
