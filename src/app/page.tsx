"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { DeleteOutline } from "@mui/icons-material";
import { useGameStore, type CollectedGame } from "../store/gameStore";
import { useRouter } from "next/navigation";
import { useToastContext } from "../context/ToastContext";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<"Last added" | "Newest" | "Oldest">("Last added");
  const { getGamesByFilter, removeGame } = useGameStore();
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
    <Container maxWidth="lg" sx={{ pt: 6, position: 'relative', justifyContent: 'center' }}>
      {/* Games Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#6727A6',
            textAlign: 'center',
            mb: 2
          }}
        >
          Saved games
        </Typography>
        {/* Filter Chips */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, ml: 0.5 }}>
          {(["Last added", "Newest", "Oldest"] as const).map((filter) => {
            const filterLabels = {
              "Last added": "Last added",
              "Newest": "Newest",
              "Oldest": "Oldest"
            };
            return (
              <Chip
                key={filter}
                label={filterLabels[filter]}
                onClick={() => setActiveFilter(filter)}
                sx={{
                  backgroundColor: activeFilter === filter ? '#6727A6' : 'white',
                  color: activeFilter === filter ? 'white' : '#6727A6',
                  fontWeight: 600,
                  fontSize: 15,
                  px: 2.5,
                  height: 36,
                  boxShadow: activeFilter === filter ? '0 2px 8px 0 rgba(103,39,166,0.10)' : 'none',
                  '&:hover': {
                    backgroundColor: activeFilter === filter ? '#5A1F8B' : '#F0F0F0',
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Show collected games or empty state */}
        {collectedGames.length > 0 ? (
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            {collectedGames.map((game: CollectedGame) => (
              <Grid key={game?.id} item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    width: 220,
                    borderRadius: 3,
                    position: 'relative',
                    cursor: 'pointer',
                    mx: 'auto',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease',
                    }
                  }}
                  onClick={() => handleGameClick(game.id)}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 270,
                      backgroundColor: '#E0E0E0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '14px',
                      backgroundImage: game.cover?.url ? 
                        `url(https:${game.cover.url.replace('t_thumb', 't_cover_big')})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!game.cover?.url ? 'Game Image' : ''}
                  </CardMedia>
                  {/* Show release year for newest/oldest filters */}
                  {(activeFilter === "Newest" || activeFilter === "Oldest") && game.first_release_date && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 40,
                        left: 4,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: 1,
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {new Date(game.first_release_date * 1000).getFullYear()}
                    </Box>
                  )}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        backgroundColor: 'white',
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveGame(game.id, game.name);
                    }}
                  >
                    <DeleteOutline sx={{ fontSize: 20 }} />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', p: 8 }}>
            <Typography sx={{ color: '#000', fontSize: '18px', mb: 2, fontWeight: 'bold' }}>
              Nothing collected yet
            </Typography>
            <Typography sx={{ color: '#000', fontSize: '14px' }}>
              Here you will see your collected games
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
