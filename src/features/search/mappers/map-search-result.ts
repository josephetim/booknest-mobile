import type {
  OpenLibrarySearchDoc,
  RemoteSearchBook,
} from '@/src/features/search/models/search-book';
import { extractOpenLibraryId, uniqueStrings } from '@/src/shared/lib/format';

export function mapSearchResult(doc: OpenLibrarySearchDoc): RemoteSearchBook | null {
  const olid = extractOpenLibraryId(doc.key);

  if (!olid || !doc.title) {
    return null;
  }

  return {
    olid,
    title: doc.title,
    subtitle: doc.subtitle,
    authors: uniqueStrings(doc.author_name ?? []),
    authorIds: uniqueStrings(doc.author_key ?? []),
    coverId: doc.cover_i,
    coverEditionKey: doc.cover_edition_key,
    firstPublishYear: doc.first_publish_year,
    editionCount: doc.edition_count,
    languages: uniqueStrings(doc.language ?? []),
  };
}
