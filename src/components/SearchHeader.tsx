"use client";

import { 
  Box, 
  IconButton, 
  Typography 
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import SearchCombobox from "./SearchCombobox";

interface SearchHeaderProps {
  floatingLetters: React.ReactNode;
  children: React.ReactNode;
}

export default function SearchHeader({ floatingLetters, children }: SearchHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const isHomePage = pathname === '/';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F4D4F7 0%, #E8C5E8 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Letters */}
      {floatingLetters}

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
                color: '#8B5A96',
                '&:hover': {
                  backgroundColor: 'rgba(139, 90, 150, 0.1)'
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
