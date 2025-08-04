"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { PURPLE, WHITE, GRAY_LIGHT } from "../../../lib/constants/colors";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        // Refresh session and redirect
        await getSession();
        window.location.href = '/'; // Force a full page reload to update auth state
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch {
      setError("An error occurred during social sign in.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: WHITE,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: PURPLE, mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Sign in to access your gaming collection
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 4 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: 16,
              fontWeight: 600,
              backgroundColor: PURPLE,
              "&:hover": { backgroundColor: "#5A1E8A" },
              mb: 3,
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <Box sx={{ mb: 3 }}>
          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: "#666", px: 2 }}>
              Or continue with
            </Typography>
          </Divider>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSocialSignIn("google")}
              disabled={loading}
              sx={{
                py: 1.5,
                borderColor: GRAY_LIGHT,
                color: "#666",
                "&:hover": { borderColor: PURPLE, color: PURPLE },
              }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleSocialSignIn("github")}
              disabled={loading}
              sx={{
                py: 1.5,
                borderColor: GRAY_LIGHT,
                color: "#666",
                "&:hover": { borderColor: PURPLE, color: PURPLE },
              }}
            >
              GitHub
            </Button>
          </Box>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Demo credentials: demo@example.com / password123
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
