export type OpenLibraryAuthorResponse = {
  key?: string;
  name?: string;
  bio?: string | { value?: string | null } | null;
  birth_date?: string;
  death_date?: string;
  top_work?: string | null;
};

export type OpenLibraryAuthorWorksResponse = {
  entries?: Array<{
    key?: string;
    title?: string;
    covers?: number[];
    first_publish_date?: string;
    subjects?: string[];
  }>;
};

export type AuthorWorkSummary = {
  olid: string;
  title: string;
  coverId?: number;
  firstPublishYear?: number;
};

export type AuthorProfile = {
  id: string;
  name: string;
  bio?: string;
  birthDate?: string;
  deathDate?: string;
  topWork?: string;
  works: AuthorWorkSummary[];
};
