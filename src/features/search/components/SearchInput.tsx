import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

type SearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search books',
  autoFocus = false,
}: SearchInputProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <Ionicons color={theme.colors.mutedText} name="search-outline" size={20} />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.mutedText}
        style={[
          styles.input,
          theme.typography.body,
          {
            color: theme.colors.text,
            fontFamily: theme.fonts.sansMedium,
          },
        ]}
        value={value}
      />
      {value ? (
        <Pressable accessibilityRole="button" onPress={() => onChangeText('')}>
          <Ionicons color={theme.colors.mutedText} name="close-circle" size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});
