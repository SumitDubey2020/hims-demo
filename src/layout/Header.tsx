import { type MouseEvent, useEffect, useState } from 'react';
import { AppBar, Avatar, Box, Dialog, Divider, IconButton, InputBase, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { colors } from '../theme';
import AppDialog from '../components/AppDialog';
import NotificationMenu from './NotificationMenu';

export default function Header({ onMenu }: { onMenu: () => void }) {
  const [now, setNow] = useState(new Date());
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logout, setLogout] = useState<'confirm' | 'done' | null>(null);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '');
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: colors.header, zIndex: (t) => t.zIndex.drawer + 1, height: 60 }}>
      <Toolbar sx={{ minHeight: '60px !important', gap: { xs: 0.5, sm: 1.5 }, px: { xs: 1, sm: 2 } }}>
        <IconButton color="inherit" onClick={onMenu} sx={{ display: { xs: 'inline-flex', md: 'none' } }}><MenuIcon /></IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, width: { md: 212 }, flexShrink: 0 }}>
          <LocalHospitalIcon sx={{ fontSize: 32 }} />
          <Typography sx={{ fontSize: 26, fontWeight: 800, letterSpacing: 1 }}>HIMS</Typography>
          <Typography sx={{ display: { xs: 'none', lg: 'block' }, fontSize: 10.5, lineHeight: 1.15, ml: 0.5 }}>Hospital Information<br />Management System</Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flex: 1, maxWidth: 485, ml: { md: 3 }, alignItems: 'center', bgcolor: '#fff', borderRadius: 1, px: 1.5, height: 32 }}>
          <SearchIcon sx={{ color: colors.header, fontSize: 18, mr: 1 }} />
          <InputBase fullWidth placeholder="Search patient by UHID / Name / Mobile..." sx={{ fontSize: 12.5 }} />
        </Box>
        <Box sx={{ flex: 1 }} />
        <IconButton color="inherit" sx={{ display: { sm: 'none' } }}><SearchIcon /></IconButton>
        <NotificationMenu />
        <IconButton color="inherit" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}><ChatIcon /></IconButton>
        <IconButton color="inherit" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}><SettingsIcon /></IconButton>

        <Box onClick={(e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 0.5, cursor: 'pointer', userSelect: 'none' }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#fff', color: colors.header, fontSize: 15 }}>A</Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Admin</Typography>
            <Typography sx={{ fontSize: 11, whiteSpace: 'nowrap' }}>System Administrator</Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ display: { xs: 'none', md: 'block' }, transform: anchor ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </Box>
        <Box sx={{ ml: 1.5, display: { xs: 'none', lg: 'block' }, whiteSpace: 'nowrap' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 500 }}>{date}</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{time}</Typography>
        </Box>
      </Toolbar>

      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, width: 220, borderRadius: 2, color: colors.text } } }}>
        <Box sx={{ px: 2, py: 1.2, display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Avatar sx={{ bgcolor: colors.header, width: 36, height: 36 }}>A</Avatar>
          <Box><Typography sx={{ fontSize: 13, fontWeight: 700 }}>Admin</Typography><Typography sx={{ fontSize: 11.5, color: colors.muted }}>System Administrator</Typography></Box>
        </Box>
        <Divider />
        <MenuItem onClick={() => { setAnchor(null); setProfileOpen(true); }}><ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>My Profile</MenuItem>
        <MenuItem onClick={() => { setAnchor(null); setLogout('confirm'); }} sx={{ color: colors.delete }}><ListItemIcon sx={{ color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>Logout</MenuItem>
      </Menu>

      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} slotProps={{ paper: { sx: { borderRadius: 3, width: 340, maxWidth: '92vw', color: colors.text } } }}>
        <Box sx={{ bgcolor: colors.header, height: 70 }} />
        <Box sx={{ px: 3, pb: 3, textAlign: 'center' }}>
          <Avatar sx={{ width: 72, height: 72, mx: 'auto', mt: -4.5, mb: 1, bgcolor: '#fff', color: colors.header, fontSize: 30, border: `3px solid ${colors.header}` }}>A</Avatar>
          <Typography sx={{ fontWeight: 700, fontSize: 16 }}>Admin</Typography>
          <Typography sx={{ fontSize: 12.5, color: colors.muted, mb: 2 }}>System Administrator</Typography>
          {[['Email', 'admin@hims.com'], ['Employee ID', 'EMP-0001'], ['Last Login', `${date}, ${time}`]].map(([k, v]) => (
            <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.9, borderTop: `1px solid ${colors.border}`, fontSize: 12.5 }}>
              <span style={{ color: colors.muted }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
            </Box>
          ))}
        </Box>
      </Dialog>

      <AppDialog open={logout === 'confirm'} variant="logout" title="Logout?" message="Are you sure you want to logout from HIMS?" confirmText="Yes, Logout"
        onConfirm={() => setLogout('done')} onClose={() => setLogout(null)} />
      <AppDialog open={logout === 'done'} variant="success" title="Logged Out" message="You have been logged out successfully. (Demo only - the login screen is not part of this preview.)" onClose={() => setLogout(null)} />
    </AppBar>
  );
}
