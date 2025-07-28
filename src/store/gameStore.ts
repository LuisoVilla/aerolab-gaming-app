import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CollectedGame {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
  rating?: number;
  first_release_date?: number;
  involved_companies?: Array<{
    company: {
      name: string;
    };
  }>;
  genres?: Array<{
    name: string;
  }>;
  collectedAt: number; // timestamp when the game was collected
}

interface GameStore {
  lastAdded: CollectedGame[];
  newest: CollectedGame[];
  oldest: CollectedGame[];
  
  // Actions
  addGame: (game: Omit<CollectedGame, 'collectedAt'>) => void;
  removeGame: (gameId: number) => void;
  isGameCollected: (gameId: number) => boolean;
  getGamesByFilter: (filter: 'lastAdded' | 'newest' | 'oldest') => CollectedGame[];
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      lastAdded: [],
      newest: [],
      oldest: [],

      addGame: (game) => {
        const newGame: CollectedGame = {
          ...game,
          collectedAt: Date.now()
        };

        set((state) => {
          // Add to lastAdded (most recent first)
          const updatedLastAdded = [newGame, ...state.lastAdded.filter(g => g.id !== game.id)];

          // Sort by release date for newest (most recent release first)
          const updatedNewest = [...state.newest.filter(g => g.id !== game.id), newGame]
            .sort((a, b) => (b.first_release_date || 0) - (a.first_release_date || 0));

          // Sort by release date for oldest (oldest release first)
          const updatedOldest = [...state.oldest.filter(g => g.id !== game.id), newGame]
            .sort((a, b) => (a.first_release_date || 0) - (b.first_release_date || 0));

          return {
            lastAdded: updatedLastAdded,
            newest: updatedNewest,
            oldest: updatedOldest
          };
        });
      },

      removeGame: (gameId) => {
        set((state) => ({
          lastAdded: state.lastAdded.filter(g => g.id !== gameId),
          newest: state.newest.filter(g => g.id !== gameId),
          oldest: state.oldest.filter(g => g.id !== gameId)
        }));
      },

      isGameCollected: (gameId) => {
        const state = get();
        return state.lastAdded.some(g => g.id === gameId);
      },

      getGamesByFilter: (filter) => {
        const state = get();
        return state[filter];
      }
    }),
    {
      name: 'game-storage', // localStorage key
      partialize: (state) => ({
        lastAdded: state.lastAdded,
        newest: state.newest,
        oldest: state.oldest
      })
    }
  )
);
