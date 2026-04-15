export type OpenLibraryWorkResponse = {
  key?: string;
  title?: string;
  subtitle?: string | null;
  description?: string | { value?: string | null } | null;
  covers?: number[];
  subjects?: string[];
  authors?: Array<{
    author?: {
      key?: string;
    };
  }>;
  first_publish_date?: string | null;
  languages?: Array<{
    key?: string;
  }>;
};

export type OpenLibraryWorkEditionsResponse = {
  size?: number;
  entries?: Array<{
    publish_date?: string;
    languages?: Array<{
      key?: string;
    }>;
  }>;
};

export type RemoteBookAuthor = {
  id: string;
  name: string;
};

export type RemoteBookDetail = {
  olid: string;
  title: string;
  subtitle?: string;
  authors: RemoteBookAuthor[];
  firstPublishYear?: number;
  subjects: string[];
  languages: string[];
  editionCount?: number;
  coverId?: number;
  coverEditionKey?: string;
  description?: string;
};
