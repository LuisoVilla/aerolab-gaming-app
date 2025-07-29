import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import CollectedGamesGrid from "./CollectedGamesGrid";
import {
  PURPLE,
  PURPLE_DARK,
  WHITE,
  GRAY_LIGHT
} from "../lib/constants/colors";
import { useGameStore } from "../store/gameStore";
import styles from "./HomeClient.module.css";

export default function HomeClient() {
  const [activeFilter, setActiveFilter] = useState<"Last added" | "Newest" | "Oldest">("Last added");
  const [loading, setLoading] = useState(true);
  const { getGamesByFilter, removeGame } = useGameStore();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filterMapping = {
    "Last added": "lastAdded" as const,
    "Newest": "newest" as const,
    "Oldest": "oldest" as const
  };
  const collectedGames = getGamesByFilter(filterMapping[activeFilter]);

  const handleRemoveGame = (gameId: number) => {
    removeGame(gameId);
    // Toast avoid for test
  };

  const handleGameClick = (gameId: number) => {
    // Navegation omited for test
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Saved games</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px', marginLeft: '4px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
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
      </div>
      <CollectedGamesGrid
        collectedGames={collectedGames}
        activeFilter={activeFilter}
        handleGameClick={handleGameClick}
        handleRemoveGame={handleRemoveGame}
        loading={loading}
      />
    </div>
  );
}
