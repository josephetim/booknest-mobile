import type {
  AuthorProfile,
  AuthorWorkSummary,
  OpenLibraryAuthorResponse,
  OpenLibraryAuthorWorksResponse,
} from '@/src/features/authors/models/author';
import { extractOpenLibraryId, parseOpenLibraryText, parseYear } from '@/src/shared/lib/format';

function rankWorks(left: AuthorWorkSummary, right: AuthorWorkSummary) {
  const leftCoverScore = left.coverId ? 1 : 0;
  const rightCoverScore = right.coverId ? 1 : 0;

  if (leftCoverScore !== rightCoverScore) {
    return rightCoverScore - leftCoverScore;
  }

  if (left.firstPublishYear && right.firstPublishYear) {
    return left.firstPublishYear - right.firstPublishYear;
  }

  return left.title.localeCompare(right.title);
}

export function mapAuthorProfile(
  author: OpenLibraryAuthorResponse,
  worksResponse: OpenLibraryAuthorWorksResponse,
): AuthorProfile {
  const id = extractOpenLibraryId(author.key);

  if (!id || !author.name) {
    throw new Error('Open Library returned an invalid author payload.');
  }

  const works = (worksResponse.entries ?? [])
    .map<AuthorWorkSummary | null>((entry) => {
      const olid = extractOpenLibraryId(entry.key);

      if (!olid || !entry.title) {
        return null;
      }

      return {
        olid,
        title: entry.title,
        coverId: entry.covers?.[0],
        firstPublishYear: parseYear(entry.first_publish_date),
      };
    })
    .filter((work): work is AuthorWorkSummary => Boolean(work))
    .sort(rankWorks)
    .slice(0, 10);

  return {
    id,
    name: author.name,
    bio: parseOpenLibraryText(author.bio) ?? undefined,
    birthDate: author.birth_date,
    deathDate: author.death_date,
    topWork: author.top_work ?? undefined,
    works,
  };
}
