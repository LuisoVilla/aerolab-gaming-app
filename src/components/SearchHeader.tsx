"use client";

import { ArrowBack } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import SearchCombobox from "./SearchCombobox";
import { Swords } from "lucide-react";
import { BLACK } from "@/lib/constants/colors";
import styles from "./SearchHeader.module.css";
import { Typography, Button, Avatar, Menu, MenuItem, Box } from "@mui/material";
import { signOut } from "next-auth/react";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

interface SearchHeaderProps {
  children: React.ReactNode;
}

export default function SearchHeader({ children }: SearchHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isHomePage = pathname === '/';
  const isGameDetail = pathname?.startsWith('/game/');
  const isAuthPage = pathname?.startsWith('/auth/');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleMenuClose();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerBar}>
        {/* Back button */}
        {!isHomePage && (
          <button className={styles.backButton} onClick={() => router.back()}>
            <ArrowBack />
            <span style={{ marginLeft: 8 }}>Back</span>
          </button>
        )}

        {/* Auth buttons - positioned absolutely */}
        {!isAuthPage && (
          <Box sx={{ 
            position: 'absolute', 
            right: 16, 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 10
          }}>
            {!isLoading && (
              isAuthenticated ? (
                <>
                  <Avatar
                    src={user?.image || undefined}
                    onClick={handleMenuOpen}
                    sx={{ 
                      cursor: 'pointer',
                      width: 36,
                      height: 36,
                      backgroundColor: '#6727A6'
                    }}
                  >
                    {user?.name?.[0] || user?.email?.[0]}
                  </Avatar>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user?.name || user?.email}
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleSignOut}>
                      Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => router.push('/auth/signin')}
                  sx={{
                    backgroundColor: '#6727A6',
                    '&:hover': { backgroundColor: '#5A1E8A' },
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Sign In
                </Button>
              )
            )}
          </Box>
        )}

        {/* Header content */}
        {!isGameDetail ? (
          <div style={{ width: '100%', maxWidth: 400, margin: '0 auto 24px auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div
                className={styles.logo}
                onClick={() => router.push('/')}
                role="button"
                tabIndex={0}
                aria-label="Go to home"
              >
                <Swords size={28} color={BLACK} />
              </div>
              <Typography 
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  color: '#6727A6',
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
            </div>
            <SearchCombobox placeholder="Search games..." />
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div
              className={styles.logo}
              onClick={() => router.push('/')}
              role="button"
              tabIndex={0}
              aria-label="Go to home"
              style={{ marginBottom: 8 }}
            >
              <Swords size={28} color={BLACK} />
            </div>
            <SearchCombobox placeholder="Search games..." />
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
