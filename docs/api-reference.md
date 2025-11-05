# API & Component Reference

This document describes every public-facing API route, React provider, hook, state store, UI component, and utility exported by the Gaming Haven Z codebase. Each entry links back to the source module, outlines its role, and shows example usage patterns.

> Paths in this guide are shown relative to the project root (`/workspace`).

## Environment & Prerequisites
- `TWITCH_CLIENT_ID` and `TWITCH_CLIENT_SECRET` must be present in the runtime environment so the IGDB client in `src/lib/igdb.ts` can mint OAuth tokens.
- All API routes respond with JSON and expect to run within the Next.js 13 App Router environment.
- UI examples assume Material UI (MUI) styles are available through the existing theme defined in `src/app/layout.tsx`.

## HTTP API Routes

### `GET /api/games`
- **Source:** `src/app/api/games/route.ts`
- **Description:** Performs a text search against IGDB and returns up to 20 matching games.
- **Query Parameters:**
  - `q` *(optional, string)* – Search term. Defaults to `"zelda"` when omitted.
- **Success Response:** `200 OK` with an array of IGDB game objects (`id`, `name`, `summary`, `cover.url`).
- **Error Responses:** `500` with `{ error: string }` when the upstream IGDB request fails.

```bash
curl "http://localhost:3000/api/games?q=metroid"
```

```ts
const res = await fetch('/api/games?q=final fantasy');
if (!res.ok) throw new Error('Search failed');
const games = await res.json();
```

### `GET /api/games/[id]`
- **Source:** `src/app/api/games/[id]/route.ts`
- **Description:** Fetches a single game by IGDB identifier and expands related entities.
- **Route Parameters:**
  - `id` *(required, number)* – IGDB game identifier.
- **Success Response:** `200 OK` with a detailed game object (screenshots, platforms, similar games, etc.).
- **Error Responses:**
  - `400` when the `id` parameter is missing.
  - `404` when IGDB returns no data for the requested ID.
  - `500` for unexpected errors.

```bash
curl "http://localhost:3000/api/games/7346" | jq
```

### `GET /api/games/popular`
- **Source:** `src/app/api/games/popular/route.ts`
- **Description:** Returns highly rated games sorted by IGDB popularity.
- **Query Parameters:**
  - `limit` *(optional, number)* – Number of games to return. Defaults to `20`.
- **Success Response:** `200 OK` with an array containing rating metadata.
- **Error Response:** `500` with `{ error: "Failed to fetch popular games" }`.

```ts
const res = await fetch('/api/games/popular?limit=12');
const popular = await res.json();
```

### `GET /api/games/trending`
- **Source:** `src/app/api/games/trending/route.ts`
- **Description:** Lists recent releases with strong ratings, ordered by rating.
- **Query Parameters:**
  - `limit` *(optional, number)* – Defaults to `20`.
- **Success Response:** `200 OK` with an array containing rating and first-release information.
- **Error Response:** `500` with `{ error: "Failed to fetch trending games" }`.

```ts
const res = await fetch('/api/games/trending?limit=8');
const trending = await res.json();
```

## React Context Providers

### `SearchProvider` & `useSearch`
- **Source:** `src/context/SearchContext.tsx`
- **Purpose:** Stores the active search query, fetch status, and result list that power the header combobox.
- **Context Value:**
  - `searchQuery: string`
  - `setSearchQuery(query: string): void`
  - `games: Game[]`
  - `loading: boolean`
  - `error: string | null`
  - `searchGames(query: string): Promise<void>` – Debounced fetch called by UI.
- **Usage:** Wrap any component tree that needs search state with `SearchProvider`. Inside, call `useSearch()`.

```tsx
import { SearchProvider, useSearch } from '@/context/SearchContext';

function SearchBar() {
  const { searchQuery, setSearchQuery, games, searchGames } = useSearch();
  // ...render MUI TextField with suggestions...
}

<SearchProvider>
  <SearchBar />
</SearchProvider>
```

### `ToastProvider` & `useToastContext`
- **Source:** `src/context/ToastContext.tsx`
- **Purpose:** Centralizes toast notifications using the `useToast` hook and renders `ToastContainer`.
- **Context Value:**
  - `showGameCollected(gameName: string): void`
  - `showGameRemoved(gameName: string): void`
  - `showToast(toast: Omit<ToastData, 'id'>): void`
