import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import { DeleteOutline } from "@mui/icons-material";
import Skeleton from "@mui/material/Skeleton";
import {
  BLACK_TRANSPARENT,
  WHITE,
  WHITE_TRANSPARENT
} from "../lib/constants/colors";
import { CollectedGame } from "../store/gameStore";
import styles from "./CollectedGamesGrid.module.css";

interface CollectedGamesGridProps {
  collectedGames: CollectedGame[];
  activeFilter: "Last added" | "Newest" | "Oldest";
  handleGameClick: (gameId: number) => void;
  handleRemoveGame: (gameId: number, gameName: string) => void;
  loading?: boolean;
}

interface GameCardProps {
  game: CollectedGame;
  activeFilter: "Last added" | "Newest" | "Oldest";
  handleGameClick: (gameId: number) => void;
  handleRemoveGame: (gameId: number, gameName: string) => void;
  delay: number;
}

function GameCard({ game, activeFilter, handleGameClick, handleRemoveGame, delay }: GameCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div ref={cardRef} style={{ display: 'flex', justifyContent: 'center', minWidth: 0, width: '100%', padding: 0, margin: 0, overflow: 'hidden' }}>
      <div 
        className={`${styles.card} ${isVisible ? styles.cardVisible : ''}`} 
        onClick={() => handleGameClick(game.id)} 
        style={{ cursor: 'pointer', position: 'relative', width: '220px', height: '300px', minHeight: '300px', maxWidth: '220px', borderRadius: '12px' }}
      >
        <div className={styles.cardImage} style={{ width: '220px', height: '220px', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
          {game.cover?.url ? (
            <Image 
              src={`https:${game.cover.url.replace('t_thumb', 't_cover_big')}`} 
              alt={game.name} 
              fill 
              style={{ objectFit: 'cover', borderRadius: '12px' }} 
              sizes="(max-width: 600px) 114px, 220px" 
              priority={false}
            />
          ) : (
            'Game Image'
          )}
        </div>
        {(activeFilter === "Newest" || activeFilter === "Oldest") && game.first_release_date && (
          <div style={{ position: 'absolute', bottom: 40, left: 4, background: BLACK_TRANSPARENT, color: WHITE, padding: '2px 6px', borderRadius: 4, fontSize: 12, fontWeight: 'bold' }}>
            {new Date(game.first_release_date * 1000).getFullYear()}
          </div>
        )}
        <IconButton 
          aria-label="delete" 
          style={{ position: 'absolute', top: 4, right: 4, background: WHITE_TRANSPARENT }} 
          onClick={(e) => { e.stopPropagation(); handleRemoveGame(game.id, game.name); }}
        >
          <DeleteOutline style={{ fontSize: 20 }} />
        </IconButton>
      </div>
    </div>
  );
}

export default function CollectedGamesGrid({ collectedGames, activeFilter, handleGameClick, handleRemoveGame, loading = false }: CollectedGamesGridProps) {
  const skeletonCount = 8;
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'center', minWidth: 0, width: '100%', padding: 0, margin: 0, overflow: 'hidden' }}>
            <div className={styles.card} style={{ width: '220px', height: '300px', minHeight: '300px', maxWidth: '220px', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
              <Skeleton variant="rectangular" width="100%" height={220} style={{ borderRadius: '12px' }} />
              <Skeleton variant="circular" width={32} height={32} style={{ position: 'absolute', top: 4, right: 4 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (collectedGames.length === 0) {
    return (
      <div style={{ width: '100%', textAlign: 'center', marginTop: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Nothing collected yet</h2>
        <div style={{ color: '#888', fontSize: 16 }}>Here you will see your collected games</div>
      </div>
    );
  }
  return (
    <div className={styles.grid}>
      {collectedGames.map((game: CollectedGame, index: number) => (
        <GameCard
          key={game?.id}
          game={game}
          activeFilter={activeFilter}
          handleGameClick={handleGameClick}
          handleRemoveGame={handleRemoveGame}
          delay={index * 100} // Staggered delay: 0ms, 100ms, 200ms, etc.
        />
      ))}
    </div>
  );
}
