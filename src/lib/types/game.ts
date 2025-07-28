/**
 * Type definitions for IGDB API responses
 */

export interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    id: number;
    url: string;
  };
  screenshots?: Array<{
    id: number;
    url: string;
  }>;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  platforms?: Array<{
    id: number;
    name: string;
  }>;
  first_release_date?: number;
  rating?: number;
  rating_count?: number;
  involved_companies?: Array<{
    id: number;
    company: {
      id: number;
      name: string;
    };
    developer: boolean;
    publisher: boolean;
  }>;
  storyline?: string;
  slug?: string;
}

export interface CollectedGame extends IGDBGame {
  collectedAt: string;
}

export type FilterType = 'lastAdded' | 'newest' | 'oldest';

export interface GameStore {
  collectedGames: CollectedGame[];
  currentFilter: FilterType;
  addGame: (game: IGDBGame) => void;
  removeGame: (gameId: number) => void;
  setFilter: (filter: FilterType) => void;
  getFilteredGames: () => CollectedGame[];
  isGameCollected: (gameId: number) => boolean;
}
