"use client";

import { useAuth } from "../hooks/useAuth";
import { usePathname } from "next/navigation";
import SearchHeader from "./SearchHeader";
import SignInPage from "../app/auth/signin/page";
import { Box, CircularProgress } from "@mui/material";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth/');

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress size={60} sx={{ color: '#6727A6' }} />
      </Box>
    );
  }

  // If user is not authenticated and not on auth page, show login
  if (!isAuthenticated && !isAuthPage) {
    return <SignInPage />;
  }

  // If user is authenticated or on auth page, show normal layout with header
  return (
    <SearchHeader>
      {children}
    </SearchHeader>
  );
}
