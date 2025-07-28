"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { 
  Box, 
  ThemeProvider,
  createTheme
} from "@mui/material";
import { SearchProvider } from "../context/SearchContext";
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
      main: '#8B5A96',
    },
  },
});

const FloatingLetter = ({ letter, top, left, size = 40 }: {
  letter: string;
  top: number;
  left: number;
  size?: number;
}) => (
  <Box
    sx={{
      position: 'absolute',
      top: `${top}%`,
      left: `${left}%`,
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#8B5A96',
      animation: 'float 6s ease-in-out infinite',
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-20px)' },
      },
    }}
  >
    {letter}
  </Box>
);

function LayoutContent({ children }: { children: React.ReactNode }) {
  const floatingLetters = (
    <>
      <FloatingLetter letter="A" top={10} left={15} />
      <FloatingLetter letter="D" top={8} left={85} />
      <FloatingLetter letter="V" top={20} left={92} />
      <FloatingLetter letter="S" top={35} left={8} />
      <FloatingLetter letter="W" top={45} left={5} />
      <FloatingLetter letter="G" top={60} left={90} />
      <FloatingLetter letter="Z" top={75} left={85} />
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <SearchProvider>
        <SearchHeader floatingLetters={floatingLetters}>
          {children}
        </SearchHeader>
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