- **Usage:** Wrap UI with `ToastProvider`, then use `useToastContext()` to trigger notifications.

```tsx
import { ToastProvider, useToastContext } from '@/context/ToastContext';

function CollectButton({ game }) {
  const { showGameCollected } = useToastContext();
  return (
    <button onClick={() => showGameCollected(game.name)}>Collect</button>
  );
}

<ToastProvider>
  <CollectButton game={game} />
</ToastProvider>
```

## Hooks

### `useGameSearch`
- **Source:** `src/hooks/useGameSearch.ts`
- **Returns:** `{ games, loading, error, searchGames }`
- **Behavior:** Manages search results and status flags for ad-hoc use outside the `SearchContext` provider.
- **Usage Example:**

```tsx
const { games, searchGames, loading } = useGameSearch();
useEffect(() => {
  searchGames('metroid prime');
}, [searchGames]);
```

### `usePopularGames`
- **Source:** `src/hooks/usePopularGames.ts`
- **Signature:** `usePopularGames(limit?: number)`
- **Returns:** `{ games, loading, error }`
- **Behavior:** Fetches `/api/games/popular` on mount and whenever `limit` changes.
- **Usage Example:**

```tsx
const { games: popular, loading } = usePopularGames(10);
```

### `useToast`
- **Source:** `src/hooks/useToast.ts`
- **Returns:** `{ toasts, showToast, removeToast, showGameCollected, showGameRemoved }`
- **Behavior:** Local toast state manager used by `ToastProvider`. You can also consume it directly for isolated toast stacks.

```tsx
const { showToast } = useToast();
showToast({ type: 'success', title: 'Saved', message: 'Game stored', position: 'center' });
```

## State Store

### `useGameStore`
- **Source:** `src/store/gameStore.ts`
- **Powered by:** Zustand with `persist` middleware (`localStorage` key: `game-storage`).
- **State Slices:**
  - `lastAdded: CollectedGame[]`
  - `newest: CollectedGame[]`
  - `oldest: CollectedGame[]`
- **Actions:**
  - `addGame(game: Omit<CollectedGame, 'collectedAt'>): void`
  - `removeGame(gameId: number): void`
  - `isGameCollected(gameId: number): boolean`
  - `getGamesByFilter(filter: 'lastAdded' | 'newest' | 'oldest'): CollectedGame[]`

```tsx
import { useGameStore } from '@/store/gameStore';

const addToCollection = () => {
  const addGame = useGameStore.getState().addGame;
  addGame({ id: 123, name: 'Hollow Knight' });
};

const collected = useGameStore((state) => state.getGamesByFilter('lastAdded'));
```

## UI Components

### `SearchHeader`
- **Source:** `src/components/SearchHeader.tsx`
- **Props:** `{ children: React.ReactNode }`
- **Behavior:** Renders the top gradient header with back navigation, brand mark, and `SearchCombobox`. Automatically adapts to home vs. detail pages.
- **Usage:** Wrapped around page content in `src/app/layout.tsx`.

### `SearchCombobox`
- **Source:** `src/components/SearchCombobox.tsx`
- **Props:** `{ placeholder?: string }`
- **Behavior:** Displays a debounced search input backed by `useSearch`. Shows live results, loading state, and empty-state messaging.
- **Usage Example:**

```tsx
<SearchCombobox placeholder="Find RPGs..." />
```

### `CollectedGamesGrid`
- **Source:** `src/components/CollectedGamesGrid.tsx`
- **Props:**
  - `collectedGames: CollectedGame[]`
  - `activeFilter: 'Last added' | 'Newest' | 'Oldest'`
  - `handleGameClick(gameId: number): void`
  - `handleRemoveGame(gameId: number, gameName: string): void`
  - `loading?: boolean`
- **Behavior:** Grid layout that shows skeletons during load, empty states, and interactive cards with remove buttons.

```tsx
<CollectedGamesGrid
  collectedGames={games}
  activeFilter="Last added"
  handleGameClick={(id) => router.push(`/game/${id}`)}
  handleRemoveGame={(id, name) => removeGame(id)}
  loading={false}
/>
```

### `HomeClient`
- **Source:** `src/components/HomeClient.tsx`
- **Behavior:** Client-side wrapper for the home page that drives filter state, skeleton loading, and uses `CollectedGamesGrid`.
- **Note:** This is embedded on the root route and generally not reused elsewhere.

