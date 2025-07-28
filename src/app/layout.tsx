"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { 
  Box, 
  ThemeProvider,
  createTheme
} from "@mui/material";
import { SearchProvider } from "../context/SearchContext";
import { ToastProvider } from "../context/ToastContext";
import SearchHeader from "../components/SearchHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#6727A6',
    },
  },
});

function LayoutContent({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider theme={theme}>
      <SearchProvider>
        <ToastProvider>
          <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #E7C0DB 0%, #F0D4E8 25%, #F8E8F4 50%, #FCEFF9 75%, #FFFFFF 100%)',
            position: 'relative'
          }}>
            <SearchHeader >
              {children}
            </SearchHeader>
          </Box>
        </ToastProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
