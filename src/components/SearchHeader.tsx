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

interface SearchHeaderProps {
  children: React.ReactNode;
}

export default function SearchHeader({ children }: SearchHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const isHomePage = pathname === '/';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1000
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          {isHomePage && (
            <Typography variant="body2" sx={{ color: '#666', ml: 2 }}>
              Home
            </Typography>
          )}
        </Box>

        {/* Search Combobox */}
        <Box sx={{ maxWidth: 400, flex: 1, mx: 4 }}>
           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              border: '2px solid #FF00AE',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: '0 0 0 2px #FF00AE33',
              },
            }}
            onClick={() => router.push('/')}
            role="button"
            tabIndex={0}
            aria-label="Go to home"
          >
            <Swords size={28} color="#000000" />
          </Box>
          <Typography 
            variant="h5" 
            component="h1"
            sx={{ 
              fontWeight: 'bold',
              color: '#6727A6',
              letterSpacing: 0.5
            }}
          >
            Gaming Haven Z
          </Typography>
        </Box>
      </Box>
          <SearchCombobox placeholder="Search games..." />
        </Box>

        <Box sx={{ width: 100 }} />
      </Box>

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
