import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useBookDetails } from '@/src/features/details/hooks/useBookDetails';
import { SHELF_KEYS, SHELF_LABELS } from '@/src/features/shelves/models/local-shelf';
import { getKnownBook } from '@/src/features/shelves/store/selectors';
import { useLibraryStore } from '@/src/features/shelves/store/library-store';
import { mergeBookSnapshot, snapshotFromRemoteBook } from '@/src/features/shelves/utils/book-snapshot';
import { Chip } from '@/src/shared/components/Chip';
import { CoverArt } from '@/src/shared/components/CoverArt';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { MetadataRow } from '@/src/shared/components/MetadataRow';
import { ProgressBar } from '@/src/shared/components/ProgressBar';
import { SurfaceCard } from '@/src/shared/components/SurfaceCard';
import { useDebouncedValue } from '@/src/shared/hooks/useDebouncedValue';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';
import { formatLanguageCode, formatProgress, joinAuthors } from '@/src/shared/lib/format';

export default function BookDetailScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ olid?: string | string[] }>();
  const olid = Array.isArray(params.olid) ? params.olid[0] : params.olid ?? '';
  const knownBook = useLibraryStore((state) => getKnownBook(state, olid));
  const entry = useLibraryStore((state) => state.entries[olid]);
  const saveBook = useLibraryStore((state) => state.saveBook);
  const removeBook = useLibraryStore((state) => state.removeBook);
  const updateProgress = useLibraryStore((state) => state.updateProgress);
  const updateNotes = useLibraryStore((state) => state.updateNotes);
  const markViewed = useLibraryStore((state) => state.markViewed);
  const bookQuery = useBookDetails(olid, knownBook);
  const displayBook = useMemo(() => mergeBookSnapshot(bookQuery.data, knownBook), [bookQuery.data, knownBook]);
  const [notesDraft, setNotesDraft] = useState(entry?.notes ?? '');
  const debouncedNotes = useDebouncedValue(notesDraft, 420);

  useEffect(() => {
    if (bookQuery.data) {
      markViewed(snapshotFromRemoteBook(bookQuery.data));
    }
  }, [bookQuery.data, markViewed]);

  useEffect(() => {
    setNotesDraft(entry?.notes ?? '');
  }, [entry?.notes]);

  useEffect(() => {
    if (entry && debouncedNotes !== entry.notes) {
      updateNotes(olid, debouncedNotes);
    }
  }, [debouncedNotes, entry, olid, updateNotes]);

  if (!displayBook && bookQuery.isPending) {
    return (
      <View style={[styles.loadingState, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  if (!displayBook) {
    return (
      <View style={[styles.loadingState, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          actionLabel="Search instead"
          body="This book could not be loaded from Open Library and no local snapshot was available."
          onAction={() => router.replace('/search')}
          title="Book unavailable"
        />
      </View>
    );
  }

  const authorLine = joinAuthors(displayBook.authors);

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.colors.background }}>
      <Stack.Screen
        options={{
          title: displayBook.title,
        }}
      />

      {bookQuery.isError && knownBook ? (
        <SurfaceCard style={{ borderColor: theme.colors.accentMuted }}>
          <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
            Online details are unavailable right now. Showing the best locally saved snapshot instead.
          </Text>
        </SurfaceCard>
      ) : null}

      <LinearGradient
        colors={[theme.colors.card, theme.colors.surface]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.hero, theme.shadows.card]}>
        <CoverArt
          borderRadius={26}
          coverEditionKey={displayBook.coverEditionKey}
          coverId={displayBook.coverId}
          height={220}
          olid={displayBook.olid}
          title={displayBook.title}
          width={152}
        />
        <View style={styles.heroText}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>{displayBook.title}</Text>
          {displayBook.subtitle ? (
            <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
              {displayBook.subtitle}
            </Text>
          ) : null}
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>{authorLine || 'Unknown author'}</Text>
          <View style={styles.metaWrap}>
            {displayBook.firstPublishYear ? (
              <Chip label={`First published ${displayBook.firstPublishYear}`} subtle />
            ) : null}
            {displayBook.editionCount ? <Chip label={`${displayBook.editionCount} editions`} subtle /> : null}
            {displayBook.languages.length > 0 ? (
              <Chip label={formatLanguageCode(displayBook.languages[0])} subtle />
            ) : null}
          </View>
          <View style={styles.authorRow}>
            {displayBook.authorIds.map((authorId, index) => {
              const name = displayBook.authors[index];

              if (!name) {
                return null;
              }

              if (!/^OL\d+A$/.test(authorId)) {
                return <Chip key={`${name}-${index}`} label={name} subtle />;
              }

              return (
                <Chip
                  key={authorId}
                  label={name}
                  onPress={() => router.push(`/author/${authorId}`)}
                  subtle
                />
              );
            })}
          </View>
        </View>
      </LinearGradient>

      <SurfaceCard>
        <View style={styles.cardSection}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Save to shelf</Text>
          <View style={styles.shelfRow}>
            {SHELF_KEYS.map((shelf) => (
              <Chip
                key={shelf}
                label={SHELF_LABELS[shelf]}
                onPress={() => saveBook(displayBook, shelf)}
                selected={entry?.shelf === shelf}
              />
            ))}
          </View>
          {entry ? (
            <Pressable accessibilityRole="button" onPress={() => removeBook(displayBook.olid)}>
              <Text style={[theme.typography.label, { color: theme.colors.danger }]}>Remove from library</Text>
            </Pressable>
          ) : (
            <Text style={[theme.typography.caption, { color: theme.colors.mutedText }]}>
              Add this book to a shelf to enable progress and notes.
            </Text>
          )}
        </View>
      </SurfaceCard>

      {entry ? (
        <SurfaceCard>
          <View style={styles.cardSection}>
            <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Reading progress</Text>
            <Text style={[theme.typography.label, { color: theme.colors.accent }]}>
              {formatProgress(entry.progress)}
            </Text>
            <ProgressBar value={entry.progress} />
            <Slider
              maximumTrackTintColor={theme.colors.border}
              maximumValue={100}
              minimumTrackTintColor={theme.colors.accent}
              minimumValue={0}
              onSlidingComplete={(value) => updateProgress(displayBook.olid, value)}
              step={1}
              thumbTintColor={theme.colors.accent}
              value={entry.progress}
            />
            <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Notes</Text>
            <TextInput
              multiline
              onChangeText={setNotesDraft}
              placeholder="Save page numbers, themes, or quotes worth coming back to."
              placeholderTextColor={theme.colors.mutedText}
              style={[
                styles.notesInput,
                theme.typography.body,
                {
                  backgroundColor: theme.colors.elevated,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  fontFamily: theme.fonts.sans,
                },
              ]}
              textAlignVertical="top"
              value={notesDraft}
            />
            <Text style={[theme.typography.caption, { color: theme.colors.mutedText }]}>
              Notes save automatically a moment after you stop typing.
            </Text>
          </View>
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <View style={styles.cardSection}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Description</Text>
          <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
            {displayBook.description ?? 'No description is available for this work in Open Library.'}
          </Text>
        </View>
      </SurfaceCard>

      {displayBook.subjects && displayBook.subjects.length > 0 ? (
        <SurfaceCard>
          <View style={styles.cardSection}>
            <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Subjects</Text>
            <View style={styles.subjectsWrap}>
              {displayBook.subjects.map((subject) => (
                <Chip key={subject} label={subject} subtle />
              ))}
            </View>
          </View>
        </SurfaceCard>
      ) : null}

      <SurfaceCard>
        <View style={styles.cardSection}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Metadata</Text>
          <MetadataRow label="Title" value={displayBook.title} />
          {displayBook.subtitle ? <MetadataRow label="Subtitle" value={displayBook.subtitle} /> : null}
          <MetadataRow label="Authors" value={authorLine || 'Unknown author'} />
          {displayBook.firstPublishYear ? (
            <MetadataRow label="First publish year" value={String(displayBook.firstPublishYear)} />
          ) : null}
          {displayBook.languages.length > 0 ? (
            <MetadataRow
              label="Language"
              value={displayBook.languages.map((language) => formatLanguageCode(language)).join(', ')}
            />
          ) : null}
          {displayBook.editionCount ? (
            <MetadataRow label="Edition count" value={String(displayBook.editionCount)} />
          ) : null}
        </View>
      </SurfaceCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  authorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cardSection: {
    gap: 12,
  },
  contentContainer: {
    gap: 16,
    padding: 20,
    paddingBottom: 120,
  },
  hero: {
    borderRadius: 32,
    gap: 18,
    padding: 20,
  },
  heroText: {
    gap: 10,
  },
  loadingState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  metaWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  notesInput: {
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 140,
    padding: 14,
  },
  shelfRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subjectsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
