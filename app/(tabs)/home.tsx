import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useLibraryStore } from '@/src/features/shelves/store/library-store';
import { getContinueReading, getRecentlyViewed, getShelfCounts } from '@/src/features/shelves/store/selectors';
import { BookCard } from '@/src/shared/components/BookCard';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { Reveal } from '@/src/shared/components/Reveal';
import { SectionHeader } from '@/src/shared/components/SectionHeader';
import { SurfaceCard } from '@/src/shared/components/SurfaceCard';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';
import { truncateText } from '@/src/shared/lib/format';

export default function HomeScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const hasHydrated = useLibraryStore((state) => state.hasHydrated);
  const entries = useLibraryStore((state) => state.entries);
  const recentlyViewedEntries = useLibraryStore((state) => state.recentlyViewed);
  const markViewed = useLibraryStore((state) => state.markViewed);
  const continueReading = useMemo(() => getContinueReading({ entries }), [entries]);
  const recentlyViewed = useMemo(
    () => getRecentlyViewed({ recentlyViewed: recentlyViewedEntries }),
    [recentlyViewedEntries],
  );
  const shelfCounts = useMemo(() => getShelfCounts({ entries }), [entries]);

  const openBook = (olid: string, book: Parameters<typeof markViewed>[0]) => {
    markViewed(book);
    router.push(`/book/${olid}`);
  };

  if (!hasHydrated) {
    return (
      <View style={[styles.loadingState, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.accent} size="small" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.colors.background }}>
      <Reveal>
        <LinearGradient
          colors={[theme.colors.card, theme.colors.surface]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={[styles.hero, theme.shadows.card]}>
          <Text style={[theme.typography.label, { color: theme.colors.accent }]}>
            Curated for quiet hours
          </Text>
          <Text style={[theme.typography.hero, { color: theme.colors.text }]}>
            Find your next book-shaped obsession.
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
            Search Open Library, organize titles into shelves, and keep your reading notes close at hand.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/search')}
            style={[
              styles.heroButton,
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
              Start Discovering
            </Text>
          </Pressable>
        </LinearGradient>
      </Reveal>

      <Reveal delay={80}>
        <SurfaceCard style={theme.shadows.soft}>
          <View style={styles.insightHeader}>
            <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Shelves at a glance</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.mutedText }]}>
              Offline-ready and persisted locally
            </Text>
          </View>
          <View style={styles.countRow}>
            {[
              ['Want to Read', shelfCounts.wantToRead],
              ['Reading', shelfCounts.reading],
              ['Finished', shelfCounts.finished],
            ].map(([label, count]) => (
              <View
                key={label}
                style={[
                  styles.countCard,
                  {
                    backgroundColor: theme.colors.card,
                  },
                ]}>
                <Text style={[theme.typography.title, { color: theme.colors.text }]}>{count}</Text>
                <Text style={[theme.typography.caption, { color: theme.colors.mutedText }]}>{label}</Text>
              </View>
            ))}
          </View>
        </SurfaceCard>
      </Reveal>

      <Reveal delay={140} style={styles.section}>
        <SectionHeader
          actionLabel="Open library"
          onAction={() => router.push('/(tabs)/library')}
          title="Continue reading"
        />
        {continueReading.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalRail}>
              {continueReading.map((entry) => (
                <BookCard
                  authors={entry.book.authors}
                  badge={entry.book.editionCount ? `${entry.book.editionCount} editions` : undefined}
                  coverEditionKey={entry.book.coverEditionKey}
                  coverId={entry.book.coverId}
                  detailText={entry.notes ? truncateText(entry.notes, 70) : 'Progress and notes synced locally.'}
                  firstPublishYear={entry.book.firstPublishYear}
                  key={entry.book.olid}
                  olid={entry.book.olid}
                  onPress={() => openBook(entry.book.olid, entry.book)}
                  progress={entry.progress}
                  title={entry.book.title}
                  variant="rail"
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <EmptyState
            actionLabel="Find a book"
            body="Move a title into the Reading shelf and it will appear here with local progress tracking."
            onAction={() => router.push('/search')}
            title="Nothing in progress yet"
          />
        )}
      </Reveal>

      <Reveal delay={200} style={styles.section}>
        <SectionHeader actionLabel="Search" onAction={() => router.push('/search')} title="Recently viewed" />
        {recentlyViewed.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.horizontalRail}>
              {recentlyViewed.map((entry) => (
                <BookCard
                  authors={entry.book.authors}
                  coverEditionKey={entry.book.coverEditionKey}
                  coverId={entry.book.coverId}
                  detailText="Open details and save to a shelf."
                  firstPublishYear={entry.book.firstPublishYear}
                  key={entry.book.olid}
                  olid={entry.book.olid}
                  onPress={() => openBook(entry.book.olid, entry.book)}
                  title={entry.book.title}
                  variant="rail"
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <EmptyState
            body="Open a book from search or from your library and it will appear here for quick return visits."
            title="No recently viewed books"
          />
        )}
      </Reveal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 20,
    padding: 20,
    paddingBottom: 120,
  },
  countCard: {
    borderRadius: 20,
    flex: 1,
    gap: 4,
    minWidth: 92,
    padding: 14,
  },
  countRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  hero: {
    borderRadius: 32,
    gap: 14,
    padding: 24,
  },
  heroButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  horizontalRail: {
    flexDirection: 'row',
    gap: 14,
  },
  insightHeader: {
    gap: 4,
  },
  loadingState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    gap: 14,
  },
});
