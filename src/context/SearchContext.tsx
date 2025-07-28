'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface Game {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    url: string;
  };
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  games: Game[];
  loading: boolean;
  error: string | null;
  searchGames: (query: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchGames = useCallback(async (query: string) => {
    if (!query.trim()) {
      setGames([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/games?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search games');
      }

      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    searchQuery,
    setSearchQuery,
    games,
    loading,
    error,
    searchGames
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