### `ScreenshotModal`
- **Source:** `src/components/ScreenshotModal.tsx`
- **Props:** `{ open: boolean; onClose(): void; imageUrl: string }`
- **Behavior:** MUI `Modal` wrapper that centers a responsive `next/image` screenshot.

```tsx
<ScreenshotModal open={isOpen} onClose={() => setOpen(false)} imageUrl={selectedUrl} />
```

### `Toast`
- **Source:** `src/components/Toast.tsx`
- **Props:** `{ type, title, message, position, onClose, duration? }`
- **Behavior:** Animates in/out with configurable position (`center`, `bottom-left`, `bottom-right`) and auto-dismiss timer.

### `ToastContainer`
- **Source:** `src/components/ToastContainer.tsx`
- **Props:** `{ toasts: ToastData[]; onRemoveToast(id: string): void }`
- **Behavior:** Iterates active toasts and renders `Toast` components. Usually consumed through `ToastProvider`.

## Utility Modules

### Color Constants (`src/lib/constants/colors.ts`)
- Palette tokens used throughout MUI components, e.g. `PURPLE`, `BLACK_TRANSPARENT`, `GRAY_LIGHT`.
- Import and reuse instead of hardcoding hex values.

```ts
import { PURPLE, WHITE } from '@/lib/constants/colors';
```

### Game Constants (`src/lib/constants/game.ts`)
- `IGDB_BASE_URL`: Base path for IGDB REST calls.
- `FILTER_OPTIONS`: Mapping of internal filter keys to display names.
- `RATING_THRESHOLDS`: Numeric breakpoints for badge copy.
- `IMAGE_SIZES`: IGDB image size identifiers.
- `GAME_FIELDS`: Canonical comma-delimited field list for IGDB queries.

### Type Definitions (`src/lib/types/game.ts`)
- `IGDBGame`: Exhaustive IGDB game shape.
- `CollectedGame`: Extends `IGDBGame` with `collectedAt` timestamp.
- `FilterType`, `GameStore`: Shared contracts for the Zustand store implementation.

### Date Helpers
- **Source:** `src/lib/utils/date.ts`
  - `formatDateMMDDYYYY(timestamp: number): string`
- **Source:** `src/lib/utils/dateUtils.ts`
  - `formatDate(timestamp?: number): string`
  - `formatDateTime(timestamp?: number): string`
  - `getRelativeTime(timestamp?: number): string`

```ts
formatDate(1682476800); // "Apr 25, 2023"
getRelativeTime(1672444800); // "1 years ago"
```

### String Helpers (`src/lib/utils/stringUtils.ts`)
- `truncateString(str, maxLength)`
- `capitalizeWords(str)`
- `createSlug(str)`
- `formatRating(rating?)`

```ts
truncateString('The Legend of Zelda: Breath of the Wild', 20); // "The Legend of Ze..."
formatRating(88); // "88/100 (Very Good)"
```

## IGDB Client (`src/lib/igdb.ts`)
- `searchGames(query: string)` – Calls IGDB `search` with default field selection.
- `getPopularGames(limit?: number)` – Popularity-focused query with rating filters.
- `getTrendingGames(limit?: number)` – Recent releases sorted by rating.
- `getGameDetails(gameId: number)` – Expands related entities for detail view.
- All helpers internally obtain and cache an OAuth token via Twitch.

```ts
const result = await getGameDetails(7346);
```

## Page-Level Components
- `src/app/page.tsx`: Client entry for the home view. Combines `useGameStore`, `useToastContext`, and `CollectedGamesGrid` to manage the saved games catalogue.
- `src/app/game/[id]/page.tsx`: Dynamic game detail page. Fetches `/api/games/[id]`, displays metadata, allows users to collect games, and surfaces `ScreenshotModal`.

These files are good references for end-to-end usage of the APIs, hooks, providers, and components documented above.

## Recommended Composition

The default layout (`src/app/layout.tsx`) demonstrates how to wire the providers and header globally:

```tsx
<ThemeProvider theme={theme}>
  <SearchProvider>
    <ToastProvider>
      <SearchHeader>
        {children}
      </SearchHeader>
    </ToastProvider>
  </SearchProvider>
</ThemeProvider>
```

Use this pattern whenever rendering pages that depend on search or toast functionality.

