# BookNest

BookNest is a warm editorial-style Expo app for discovering books from Open Library and tracking reading progress locally. It combines remote search and metadata with offline-friendly local shelves, notes, and recently viewed history.

## Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Zustand
- TanStack Query
- AsyncStorage
- Jest
- React Native Testing Library

## Run

```bash
npm install
npm run start
```

Useful scripts:

```bash
npm run typecheck
npm run test
```

## Screens

- `/(tabs)/home`
- `/search`
- `/book/[olid]`
- `/author/[id]`
- `/(tabs)/library`
- `/(tabs)/settings`

## Architecture

The app is organized by feature under `src/features` and by shared UI/theme utilities under `src/shared`.

- `src/features/search`
  Search models, mapping, API query, and input controls.
- `src/features/details`
  Book detail models, mapping, and work-detail fetching.
- `src/features/authors`
  Author profile models, mapping, and author-work fetching.
- `src/features/shelves`
  Local shelf models, demo seed data, reducer-style state helpers, selectors, and the persisted Zustand store.
- `src/features/settings`
  Settings-specific UI blocks.
- `src/shared`
  Theme tokens, reusable components, API helpers, debouncing, and formatting.

### Remote vs local models

Remote Open Library responses are kept separate from the app's local shelf model:

- Remote models live in `search/models`, `details/models`, and `authors/models`.
- Local persisted book snapshots live in `src/features/shelves/models/local-shelf.ts`.

This separation keeps API shape changes isolated from the offline shelf store and makes test coverage more focused.

### State and persistence

- Remote requests use TanStack Query.
- Local shelves, notes, progress, and recently viewed history use Zustand persisted to AsyncStorage.
- Home and Library screens are fully usable from local storage even when network requests fail.
- Book detail screens can fall back to locally saved snapshots if Open Library is unavailable.

### Demo data strategy

On the first hydration, BookNest seeds a small demo library if the device has no saved entries yet. The seed includes one item in each shelf so:

- the Home screen is not empty on first launch
- the Library screen demonstrates offline behavior immediately
- the progress and notes UI has a realistic example

Users can restore the demo shelves or clear the local library from Settings. Clearing the library does not auto-seed again, while Reset Demo explicitly restores the sample shelves.

## Endpoint notes

BookNest only requests what it needs for human-facing flows:

- Search API:
  `https://openlibrary.org/search.json?title=...` or `?author=...`
- Work details:
  `https://openlibrary.org/works/{olid}.json`
- Work editions summary:
  `https://openlibrary.org/works/{olid}/editions.json?limit=5`
- Author profile:
  `https://openlibrary.org/authors/{id}.json`
- Author works:
  `https://openlibrary.org/authors/{id}/works.json?limit=18`
- Covers:
  `https://covers.openlibrary.org/b/...`

The work editions endpoint is used so the detail screen can show edition counts and a lightweight language fallback without extra crawling.

## Testing

Included coverage focuses on the highest-risk logic:

- local shelf reducer-style actions and duplicate save handling
- progress clamping logic
- search result mapping from Open Library responses
- cover placeholder rendering when no cover data is available

## Notes

- Search is debounced before network requests are issued.
- Cover art gracefully falls back to a placeholder when Open Library has no usable cover identifier.
- Multiple authors are supported in search results and book details.
- Subject chips, notes, and progress are all safe when a book only exists locally.
