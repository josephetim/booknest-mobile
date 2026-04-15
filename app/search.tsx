import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { SearchInput } from '@/src/features/search/components/SearchInput';
import { SearchModeToggle } from '@/src/features/search/components/SearchModeToggle';
import { useSearchBooks } from '@/src/features/search/hooks/useSearchBooks';
import type { SearchMode } from '@/src/features/search/models/search-book';
import { useLibraryStore } from '@/src/features/shelves/store/library-store';
import { snapshotFromSearchBook } from '@/src/features/shelves/utils/book-snapshot';
import { BookCard } from '@/src/shared/components/BookCard';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { SurfaceCard } from '@/src/shared/components/SurfaceCard';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';
import { useDebouncedValue } from '@/src/shared/hooks/useDebouncedValue';

export default function SearchScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const markViewed = useLibraryStore((state) => state.markViewed);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('title');
  const debouncedQuery = useDebouncedValue(query, 380);
  const searchQuery = useSearchBooks(debouncedQuery, mode);

  const trimmedQuery = debouncedQuery.trim();
  const hasQuery = trimmedQuery.length >= 2;
  const books = searchQuery.data ?? [];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: 'Discover',
          
        }}
      />
      <FlatList
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={
          hasQuery ? (
            searchQuery.isFetching ? (
              <View style={styles.centerState}>
                <ActivityIndicator color={theme.colors.accent} />
              </View>
            ) : searchQuery.isError ? (
              <EmptyState
                body="Open Library did not respond in time. Try another title, another author spelling, or retry in a moment."
                title="Search is unavailable right now"
              />
            ) : (
              <EmptyState
                body="Try a more specific title, switch to author mode, or shorten the query."
                title="No books matched that search"
              />
            )
          ) : (
            <EmptyState
              actionLabel="Try Pride and Prejudice"
              body="Search by title or author. Results come directly from Open Library and stay lightweight until you open a book."
              onAction={() => {
                setMode('title');
                setQuery('Pride and Prejudice');
              }}
              title="Start with a book or an author"
            />
          )
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <SurfaceCard style={theme.shadows.soft}>
              <View style={styles.heroCard}>
                <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
                  Search title or author
                </Text>
                <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
                  Debounced requests keep the interface responsive and avoid unnecessary API traffic.
                </Text>
                <SearchInput
                  autoFocus
                  onChangeText={setQuery}
                  placeholder={mode === 'title' ? 'Search by title' : 'Search by author'}
                  value={query}
                />
                <SearchModeToggle onChange={setMode} value={mode} />
              </View>
            </SurfaceCard>
          </View>
        }
        contentContainerStyle={styles.contentContainer}
        data={hasQuery ? books : []}
        keyExtractor={(item) => item.olid}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <BookCard
            authors={item.authors}
            badge={item.editionCount ? `${item.editionCount} editions` : undefined}
            coverEditionKey={item.coverEditionKey}
            coverId={item.coverId}
            firstPublishYear={item.firstPublishYear}
            olid={item.olid}
            onPress={() => {
              markViewed(snapshotFromSearchBook(item));
              router.push(`/book/${item.olid}`);
            }}
            subtitle={item.subtitle}
            title={item.title}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centerState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 18,
  },
  heroCard: {
    gap: 14,
  },
});
