import { useState, type ReactNode } from 'react';
import { Box, Collapse, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HotelIcon from '@mui/icons-material/Hotel';
import PaymentsIcon from '@mui/icons-material/Payments';
import ScienceIcon from '@mui/icons-material/Science';
import BiotechIcon from '@mui/icons-material/Biotech';
import MedicationIcon from '@mui/icons-material/Medication';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { colors, thinScroll } from '../theme';

export const SIDEBAR_WIDTH = 232;

interface MenuItem { label: string; icon: ReactNode; arrow: boolean }
const topMenu: MenuItem[] = [
  { label: 'Dashboard', icon: <HomeIcon />, arrow: false },
  { label: 'Patient Management', icon: <PersonIcon />, arrow: true },
  { label: 'OPD Management', icon: <MedicalServicesIcon />, arrow: true },
  { label: 'IPD Management', icon: <HotelIcon />, arrow: true },
  { label: 'Billing', icon: <PaymentsIcon />, arrow: true },
  { label: 'Laboratory', icon: <ScienceIcon />, arrow: true },
  { label: 'Radiology', icon: <BiotechIcon />, arrow: true },
  { label: 'Pharmacy', icon: <MedicationIcon />, arrow: true },
  { label: 'Inventory', icon: <Inventory2Icon />, arrow: true },
];
const bottomMenu: MenuItem[] = [
  { label: 'Reports', icon: <BarChartIcon />, arrow: true },
  { label: 'Administration', icon: <SettingsIcon />, arrow: true },
];
const masterSetupItems = ['Doctor Master', 'Referral Master', 'Service Master', 'Investigation Master', 'IP Service Master',
  'Ward Master', 'Package Master', 'Category Master', 'Product Master', 'Supplier Master'];

const itemSx = { color: '#fff', py: 0.7, px: 2.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } };
const iconSx = { color: '#fff', minWidth: 30, '& svg': { fontSize: 17 } };

// Demo: only "Master Setup > Doctor Master" is live. Other items are intentionally inert (no routing).
export default function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const [open, setOpen] = useState(true);
  const isDesktop = useMediaQuery(useTheme().breakpoints.up('md'));

  const renderItem = (m: MenuItem) => (
    <ListItemButton key={m.label} sx={itemSx} disableRipple>
      <ListItemIcon sx={iconSx}>{m.icon}</ListItemIcon>
      <ListItemText primary={m.label} slotProps={{ primary: { noWrap: true, sx: { fontSize: 11.5 } } }} />
      {m.arrow && <ExpandMoreIcon sx={{ fontSize: 16 }} />}
    </ListItemButton>
  );

  return (
    <Drawer variant={isDesktop ? 'permanent' : 'temporary'} open={isDesktop || mobileOpen} onClose={onClose} ModalProps={{ keepMounted: true }}
      sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: 0, '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, bgcolor: colors.sidebar, border: 0, top: 60, height: 'calc(100% - 60px)', overflowX: 'hidden', ...thinScroll('#A3AEC2') } }}>
      <List disablePadding sx={{ mt: 0.5 }}>
        {topMenu.map(renderItem)}
        <ListItemButton onClick={() => setOpen(!open)} sx={{ ...itemSx, bgcolor: colors.sidebarActive, '&:hover': { bgcolor: colors.sidebarActive } }}>
          <ListItemIcon sx={iconSx}><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Master Setup" slotProps={{ primary: { noWrap: true, sx: { fontSize: 11.5, fontWeight: 600 } } }} />
          {open ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
        </ListItemButton>
        <Collapse in={open}>
          <List disablePadding sx={{ bgcolor: 'rgba(0,0,0,0.12)' }}>
            {masterSetupItems.map((s, i) => (
              <ListItemButton key={s} disableRipple sx={{ ...itemSx, py: 0.5, pl: 3.5, bgcolor: i === 0 ? colors.sidebarActive : 'transparent', '&:hover': { bgcolor: i === 0 ? colors.sidebarActive : 'rgba(255,255,255,0.08)' } }}>
                <FiberManualRecordIcon sx={{ fontSize: 6, mr: 1.5 }} />
                <ListItemText primary={s} slotProps={{ primary: { noWrap: true, sx: { fontSize: 11 } } }} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
        <Box sx={{ px: 2.5, my: 1 }}><Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} /></Box>
        {bottomMenu.map(renderItem)}
      </List>
    </Drawer>
  );
}
