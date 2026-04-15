export type SearchMode = 'title' | 'author';

export type OpenLibrarySearchDoc = {
  key?: string;
  title?: string;
  subtitle?: string;
  author_name?: string[];
  author_key?: string[];
  cover_i?: number;
  cover_edition_key?: string;
  first_publish_year?: number;
  edition_count?: number;
  language?: string[];
};

export type OpenLibrarySearchResponse = {
  docs?: OpenLibrarySearchDoc[];
  numFound?: number;
};

export type RemoteSearchBook = {
  olid: string;
  title: string;
  subtitle?: string;
  authors: string[];
  authorIds: string[];
  coverId?: number;
  coverEditionKey?: string;
  firstPublishYear?: number;
  editionCount?: number;
  languages: string[];
};
