import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuthorProfile } from '@/src/features/authors/hooks/useAuthorProfile';
import { useLibraryStore } from '@/src/features/shelves/store/library-store';
import { snapshotFromAuthorWork } from '@/src/features/shelves/utils/book-snapshot';
import { BookCard } from '@/src/shared/components/BookCard';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { SurfaceCard } from '@/src/shared/components/SurfaceCard';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

export default function AuthorProfileScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id ?? '';
  const markViewed = useLibraryStore((state) => state.markViewed);
  const authorQuery = useAuthorProfile(id);

  if (!authorQuery.data && authorQuery.isPending) {
    return (
      <View style={[styles.loadingState, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  if (!authorQuery.data) {
    return (
      <View style={[styles.loadingState, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          actionLabel="Back to search"
          body="This author profile could not be loaded from Open Library."
          onAction={() => router.replace('/search')}
          title="Author unavailable"
        />
      </View>
    );
  }

  const author = authorQuery.data;

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.colors.background }}>
      <Stack.Screen
        options={{
          title: author.name,
        }}
      />
      <SurfaceCard style={theme.shadows.card}>
        <View style={styles.hero}>
          <Text style={[theme.typography.heading, { color: theme.colors.accent }]}>Author profile</Text>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>{author.name}</Text>
          <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
            {[author.birthDate, author.deathDate].filter(Boolean).join('  •  ') || 'Dates unavailable'}
          </Text>
          {author.topWork ? (
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>
              Often associated with: {author.topWork}
            </Text>
          ) : null}
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <View style={styles.section}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Biography</Text>
          <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
            {author.bio ?? 'No biography is available for this author in Open Library.'}
          </Text>
        </View>
      </SurfaceCard>

      <View style={styles.section}>
        <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Top works</Text>
        {author.works.length > 0 ? (
          author.works.map((work) => (
            <BookCard
              authors={[author.name]}
              coverId={work.coverId}
              firstPublishYear={work.firstPublishYear}
              key={work.olid}
              olid={work.olid}
              onPress={() => {
                markViewed(snapshotFromAuthorWork(work, author.name, author.id));
                router.push(`/book/${work.olid}`);
              }}
              title={work.title}
            />
          ))
        ) : (
          <EmptyState
            body="Open Library does not currently expose any works for this author."
            title="No works listed"
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 16,
    padding: 20,
    paddingBottom: 120,
  },
  hero: {
    gap: 10,
  },
  loadingState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  section: {
    gap: 14,
  },
});
