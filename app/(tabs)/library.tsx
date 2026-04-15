import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { SHELF_KEYS, SHELF_LABELS, type ShelfKey } from '@/src/features/shelves/models/local-shelf';
import { getShelfCounts, getShelfEntries } from '@/src/features/shelves/store/selectors';
import { useLibraryStore } from '@/src/features/shelves/store/library-store';
import { BookCard } from '@/src/shared/components/BookCard';
import { Chip } from '@/src/shared/components/Chip';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { SurfaceCard } from '@/src/shared/components/SurfaceCard';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';
import { truncateText } from '@/src/shared/lib/format';

export default function LibraryScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const [activeShelf, setActiveShelf] = useState<ShelfKey>('reading');
  const entries = useLibraryStore((state) => state.entries);
  const markViewed = useLibraryStore((state) => state.markViewed);
  const shelfEntries = useMemo(() => getShelfEntries({ entries }, activeShelf), [activeShelf, entries]);
  const shelfCounts = useMemo(() => getShelfCounts({ entries }), [entries]);

  return (
    <FlatList
      ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      ListEmptyComponent={
        <EmptyState
          actionLabel="Search books"
          body="Add a title to this shelf from the search or detail screens to keep it available offline."
          onAction={() => router.push('/search')}
          title={`No books in ${SHELF_LABELS[activeShelf]}`}
        />
      }
      ListHeaderComponent={
        <View style={styles.headerContent}>
          <SurfaceCard style={theme.shadows.soft}>
            <View style={styles.headerCard}>
              <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Your reading rooms</Text>
              <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
                Shelves stay available offline, including notes and progress for every saved book.
              </Text>
              <View style={styles.summaryRow}>
                {SHELF_KEYS.map((shelfKey) => (
                  <View
                    key={shelfKey}
                    style={[
                      styles.summaryPill,
                      {
                        backgroundColor: theme.colors.card,
                      },
                    ]}>
                    <Text style={[theme.typography.label, { color: theme.colors.accent }]}>
                      {SHELF_LABELS[shelfKey]}
                    </Text>
                    <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                      {shelfCounts[shelfKey]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </SurfaceCard>
          <View style={styles.filterRow}>
            {SHELF_KEYS.map((shelfKey) => (
              <Chip
                key={shelfKey}
                label={SHELF_LABELS[shelfKey]}
                onPress={() => setActiveShelf(shelfKey)}
                selected={activeShelf === shelfKey}
              />
            ))}
          </View>
        </View>
      }
      contentContainerStyle={styles.contentContainer}
      data={shelfEntries}
      keyExtractor={(item) => item.book.olid}
      renderItem={({ item }) => (
        <BookCard
          authors={item.book.authors}
          badge={SHELF_LABELS[item.shelf]}
          coverEditionKey={item.book.coverEditionKey}
          coverId={item.book.coverId}
          detailText={
            item.notes
              ? truncateText(item.notes, 120)
              : item.shelf === 'finished'
                ? 'Finished and saved locally.'
                : 'Tap in to update progress and notes.'
          }
          firstPublishYear={item.book.firstPublishYear}
          olid={item.book.olid}
          onPress={() => {
            markViewed(item.book);
            router.push(`/book/${item.book.olid}`);
          }}
          progress={item.progress}
          subtitle={item.book.subtitle}
          title={item.book.title}
        />
      )}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.colors.background }}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  headerCard: {
    gap: 12,
  },
  headerContent: {
    gap: 16,
    marginBottom: 18,
  },
  summaryPill: {
    borderRadius: 18,
    flex: 1,
    gap: 4,
    minWidth: 90,
    padding: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
