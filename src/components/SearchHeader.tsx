"use client";

import { ArrowBack } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import SearchCombobox from "./SearchCombobox";
import { Swords } from "lucide-react";
import { BLACK } from "@/lib/constants/colors";
import styles from "./SearchHeader.module.css";
import { Typography } from "@mui/material";

interface SearchHeaderProps {
  children: React.ReactNode;
}

export default function SearchHeader({ children }: SearchHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isGameDetail = pathname?.startsWith('/game/');

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
