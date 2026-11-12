import { useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import DoctorMaster from './pages/DoctorMaster/DoctorMaster';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Header onMenu={() => setMobileOpen(true)} />
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flex: 1, minWidth: 0, mt: '60px', minHeight: 'calc(100vh - 60px)', bgcolor: 'background.default' }}>
          <DoctorMaster />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
