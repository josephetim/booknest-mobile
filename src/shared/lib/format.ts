export function extractOpenLibraryId(key?: string | null) {
  if (!key) {
    return null;
  }

  const trimmedKey = key.trim();
  const segments = trimmedKey.split('/');
  const candidate = segments[segments.length - 1];

  return candidate || null;
}

export function parseOpenLibraryText(
  value?: string | { value?: string | null } | null,
) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value.trim() || null;
  }

  return value.value?.trim() || null;
}

export function parseYear(value?: string | number | null) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (!value) {
    return undefined;
  }

  const match = String(value).match(/(\d{4})/);

  return match ? Number(match[1]) : undefined;
}

const LANGUAGE_LABELS: Record<string, string> = {
  eng: 'English',
  fre: 'French',
  ger: 'German',
  spa: 'Spanish',
  ita: 'Italian',
  por: 'Portuguese',
  rus: 'Russian',
  jpn: 'Japanese',
  kor: 'Korean',
  zho: 'Chinese',
  ara: 'Arabic',
  hin: 'Hindi',
};

export function formatLanguageCode(code: string) {
  const normalized = code.replace('/languages/', '').trim().toLowerCase();

  return LANGUAGE_LABELS[normalized] ?? normalized.toUpperCase();
}

export function uniqueStrings(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value?.trim())))];
}

export function joinAuthors(authors: string[]) {
  return uniqueStrings(authors).join(', ');
}

export function formatProgress(progress: number) {
  return `${Math.round(progress)}%`;
}

export function formatUpdatedAt(value?: string) {
  if (!value) {
    return 'Just now';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function truncateText(value: string, maxLength = 180) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}…`;
}
