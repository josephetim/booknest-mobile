import { useMemo } from 'react';
import { useColorScheme, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SettingsActionCard } from '@/src/features/settings/components/SettingsActionCard';
import { getShelfCounts } from '@/src/features/shelves/store/selectors';
import { useLibraryStore } from '@/src/features/shelves/store/library-store';
import { SurfaceCard } from '@/src/shared/components/SurfaceCard';
import { useAppTheme } from '@/src/shared/hooks/useAppTheme';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const colorScheme = useColorScheme();
  const entries = useLibraryStore((state) => state.entries);
  const clearLibrary = useLibraryStore((state) => state.clearLibrary);
  const clearViewed = useLibraryStore((state) => state.clearViewed);
  const resetDemo = useLibraryStore((state) => state.resetDemo);
  const shelfCounts = useMemo(() => getShelfCounts({ entries }), [entries]);

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.colors.background }}>
      <SurfaceCard style={theme.shadows.soft}>
        <View style={styles.hero}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            BookNest remembers locally
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
            Shelves, notes, progress, and recently viewed titles live in AsyncStorage so your personal library is still useful when the network is not.
          </Text>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.metaPill,
                {
                  backgroundColor: theme.colors.card,
                },
              ]}>
              <Text style={[theme.typography.label, { color: theme.colors.accent }]}>Appearance</Text>
              <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                {colorScheme === 'dark' ? 'Dark' : 'Light'} mode
              </Text>
            </View>
            <View
              style={[
                styles.metaPill,
                {
                  backgroundColor: theme.colors.card,
                },
              ]}>
              <Text style={[theme.typography.label, { color: theme.colors.accent }]}>Saved books</Text>
              <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                {shelfCounts.wantToRead + shelfCounts.reading + shelfCounts.finished}
              </Text>
            </View>
          </View>
        </View>
      </SurfaceCard>

      <SettingsActionCard
        actionLabel="Reset demo shelves"
        body="Restore the sample Want to Read, Reading, and Finished books so the app always has a clean first-run library."
        onPress={resetDemo}
        title="Demo data strategy"
      />
      <SettingsActionCard
        actionLabel="Clear viewed history"
        body="Remove the locally cached recently viewed rail without affecting your shelves."
        onPress={clearViewed}
        title="Recently viewed"
      />
      <SettingsActionCard
        actionLabel="Clear local library"
        body="Remove shelf assignments, progress, and notes from this device. The app will not auto-reseed after clearing."
        onPress={clearLibrary}
        title="Library reset"
        tone="danger"
      />

      <SurfaceCard>
        <View style={styles.notesCard}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Endpoint notes</Text>
          <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
            Search uses Open Library Search API with title or author queries.
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
            Book details use work and work-editions endpoints so edition counts and languages are available without scraping.
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.mutedText }]}>
            Author pages use author and author-works endpoints, and cover images use the Covers API.
          </Text>
        </View>
      </SurfaceCard>
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
    gap: 12,
  },
  metaPill: {
    borderRadius: 18,
    flex: 1,
    gap: 4,
    minWidth: 120,
    padding: 14,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  notesCard: {
    gap: 10,
  },
});
