"use client";

import { 
  Box, 
  Typography, 
  Container, 
  Button,
  Card,
  CircularProgress,
  Chip
} from "@mui/material";
import Image from "next/image";
import { Star, Calendar, Puzzle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "../../../store/gameStore";
import { useToastContext } from "../../../context/ToastContext";
import { BLACK, PURPLE_DARK } from "@/lib/constants/colors";
import { formatDateMMDDYYYY } from "@/lib/utils/date";
import ScreenshotModal from '@/components/ScreenshotModal';

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



export default function GameDetail() {
  const params = useParams();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addGame, isGameCollected } = useGameStore();
  const { showGameCollected } = useToastContext();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const handleScreenshotClick = (url: string) => {
    setModalImage(url);
    setModalOpen(true);
  };

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
  const releaseDate = formatDateMMDDYYYY(game.first_release_date || 0);
  const platforms = game.platforms?.map((p) => p.name).join(", ") || "Unknown Platforms";
  const summary = game.summary || "No summary available.";
  const coverUrl = game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big_2x')}` : null;
  const screenshots = game.screenshots?.slice(0, 5) || [];
  const similarGames = game.similar_games?.slice(0, 4) || [];

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1, mx: 'auto', maxWidth: 800 }}>
        {/* Portada y datos principales alineados horizontalmente y centrados */}
        <Box sx={{ display: 'flex', gap: 4, flexWrap: { xs: 'wrap', md: 'nowrap' }, alignItems: 'center', mb: 4, mx: 'auto', maxWidth: 800 }}>
          {/* Mobile: imagen a la izquierda, título y developer a la derecha; Desktop: igual que antes */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'flex-start' }, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'row' }, width: '100%' }}>
              {/* Imagen */}
              <Card sx={{ width: { xs: 120, sm: 170 }, height: { xs: 160, sm: 228 }, borderRadius: 3, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: '#E0E0E0', mr: { xs: 2, sm: 4 } }}>
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={title + ' cover'}
                    width={170}
                    height={228}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    priority
                  />
                ) : (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '14px' }}>
                    Game Cover
                  </Box>
                )}
              </Card>
              {/* Título y developer */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0, width: '100%' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: PURPLE_DARK, mb: 1, wordBreak: 'break-word', fontSize: { xs: '1.125rem', sm: '2rem' }, textAlign: { xs: 'left', sm: 'left' }, width: '100%' }}>
                  {title}
                </Typography>
                <Typography variant="h6" sx={{ color: BLACK, mb: 2, wordBreak: 'break-word', textAlign: { xs: 'left', sm: 'left' }, width: '100%' }}>
                  {developer}
                </Typography>
                {/* Botón solo en desktop debajo del developer */}
                <Box sx={{ display: { xs: 'none', sm: 'block' }, width: 240, mt: 0 }}>
                  <Button 
                    variant="contained"
                    onClick={handleCollectGame}
                    disabled={isCollected}
                    sx={{ 
                      backgroundColor: isCollected ? '#FFFFFF' : PURPLE_DARK,
                      color: isCollected ? PURPLE_DARK : '#FFFFFF',
                      border: isCollected ? `2px solid ${PURPLE_DARK}` : 'none',
                      borderRadius: '25px',
                      px: 4,
                      py: 1.5,
                      width: '100%',
                      mb: 2,
                      '&:hover': {
                        backgroundColor: isCollected ? '#FFFFFF' : '#2A0F47'
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#FFFFFF',
                        color: PURPLE_DARK,
                        border: `2px solid ${PURPLE_DARK}`
                      }
                    }}
                  >
                    {isCollected ? 'Game Collected' : 'Collect game'}
                  </Button>
                </Box>
              </Box>
            </Box>
            {/* Botón solo en mobile debajo de la imagen, ocupando todo el ancho */}
            <Box sx={{ display: { xs: 'block', sm: 'none' }, width: '100%', mt: 2 }}>
              <Button 
                variant="contained"
                onClick={handleCollectGame}
                disabled={isCollected}
                sx={{ 
                  backgroundColor: isCollected ? '#FFFFFF' : PURPLE_DARK,
                  color: isCollected ? PURPLE_DARK : '#FFFFFF',
                  border: isCollected ? `2px solid ${PURPLE_DARK}` : 'none',
                  borderRadius: '25px',
                  px: 4,
                  py: 1.5,
                  width: '100%',
                  mb: 2,
                  '&:hover': {
                    backgroundColor: isCollected ? '#FFFFFF' : '#2A0F47'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#FFFFFF',
                    color: PURPLE_DARK,
                    border: `2px solid ${PURPLE_DARK}`
                  }
                }}
              >
                {isCollected ? 'Game Collected' : 'Collect game'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Bloque vertical: chips, summary, platforms, screenshots */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 800, mx: 'auto' }}>
          {/* Chips en columna */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            {typeof game.rating !== 'undefined' && (
              <Chip
                icon={<Star color={PURPLE_DARK} size={22} style={{ marginLeft: 3 }} />}
                label={
                  <span style={{ fontWeight: 400, fontSize: 18 }}>
                    <span style={{ color: PURPLE_DARK, fontWeight: 700 }}>Rating:</span>
                    <span style={{ color: BLACK, marginLeft: 6 }}>{rating !== null ? rating : 'N/A'}</span>
                  </span>
                }
                sx={{
                  border: '2px solid #E2D9F3',
                  background: '#FFF',
                  px: 0.7,
                  py: 1,
                  borderRadius: '32px',
                  boxShadow: 'none',
                  minHeight: 48,
                  minWidth: 120,
                  maxWidth: 220,
                  fontSize: 18,
                }}
              />
            )}
            {game.first_release_date && (
              <Chip
                icon={<Calendar color={PURPLE_DARK} size={22} style={{ marginLeft: 3 }} />}
                label={
                  <span style={{ fontWeight: 400, fontSize: 18 }}>
                    <span style={{ color: PURPLE_DARK, fontWeight: 700 }}>Release:</span>
                    <span style={{ color: BLACK, marginLeft: 6 }}>{releaseDate}</span>
                  </span>
                }
                sx={{
                  border: '2px solid #E2D9F3',
                  background: '#FFF',
                  px: 0.7,
                  py: 1,
                  borderRadius: '32px',
                  boxShadow: 'none',
                  minHeight: 48,
                  minWidth: 180,
                  maxWidth: 340,
                  fontSize: 18,
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  textOverflow: 'clip',
                }}
              />
            )}
            {game.genres && game.genres.length > 0 && (
              <Chip
                icon={<Puzzle color={PURPLE_DARK} size={22} style={{ marginLeft: 3 }} />}
                label={
                  <span style={{ fontWeight: 400, fontSize: 18 }}>
                    <span style={{ color: PURPLE_DARK, fontWeight: 700 }}>Genre:</span>
                    <span style={{ color: BLACK, marginLeft: 6 }}>{game.genres[0].name}</span>
                  </span>
                }
                sx={{
                  border: '2px solid #E2D9F3',
                  background: '#FFF',
                  px: 0.7,
                  py: 1,
                  borderRadius: '32px',
                  boxShadow: 'none',
                  minHeight: 48,
                  minWidth: 140,
                  maxWidth: 260,
                  fontSize: 18,
                }}
              />
            )}
          </Box>
          {/* Summary */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3C1661', mb: 2 }}>
              Summary
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#555' }}>
              {summary}
            </Typography>
          </Box>
          {/* Platforms */}
          <Box>
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
                  <Card 
                    key={index} 
                    sx={{ width: 120, height: 80, borderRadius: 2, overflow: 'hidden', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    onClick={() => handleScreenshotClick(`https:${screenshot.url.replace('t_thumb', 't_screenshot_huge')}`)}
                  >
                    {screenshot.url ? (
                      <Image
                        src={`https:${screenshot.url.replace('t_thumb', 't_screenshot_med')}`}
                        alt={`Screenshot ${index + 1}`}
                        width={120}
                        height={80}
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        loading="lazy"
                      />
                    ) : null}
                  </Card>
                ))}
              </Box>
              {modalOpen && modalImage && (
                <ScreenshotModal 
                  open={modalOpen} 
                  onClose={() => setModalOpen(false)} 
                  imageUrl={modalImage} 
                />
              )}
            </Box>
          )}
        </Box>

        {/* Similar Games */}
        {similarGames.length > 0 && (
          <Box sx={{ mt: 6, mx: 'auto', maxWidth: 800 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3C1661', mb: 3 }}>
              Similar games
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {similarGames.map((gameItem: { id: number; name: string; cover?: { url: string } }, idx: number) => (
                <Card 
                  key={gameItem.id}
                  sx={{ 
                    width: 140,
                    height: 180,
                    borderRadius: 3,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    backgroundColor: '#E0E0E0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease',
                    }
                  }}
                  onClick={() => {
                    router.push(`/game/${gameItem.id}`);
                  }}
                >
                  {gameItem.cover?.url ? (
                    <Image
                      src={`https:${gameItem.cover.url.replace('t_thumb', 't_cover_big')}`}
                      alt={gameItem.name + ' cover'}
                      width={140}
                      height={180}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      loading="lazy"
                    />
                  ) : (
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px' }}>
                      {gameItem.name}
                    </Box>
                  )}
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
