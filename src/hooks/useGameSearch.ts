// src/hooks/useGameSearch.ts
import { useState, useCallback } from 'react';

interface Game {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    url: string;
  };
}

export const useGameSearch = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchGames = useCallback(async (query: string) => {
    if (!query.trim()) {
      setGames([]);
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

  return {
    games,
    loading,
    error,
    searchGames
  };
};
