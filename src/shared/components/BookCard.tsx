import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CoverArt } from '@/src/shared/components/CoverArt';
import { ProgressBar } from '@/src/shared/components/ProgressBar';
import { SurfaceCard } from '@/src/shared/components/SurfaceCard';
import { formatProgress, joinAuthors } from '@/src/shared/lib/format';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

type BookCardProps = {
  title: string;
  subtitle?: string;
  authors: string[];
  firstPublishYear?: number;
  coverId?: number | null;
  coverEditionKey?: string | null;
  olid?: string | null;
  detailText?: string;
  badge?: string;
  progress?: number;
  variant?: 'list' | 'rail';
  onPress?: () => void;
  children?: ReactNode;
};

export function BookCard({
  title,
  subtitle,
  authors,
  firstPublishYear,
  coverId,
  coverEditionKey,
  olid,
  detailText,
  badge,
  progress,
  variant = 'list',
  onPress,
  children,
}: BookCardProps) {
  const theme = useAppTheme();
  const authorLine = joinAuthors(authors) || 'Unknown author';
  const metadata = [firstPublishYear ? String(firstPublishYear) : null, badge].filter(Boolean);

  if (variant === 'rail') {
    return (
      <SurfaceCard onPress={onPress} style={[styles.railCard, theme.shadows.card]}>
        <CoverArt
          borderRadius={22}
          coverEditionKey={coverEditionKey}
          coverId={coverId}
          height={200}
          olid={olid}
          title={title}
          width={144}
        />
        <View style={styles.railContent}>
          <Text numberOfLines={2} style={[theme.typography.heading, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text numberOfLines={1} style={[theme.typography.caption, { color: theme.colors.mutedText }]}>
            {authorLine}
          </Text>
          {detailText ? (
            <Text
              numberOfLines={2}
              style={[theme.typography.caption, { color: theme.colors.mutedText }]}>
              {detailText}
            </Text>
          ) : null}
          {typeof progress === 'number' ? (
            <View style={styles.progressGroup}>
              <Text style={[theme.typography.label, { color: theme.colors.accent }]}>
                Continue at {formatProgress(progress)}
              </Text>
              <ProgressBar value={progress} />
            </View>
          ) : null}
          {children}
        </View>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard onPress={onPress} style={theme.shadows.soft}>
      <View style={styles.row}>
        <CoverArt
          coverEditionKey={coverEditionKey}
          coverId={coverId}
          height={122}
          olid={olid}
          title={title}
          width={84}
        />
        <View style={styles.content}>
          <Text numberOfLines={2} style={[theme.typography.heading, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={1}
              style={[theme.typography.caption, { color: theme.colors.mutedText }]}>
              {subtitle}
            </Text>
          ) : null}
          <Text numberOfLines={2} style={[theme.typography.body, { color: theme.colors.text }]}>
            {authorLine}
          </Text>
          {metadata.length > 0 ? (
            <Text style={[theme.typography.caption, { color: theme.colors.mutedText }]}>
              {metadata.join('  •  ')}
            </Text>
          ) : null}
          {detailText ? (
            <Text
              numberOfLines={2}
              style={[theme.typography.caption, { color: theme.colors.mutedText }]}>
              {detailText}
            </Text>
          ) : null}
          {typeof progress === 'number' ? (
            <View style={styles.progressGroup}>
              <Text style={[theme.typography.label, { color: theme.colors.accent }]}>
                Reading progress {formatProgress(progress)}
              </Text>
              <ProgressBar value={progress} />
            </View>
          ) : null}
          {children}
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  content: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  railCard: {
    gap: 14,
    width: 176,
  },
  railContent: {
    gap: 6,
  },
  progressGroup: {
    gap: 8,
    marginTop: 4,
  },
});
