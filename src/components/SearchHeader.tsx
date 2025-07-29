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
      {/* Header - Back siempre a la izquierda, resto centrado salvo en detalle de game */}
      <Box sx={{ p: 2, position: 'relative', zIndex: 1000 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: { xs: 2, sm: 0 } }}>
          {!isHomePage && (
            <IconButton 
              onClick={() => router.back()}
              sx={{ 
                color: '#6727A6',
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
        </Box>
        {/* Si NO estamos en el detalle del game, mostrar título y centrar layout en desktop */}
        {!isGameDetail && (
          <Box
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: 400 },
              mx: { xs: 0, sm: 'auto' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 3,
              mt: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: { xs: 'flex-start', sm: 'center' },
                mb: 1,
                width: '100%',
                gap: 0.5,
              }}
            >
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'flex-start', sm: 'center' },
                  width: 'auto',
                  flex: 1,
                }}
              >
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
            </Box>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%', maxWidth: '100%' }}>
                <SearchCombobox placeholder="Search games..." />
              </Box>
            </Box>
          </Box>
        )}
        {/* Si estamos en el detalle del game, solo centrar la barra de búsqueda debajo del botón Back */}
        {isGameDetail && (
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
