import * as React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Routes, Route } from "react-router-dom"
import Home from './routes/home';
import Dashboard from './routes/dashboard';
import { CallbackPage } from './routes/callback-page';
import { useAuth0 } from '@auth0/auth0-react';
import Settings from './routes/settings';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StravaAuthPage } from './routes/strava_auth';
import { SpotifyAuthPage } from './routes/spotify_auth';
import About from './routes/about';
import LikedTracksPage from './routes/liked_tracks';
import { AudioProvider } from './contexts/AudioContext';
import { LikedTracksProvider } from './contexts/LikedTracksContext';
import MiniPlayer from './components/MiniPlayer';

export default function App() {

  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress color="secondary" sx={{ margin: 20 }} />
      </Box>
    )
  }

  return (
    <AudioProvider>
      <LikedTracksProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<ProtectedRoute component={Dashboard} />} />
          <Route path="settings" element={<ProtectedRoute component={Settings} />} />
          <Route path="callback" element={<CallbackPage />} />
          <Route path="strava_auth" element={<StravaAuthPage />} />
          <Route path="spotify_auth" element={<SpotifyAuthPage />} />
          <Route path="liked-tracks" element={<ProtectedRoute component={LikedTracksPage} />} />
        </Routes>
        <MiniPlayer />
      </LikedTracksProvider>
    </AudioProvider>
  );
}

