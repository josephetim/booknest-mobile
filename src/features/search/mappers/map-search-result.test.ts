import { mapSearchResult } from '@/src/features/search/mappers/map-search-result';

describe('mapSearchResult', () => {
  it('maps Open Library search docs into the app search model', () => {
    const result = mapSearchResult({
      key: '/works/OL15165350W',
      title: 'Pride and Prejudice',
      author_name: ['Jane Austen', 'Jane Austen'],
      author_key: ['OL21594A'],
      cover_i: 13148521,
      cover_edition_key: 'OL43531166M',
      first_publish_year: 1813,
      edition_count: 133,
      language: ['eng', 'fre', 'eng'],
    });

    expect(result).toEqual({
      olid: 'OL15165350W',
      title: 'Pride and Prejudice',
      subtitle: undefined,
      authors: ['Jane Austen'],
      authorIds: ['OL21594A'],
      coverId: 13148521,
      coverEditionKey: 'OL43531166M',
      firstPublishYear: 1813,
      editionCount: 133,
      languages: ['eng', 'fre'],
    });
  });

  it('returns null for invalid documents', () => {
    expect(mapSearchResult({ title: 'Missing key' })).toBeNull();
  });
});
