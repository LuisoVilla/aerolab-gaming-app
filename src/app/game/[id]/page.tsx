"use client";

import { 
  Box, 
  Typography, 
  Container, 
  Button,
  Card,
  CardMedia,
  CircularProgress
} from "@mui/material";
import { Star, CalendarMonth, VideogameAsset } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "../../../store/gameStore";
import { useToastContext } from "../../../context/ToastContext";

interface Game {
  id: number;
  name: string;
  summary?: string;
  cover?: {
    url: string;
  };
  rating?: number;
  rating_count?: number;
  first_release_date?: number;
  involved_companies?: Array<{
    company: {
      name: string;
    };
  }>;
  genres?: Array<{
    name: string;
  }>;
  platforms?: Array<{
    name: string;
  }>;
  screenshots?: Array<{
    url: string;
  }>;
  similar_games?: Array<{
    id: number;
    name: string;
    cover?: {
      url: string;
    };
  }>;
}

// Helper function to format date
function formatDate(timestamp: number): string {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export default function GameDetail() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addGame, isGameCollected } = useGameStore();
  const { showGameCollected } = useToastContext();

  const gameId = params.id as string;
  const isCollected = game ? isGameCollected(game.id) : false;

  const handleCollectGame = () => {
    if (game) {
      addGame({
        id: game.id,
        name: game.name,
        cover: game.cover,
        rating: game.rating,
        first_release_date: game.first_release_date,
        involved_companies: game.involved_companies,
        genres: game.genres
      });
      
      // Mostrar toast de éxito
      showGameCollected(game.name);
    }
  };

  useEffect(() => {
    async function fetchGame() {
      if (!gameId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/games/${gameId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Game not found');
          } else {
            setError('Failed to fetch game details');
          }
          return;
        }

        const gameData = await response.json();
        setGame(gameData);
      } catch {
        setError('An error occurred while fetching game details');
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
  }, [gameId]);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ color: '#6727A6' }} size={60} />
      </Box>
    );
  }

  if (error || !game) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: '#6727A6', mb: 2 }}>
            {error === 'Game not found' ? 'Game Not Found' : 'Error Loading Game'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
            {error || 'The game you are looking for could not be found.'}
          </Typography>
          <Button 
            variant="contained"
            onClick={() => router.push('/')}
            sx={{ 
              backgroundColor: '#6727A6',
              '&:hover': { backgroundColor: '#5A1F8B' }
            }}
          >
            Back to Home
          </Button>
        </Container>
      </Box>
    );
  }

  // Extract data with fallbacks
  const title = game.name || "Unknown Game";
  const developer = game.involved_companies?.[0]?.company?.name || "Unknown Developer";
  const rating = game.rating ? Math.round(game.rating) : null;
  const releaseDate = formatDate(game.first_release_date || 0);
  const genres = game.genres?.map((g) => g.name).join(", ") || "Unknown Genre";
  const platforms = game.platforms?.map((p) => p.name).join(", ") || "Unknown Platforms";
  const summary = game.summary || "No summary available.";
  const coverUrl = game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big_2x')}` : null;
  const screenshots = game.screenshots?.slice(0, 5) || [];
  const similarGames = game.similar_games?.slice(0, 4) || [];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {/* Game Cover and Main Info */}
          <Box sx={{ minWidth: 300, flex: '0 0 auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Card sx={{ width: 250, mb: 3, borderRadius: 3 }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 350,
                    backgroundColor: '#E0E0E0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: '14px',
                    backgroundImage: coverUrl ? `url(${coverUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!coverUrl && 'Game Cover'}
                </CardMedia>
              </Card>
              
              <Button 
                variant="contained"
                onClick={handleCollectGame}
                disabled={isCollected}
                sx={{ 
                  backgroundColor: isCollected ? '#FFFFFF' : '#3C1661',
                  color: isCollected ? '#3C1661' : '#FFFFFF',
                  border: isCollected ? '2px solid #3C1661' : 'none',
                  borderRadius: '25px',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: isCollected ? '#FFFFFF' : '#2A0F47'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#FFFFFF',
                    color: '#3C1661',
                    border: '2px solid #3C1661'
                  }
                }}
              >
                {isCollected ? 'Game Collected' : 'Collect game'}
              </Button>
            </Box>
          </Box>

          {/* Game Details */}
          <Box sx={{ flex: 1, minWidth: 400 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#3C1661', mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                {developer}
              </Typography>

              {/* Rating and Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                {rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star sx={{ color: '#3C1661' }} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Rating: {rating}/100
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth sx={{ color: '#3C1661' }} />
                  <Typography variant="body1">
                    Release: {releaseDate}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VideogameAsset sx={{ color: '#3C1661' }} />
                  <Typography variant="body1">
                    Genre: {genres}
                  </Typography>
                </Box>
              </Box>

              {/* Summary */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3C1661', mb: 2 }}>
                  Summary
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
                  {summary}
                </Typography>
              </Box>

              {/* Platforms */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3C1661', mb: 2 }}>
                  Platforms
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  {platforms}
                </Typography>
              </Box>

              {/* Media */}
              {screenshots.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3C1661', mb: 2 }}>
                    Screenshots
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {screenshots.map((screenshot: { url: string }, index: number) => (
                      <Card key={index} sx={{ width: 120, borderRadius: 2 }}>
                        <CardMedia
                          component="div"
                          sx={{
                            height: 80,
                            backgroundColor: '#E0E0E0',
                            backgroundImage: screenshot.url ? `url(https:${screenshot.url.replace('t_thumb', 't_screenshot_med')})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                      </Card>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Similar Games */}
        {similarGames.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3C1661', mb: 3 }}>
              Similar games
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {similarGames.map((gameItem: { id: number; name: string; cover?: { url: string } }) => (
                <Card 
                  key={gameItem.id}
                  sx={{ 
                    width: 140,
                    borderRadius: 3,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease',
                    }
                  }}
                  onClick={() => {
                    router.push(`/game/${gameItem.id}`);
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 180,
                      backgroundColor: '#E0E0E0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '12px',
                      backgroundImage: gameItem.cover?.url ? `url(https:${gameItem.cover.url.replace('t_thumb', 't_cover_big')})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!gameItem.cover?.url && gameItem.name}
                  </CardMedia>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
