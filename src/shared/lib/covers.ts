import { OPEN_LIBRARY_COVERS_URL } from '@/src/shared/api/open-library';

export type CoverSize = 'S' | 'M' | 'L';

export type CoverInput = {
  title: string;
  coverId?: number | null;
  coverEditionKey?: string | null;
  olid?: string | null;
};

export type ResolvedCover =
  | {
      type: 'remote';
      uri: string;
    }
  | {
      type: 'placeholder';
      label: string;
    };

export function getCoverImageUrl(
  { coverId, coverEditionKey, olid }: Omit<CoverInput, 'title'>,
  size: CoverSize = 'M',
) {
  if (typeof coverId === 'number') {
    return `${OPEN_LIBRARY_COVERS_URL}/b/id/${coverId}-${size}.jpg`;
  }

  if (coverEditionKey) {
    return `${OPEN_LIBRARY_COVERS_URL}/b/olid/${coverEditionKey}-${size}.jpg`;
  }

  if (olid && /^OL\d+[WM]$/.test(olid)) {
    return `${OPEN_LIBRARY_COVERS_URL}/b/olid/${olid}-${size}.jpg`;
  }

  return null;
}

export function getPlaceholderLabel(title: string) {
  const words = title
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (words.length === 0) {
    return 'BN';
  }

  return words.map((word) => word[0]?.toUpperCase() ?? '').join('');
}

export function resolveBookCover(
  input: CoverInput,
  size: CoverSize = 'M',
): ResolvedCover {
  const uri = getCoverImageUrl(input, size);

  if (uri) {
    return {
      type: 'remote',
      uri,
    };
  }

  return {
    type: 'placeholder',
    label: getPlaceholderLabel(input.title),
  };
}
