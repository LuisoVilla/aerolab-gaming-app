"use client";

import { 
  TextField, 
  InputAdornment, 
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Box,
  ClickAwayListener,
  Typography
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "../context/SearchContext";

interface SearchComboboxProps {
  placeholder?: string;
}

export default function SearchCombobox({ placeholder = "Search games..." }: SearchComboboxProps) {
  const { searchQuery, setSearchQuery, searchGames, games, loading } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Show only first 10 results
  const limitedGames = games.slice(0, 10);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchGames(searchQuery);
      } else {
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchGames]);

  // Open dropdown when we have results
  useEffect(() => {
    if (searchQuery.trim() && !loading && games.length > 0) {
      setIsOpen(true);
    } else if (!searchQuery.trim()) {
      setIsOpen(false);
    }
  }, [searchQuery, loading, games]);

  const handleSelectGame = (gameId: number, gameName: string) => {
    setSearchQuery(gameName);
    setIsOpen(false);
    inputRef.current?.blur();
    router.push(`/game/${gameId}`);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    if (searchQuery.trim() && limitedGames.length > 0) {
      setIsOpen(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const showDropdown = isOpen && !loading && limitedGames.length > 0;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <TextField
          ref={inputRef}
          fullWidth
          placeholder={placeholder}
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#999' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  size="small"
                  sx={{ color: '#999', '&:hover': { color: '#666' } }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: '#E0E0E0',
              },
              '&:hover fieldset': {
                borderColor: '#8B5A96',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#8B5A96',
                borderWidth: '2px',
              },
            },
          }}
        />
        
        {/* Loading indicator */}
        {loading && (
          <Box sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            mt: 1,
            backgroundColor: 'white',
            border: '1px solid #E0E0E0',
            borderRadius: 3,
            boxShadow: 3,
            p: 2,
            textAlign: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Box sx={{
                width: 16,
                height: 16,
                border: '2px solid #8B5A96',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
              <Typography variant="body2" sx={{ color: '#666' }}>Searching...</Typography>
            </Box>
          </Box>
        )}

        {/* Dropdown Results */}
        {showDropdown && (
          <Box sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            mt: 1,
            backgroundColor: 'white',
            border: '1px solid #E0E0E0',
            borderRadius: 3,
            boxShadow: 3,
            maxHeight: 400,
            overflow: 'hidden'
          }}>
            <Box sx={{ position: 'relative' }}>
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 50,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: 'white' }
                }}
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>

              <List sx={{ p: 0, maxHeight: 384, overflowY: 'auto' }}>
                {limitedGames.map((game, index) => (
                  <ListItem key={game.id} sx={{ p: 0 }}>
                    <ListItemButton
                      onClick={() => handleSelectGame(game.id, game.name)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': { backgroundColor: '#F5F5F5' },
                        borderBottom: index < limitedGames.length - 1 ? '1px solid #F0F0F0' : 'none'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_small')}` : undefined}
                          sx={{ width: 48, height: 48, mr: 1.5, backgroundColor: '#E0E0E0' }}
                          variant="rounded"
                        >
                          {!game.cover?.url && game.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={game.name}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}

        {/* No Results Message */}
        {isOpen && !loading && searchQuery.trim() && limitedGames.length === 0 && (
          <Box sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            mt: 1,
            backgroundColor: 'white',
            border: '1px solid #E0E0E0',
            borderRadius: 3,
            boxShadow: 3,
            p: 2,
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              No games found for &ldquo;{searchQuery}&rdquo;
            </Typography>
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}
