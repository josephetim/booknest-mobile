export const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org';
export const OPEN_LIBRARY_COVERS_URL = 'https://covers.openlibrary.org';

export async function fetchOpenLibraryJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${OPEN_LIBRARY_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Open Library request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export const openLibraryEndpoints = {
  search: (mode: 'title' | 'author', query: string, limit = 20) =>
    `/search.json?${mode}=${encodeURIComponent(query)}&limit=${limit}`,
  work: (olid: string) => `/works/${encodeURIComponent(olid)}.json`,
  workEditions: (olid: string, limit = 5) =>
    `/works/${encodeURIComponent(olid)}/editions.json?limit=${limit}`,
  author: (id: string) => `/authors/${encodeURIComponent(id)}.json`,
  authorWorks: (id: string, limit = 12) =>
    `/authors/${encodeURIComponent(id)}/works.json?limit=${limit}`,
};
