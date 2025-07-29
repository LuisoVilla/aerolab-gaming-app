import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import { DeleteOutline } from "@mui/icons-material";
import Skeleton from "@mui/material/Skeleton";
import {
  BLACK,
  BLACK_TRANSPARENT,
  GRAY,
  GRAY_DARK,
  WHITE,
  WHITE_TRANSPARENT
} from "../lib/constants/colors";
import { CollectedGame } from "../store/gameStore";

interface CollectedGamesGridProps {
  collectedGames: CollectedGame[];
  activeFilter: "Last added" | "Newest" | "Oldest";
  handleGameClick: (gameId: number) => void;
  handleRemoveGame: (gameId: number, gameName: string) => void;
  loading?: boolean;
}

export default function CollectedGamesGrid({ collectedGames, activeFilter, handleGameClick, handleRemoveGame, loading = false }: CollectedGamesGridProps) {
  const skeletonCount = 8;
  if (loading || collectedGames.length === 0) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 0.5, md: 4 }, alignItems: 'center', justifyContent: 'center' }}>
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <Box key={idx} sx={{ display: 'flex', justifyContent: 'center', minWidth: 0, width: '100%', p: 0, m: 0, overflow: 'hidden' }}>
            <Card sx={{ width: { xs: 114, md: 220 }, height: { xs: 152, md: 270 }, borderRadius: 3, position: 'relative', mx: 'auto', margin: '4px', maxWidth: { xs: 114, md: 220 }, minHeight: { xs: 152, md: 270 }, boxSizing: 'border-box', overflow: 'hidden' }}>
              <Skeleton variant="rectangular" width="100%" height={100} />
              <Skeleton variant="text" sx={{ mt: 1 }} width="80%" />
              <Skeleton variant="circular" width={32} height={32} sx={{ position: 'absolute', top: 4, right: 4 }} />
            </Card>
          </Box>
        ))}
      </Box>
    );
  }
  return (
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
  );
}
