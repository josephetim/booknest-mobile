import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CoverSize } from '@/src/shared/lib/covers';
import { getPlaceholderLabel, resolveBookCover } from '@/src/shared/lib/covers';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

type CoverArtProps = {
  title: string;
  coverId?: number | null;
  coverEditionKey?: string | null;
  olid?: string | null;
  width?: number;
  height?: number;
  size?: CoverSize;
  borderRadius?: number;
};

export function CoverArt({
  title,
  coverId,
  coverEditionKey,
  olid,
  width = 96,
  height = 144,
  size = 'M',
  borderRadius = 20,
}: CoverArtProps) {
  const theme = useAppTheme();
  const [didFail, setDidFail] = useState(false);
  const cover = useMemo(
    () => resolveBookCover({ title, coverId, coverEditionKey, olid }, size),
    [coverEditionKey, coverId, olid, size, title],
  );

  const frameStyle = {
    borderRadius,
    height,
    width,
  };

  const placeholderLabel =
    cover.type === 'placeholder' ? cover.label : getPlaceholderLabel(title);

  if (didFail || cover.type === 'placeholder') {
    return (
      <LinearGradient
        colors={[theme.colors.placeholderStrong, theme.colors.placeholder]}
        style={[styles.placeholder, frameStyle]}
        testID="cover-placeholder">
        <View
          style={[
            styles.placeholderInset,
            {
              borderColor: theme.colors.elevated,
            },
          ]}>
          <Text style={[styles.placeholderLabel, { color: theme.colors.accentText }]}>
            {placeholderLabel}
          </Text>
          <Text
            style={[
              theme.typography.label,
              styles.placeholderBrand,
              { color: theme.colors.accentText },
            ]}>
            BookNest
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <Image
      accessibilityLabel={`${title} cover`}
      contentFit="cover"
      onError={() => setDidFail(true)}
      source={{ uri: cover.uri }}
      style={[
        styles.image,
        frameStyle,
        {
          backgroundColor: theme.colors.card,
        },
      ]}
      transition={220}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
  },
  placeholder: {
    overflow: 'hidden',
  },
  placeholderInset: {
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'space-between',
    margin: 6,
    padding: 12,
  },
  placeholderLabel: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 26,
  },
  placeholderBrand: {
    letterSpacing: 0.8,
  },
});
