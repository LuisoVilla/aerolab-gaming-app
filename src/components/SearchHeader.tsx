"use client";

import { 
  Box, 
  IconButton, 
  Typography 
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import SearchCombobox from "./SearchCombobox";
import { Swords } from "lucide-react";
import { PURPLE_DARK, BLACK } from "@/lib/constants/colors";

interface SearchHeaderProps {
  children: React.ReactNode;
}

export default function SearchHeader({ children }: SearchHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isGameDetail = pathname?.startsWith('/game/');

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ p: 2, position: 'relative', zIndex: 1000 }}>
        {/* Back button */}
        {!isHomePage && (
          <IconButton 
            onClick={() => router.back()}
            sx={{ 
              color: '#6727A6',
              mb: { xs: 2, sm: 0 },
              '&:hover': {
                backgroundColor: 'rgba(103, 39, 166, 0.1)'
              }
            }}
          >
            <ArrowBack />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Back
            </Typography>
          </IconButton>
        )}

        {/* Header content */}
        {!isGameDetail ? (
          <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 400 }, mx: { xs: 0, sm: 'auto' }, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  border: '2px solid #FF00AE',
                  borderRadius: 2,
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  mr: 0.5,
                  '&:hover': {
                    boxShadow: '0 0 0 2px #FF00AE33',
                  },
                }}
                onClick={() => router.push('/')}
                role="button"
                tabIndex={0}
                aria-label="Go to home"
              >
                <Swords size={28} color={BLACK} />
              </Box>
              <Typography 
                variant="h5" 
                component="h1"
                sx={{ 
                  fontWeight: 'bold',
                  color: PURPLE_DARK,
                  letterSpacing: 0.5,
                  textAlign: { xs: 'left', sm: 'center' },
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', sm: 'center' },
                }}
              >
                Gaming Haven Z
              </Typography>
            </Box>
            <SearchCombobox placeholder="Search games..." />
          </Box>
        ) : (
          <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 480 }, mx: { xs: 0, sm: 'auto' }, mt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                border: '2px solid #FF00AE',
                borderRadius: 2,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                mb: 1,
                '&:hover': {
                  boxShadow: '0 0 0 2px #FF00AE33',
                },
              }}
              onClick={() => router.push('/')}
              role="button"
              tabIndex={0}
              aria-label="Go to home"
            >
              <Swords size={28} color={BLACK} />
            </Box>
            <SearchCombobox placeholder="Search games..." />
          </Box>
        )}
      </Box>
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
