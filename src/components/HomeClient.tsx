import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import { DeleteOutline } from "@mui/icons-material";
import {
  PURPLE,
  PURPLE_DARK,
  WHITE,
  WHITE_TRANSPARENT,
  BLACK,
  BLACK_TRANSPARENT,
  GRAY,
  GRAY_DARK,
  GRAY_LIGHT
} from "../lib/constants/colors";
import { useGameStore, type CollectedGame } from "../store/gameStore";

export default function HomeClient() {
  const [activeFilter, setActiveFilter] = useState<"Last added" | "Newest" | "Oldest">("Last added");
  const { getGamesByFilter, removeGame } = useGameStore();

  const filterMapping = {
    "Last added": "lastAdded" as const,
    "Newest": "newest" as const,
    "Oldest": "oldest" as const
  };
  const collectedGames = getGamesByFilter(filterMapping[activeFilter]);

  const handleRemoveGame = (gameId: number, gameName: string) => {
    removeGame(gameId);
    // Toast omitido para test
  };

  const handleGameClick = (gameId: number) => {
    // Navegación omitida para test
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 6, position: 'relative', justifyContent: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ fontWeight: 'bold', color: PURPLE, textAlign: 'center', mb: 2 }}
        >
          Saved games
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, ml: 0.5 }}>
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
        {collectedGames.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 0.5, md: 4 }, alignItems: 'center', justifyContent: 'center' }}>
            {collectedGames.map((game: CollectedGame) => (
              <Box key={game?.id} sx={{ display: 'flex', justifyContent: 'center', minWidth: 0, width: '100%', p: 0, m: 0, overflow: 'hidden' }}>
                <Card sx={{ width: { xs: 114, md: 220 }, height: { xs: 152, md: 270 }, borderRadius: 3, position: 'relative', cursor: 'pointer', mx: 'auto', margin: '4px', maxWidth: { xs: 114, md: 220 }, minHeight: { xs: 152, md: 270 }, boxSizing: 'border-box', overflow: 'hidden', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.3s ease' } }} onClick={() => handleGameClick(game.id)}>
                  <Box sx={{ width: '100%', height: { xs: 100, md: 270 }, minHeight: { xs: 161, md: 270 }, maxHeight: { xs: 100, md: 270 }, backgroundColor: GRAY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GRAY_DARK, fontSize: '14px', overflow: 'hidden', position: 'relative' }}>
                    {game.cover?.url ? (
                      <Image src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`} alt={game.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 600px) 114px, 220px" priority={true} />
                    ) : (
                      'Game Image'
                    )}
                  </Box>
                  <Typography sx={{ color: BLACK, fontSize: '14px', textAlign: 'center', fontWeight: 600, mt: 1 }}>
                    {game.name}
                  </Typography>
                  {(activeFilter === "Newest" || activeFilter === "Oldest") && game.first_release_date && (
                    <Box sx={{ position: 'absolute', bottom: 40, left: 4, backgroundColor: BLACK_TRANSPARENT, color: WHITE, padding: '2px 6px', borderRadius: 1, fontSize: '12px', fontWeight: 'bold' }}>
                      {new Date(game.first_release_date * 1000).getFullYear()}
                    </Box>
                  )}
                  <IconButton aria-label="delete" sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: WHITE_TRANSPARENT, '&:hover': { backgroundColor: WHITE } }} onClick={(e) => { e.stopPropagation(); handleRemoveGame(game.id, game.name); }}>
                    <DeleteOutline sx={{ fontSize: 20 }} />
                  </IconButton>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 8 }}>
            <Typography sx={{ color: BLACK, fontSize: '18px', mb: 2, fontWeight: 'bold' }}>
              Nothing collected yet
            </Typography>
            <Typography sx={{ color: BLACK, fontSize: '14px' }}>
              Here you will see your collected games
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
