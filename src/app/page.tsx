"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import CollectedGamesGrid from "../components/CollectedGamesGrid";
import {
  PURPLE,
  PURPLE_DARK,
  WHITE,
  GRAY_LIGHT
} from "../lib/constants/colors";
import { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { useRouter } from "next/navigation";
import { useToastContext } from "../context/ToastContext";

export default function Page() {
  const [activeFilter, setActiveFilter] = useState<"Last added" | "Newest" | "Oldest">("Last added");
  const [loading, setLoading] = useState(true);
  const { getGamesByFilter, removeGame } = useGameStore();
  // Limpiar el store de juegos al cargar la página para evitar datos cacheados
  useEffect(() => {
    // Simula carga de datos
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  const { showGameRemoved } = useToastContext();
  const router = useRouter();

  // Get collected games based on active filter
  const filterMapping = {
    "Last added": "lastAdded" as const,
    "Newest": "newest" as const,
    "Oldest": "oldest" as const
  };
  
  const collectedGames = getGamesByFilter(filterMapping[activeFilter]);

  // Only show search results when there's a search query

  const handleGameClick = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  const handleRemoveGame = (gameId: number, gameName: string) => {
    removeGame(gameId);
    showGameRemoved(gameName);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 2, position: 'relative', justifyContent: 'center' }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', color: PURPLE, textAlign: 'center', mb: 2 }}
        >
          Saved games
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mb: 4,
          ml: 0.5,
          position: { xs: 'sticky', md: 'relative' },
          top: { xs: 0, md: 'auto' },
          zIndex: 100,
          px: { xs: 2, md: 0 },
          py: { xs: 1, md: 0 },
          backgroundColor: 'transparent',
        }}
      >
        {(["Last added", "Newest", "Oldest"] as const).map((filter) => (
          <Chip
            key={filter}
            label={filter}
            onClick={() => setActiveFilter(filter)}
            sx={{
              backgroundColor: activeFilter === filter ? PURPLE : WHITE,
              color: activeFilter === filter ? WHITE : PURPLE,
              fontWeight: 600,
              fontSize: 15,
              px: 2.5,
              height: 36,
              boxShadow: activeFilter === filter ? `0 2px 8px 0 ${PURPLE}1A` : 'none',
              '&:hover': {
                backgroundColor: activeFilter === filter ? PURPLE_DARK : GRAY_LIGHT,
              },
            }}
          />
        ))}
      </Box>
      <Box sx={{ mb: 4 }}>
        <CollectedGamesGrid
          collectedGames={collectedGames}
          activeFilter={activeFilter}
          handleGameClick={handleGameClick}
          handleRemoveGame={handleRemoveGame}
          loading={loading}
        />
      </Box>
    </Container>
  );
}
