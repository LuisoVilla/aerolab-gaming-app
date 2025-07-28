'use client';

import { useState, useEffect } from 'react';

interface PopularGame {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    url: string;
  };
  rating?: number;
  rating_count?: number;
}

export function usePopularGames(limit: number = 20) {
  const [games, setGames] = useState<PopularGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/games/popular?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch popular games');
        }
        
        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching popular games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularGames();
  }, [limit]);

  return { games, loading, error };
}
