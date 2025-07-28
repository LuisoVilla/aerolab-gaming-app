"use client";

import { 
  Box, 
  Typography, 
  Container, 
  Chip,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Skeleton
} from "@mui/material";
import { useState } from "react";
import { BookmarkBorder, DeleteOutline, Star } from "@mui/icons-material";
import { Swords } from "lucide-react";
import { useSearch } from "../context/SearchContext";
import { useGameStore, type CollectedGame } from "../store/gameStore";
import { useRouter } from "next/navigation";

interface Game {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    url: string;
  };
  rating?: number;
  rating_count?: number;
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<"Last added" | "Newest" | "Oldest">("Last added");
  const { searchQuery, games, loading, error } = useSearch();
  const { getGamesByFilter, removeGame, addGame, isGameCollected } = useGameStore();
  const router = useRouter();

  // Get collected games based on active filter
  const filterMapping = {
    "Last added": "lastAdded" as const,
    "Newest": "newest" as const,
    "Oldest": "oldest" as const
  };
  
  const collectedGames = getGamesByFilter(filterMapping[activeFilter]);

  // Only show search results when there's a search query
  const shouldShowSearchResults = searchQuery && searchQuery.trim().length > 0;
  const shouldShowSkeletons = shouldShowSearchResults && loading;

  // Helper function to format date
  const formatDate = (timestamp?: number): string => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleGameClick = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  const handleRemoveGame = (gameId: number) => {
    removeGame(gameId);
  };

  const handleAddGame = (game: Game) => {
    addGame({
      id: game.id,
      name: game.name,
      cover: game.cover,
      rating: game.rating,
      first_release_date: undefined, // Los resultados de búsqueda no incluyen fecha de lanzamiento
      involved_companies: undefined,
      genres: undefined
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #F4D4F7 0%, #E8C5E8 30%, rgba(255,255,255,0.8) 70%, #FFFFFF 100%)',
      position: 'relative'
    }}>
      <Container maxWidth="lg" sx={{ pt: 4, position: 'relative' }}>
      {/* Main Title */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <Box sx={{
            width: 80,
            height: 80,
            border: '3px solid #FF00AE',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 3,
            backgroundColor: 'transparent'
          }}>
            <Swords size={40} color="#8B5A96" />
          </Box>
          <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
              fontWeight: 'bold',
              color: '#8B5A96'
            }}
          >
            Gaming Haven Z
          </Typography>
        </Box>
      </Box>

        {/* Games Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#8B5A96',
              textAlign: 'center',
              mb: 3 
            }}
          >
            Saved games
          </Typography>
          
          {/* Filter Chips */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            {(["Last added", "Newest", "Oldest"] as const).map((filter) => (
              <Chip
                key={filter}
                label={filter}
                onClick={() => setActiveFilter(filter)}
                sx={{
                  backgroundColor: activeFilter === filter ? '#8B5A96' : 'white',
                  color: activeFilter === filter ? 'white' : '#8B5A96',
                  '&:hover': {
                    backgroundColor: activeFilter === filter ? '#7A4A86' : '#F0F0F0',
                  },
                }}
              />
            ))}
          </Box>

          {/* Show collected games or empty state */}
          {collectedGames.length > 0 ? (
            <Grid container spacing={3} justifyContent="center">
              {collectedGames.map((game: CollectedGame) => (
                <Grid key={game.id}>
                  <Card 
                    sx={{ 
                      width: 160,
                      borderRadius: 3,
                      position: 'relative',
                      cursor: 'pointer',
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
                        height: 220,
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
                     <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': {
                            backgroundColor: 'white',
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGame(game.id);
                        }}
                      >
                        <DeleteOutline sx={{ fontSize: 20 }} />
                      </IconButton>
                    <Box sx={{ p: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'medium',
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {game.name}
                      </Typography>
                      {/* Show rating if available */}
                      {game.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                          <Star sx={{ fontSize: 12, color: '#8B5A96', mr: 0.5 }} />
                          <Typography variant="caption" sx={{ color: '#8B5A96' }}>
                            {Math.round(game.rating)}
                          </Typography>
                        </Box>
                      )}
                      {/* Show release date for newest/oldest filters */}
                      {(activeFilter === "Newest" || activeFilter === "Oldest") && game.first_release_date && (
                        <Typography variant="caption" sx={{ color: '#999', display: 'block', textAlign: 'center' }}>
                          {formatDate(game.first_release_date)}
                        </Typography>
                      )}
                    </Box>
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

        {/* Search Results Section - Only show when searching */}
        {shouldShowSearchResults && (
          <Box sx={{ mb: 4, mt: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#8B5A96',
                textAlign: 'center',
                mb: 3 
              }}
            >
              Search Results
            </Typography>

            {/* Loading Skeletons */}
            {shouldShowSkeletons && (
              <Grid container spacing={3} justifyContent="center">
                {[...Array(8)].map((_, index) => (
                  <Grid key={index}>
                    <Card sx={{ width: 160, borderRadius: 3 }}>
                      <Skeleton variant="rectangular" width={160} height={220} />
                      <Box sx={{ p: 1 }}>
                        <Skeleton variant="text" width="80%" />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Error State */}
            {error && (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}

            {/* No Results */}
            {!loading && !error && games.length === 0 && (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <Typography sx={{ color: '#666' }}>
                  No games found for &ldquo;{searchQuery}&rdquo;
                </Typography>
              </Box>
            )}

            {/* Search Results Grid */}
            {!loading && !error && games.length > 0 && (
              <Grid container spacing={3} justifyContent="center">
                {games.map((game: Game) => {
                  const isCollected = isGameCollected(game.id);
                  
                  return (
                    <Grid key={game.id}>
                      <Card 
                        sx={{ 
                          width: 160,
                          borderRadius: 3,
                          position: 'relative',
                          cursor: 'pointer',
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
                            height: 220,
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
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: isCollected ? 'rgba(139,90,150,0.9)' : 'rgba(255,255,255,0.9)',
                            color: isCollected ? 'white' : 'inherit',
                            '&:hover': {
                              backgroundColor: isCollected ? 'rgba(139,90,150,1)' : 'white',
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCollected) {
                              handleRemoveGame(game.id);
                            } else {
                              handleAddGame(game);
                            }
                          }}
                        >
                          <BookmarkBorder sx={{ fontSize: 20 }} />
                        </IconButton>
                        <Box sx={{ p: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 'medium',
                              textAlign: 'center',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {game.name}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}
      </Box>
    </Container>
    </Box>
  );
}
