import { type MouseEvent, type ReactNode, useState } from 'react';
import { Badge, Box, Button, IconButton, Popover, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ScienceIcon from '@mui/icons-material/Science';
import EventIcon from '@mui/icons-material/Event';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { colors, thinScroll } from '../theme';

type Kind = 'lab' | 'appointment' | 'billing' | 'alert' | 'info';
interface Notif { id: number; kind: Kind; title: string; text: string; time: string; read: boolean }

const kinds: Record<Kind, { icon: ReactNode; color: string; bg: string }> = {
  lab: { icon: <ScienceIcon />, color: '#7B3FC4', bg: '#EFE5FA' },
  appointment: { icon: <EventIcon />, color: colors.save, bg: '#E3F6E9' },
  billing: { icon: <ReceiptIcon />, color: colors.new, bg: '#E3EFFD' },
  alert: { icon: <WarningIcon />, color: '#E08A00', bg: '#FFF1D6' },
  info: { icon: <InfoIcon />, color: colors.muted, bg: '#EDF1F7' },
};

const seed: Notif[] = [
  { id: 1, kind: 'lab', title: 'Lab report ready', text: 'CBC report for UHID 100234 is available.', time: '5 min ago', read: false },
  { id: 2, kind: 'appointment', title: 'New appointment', text: 'Dr. Ramesh Kumar - OPD 1 at 11:30 AM.', time: '20 min ago', read: false },
  { id: 3, kind: 'alert', title: 'Registration expiring', text: 'Dr. Kiran Varma registration expires in 30 days.', time: '1 hr ago', read: false },
  { id: 4, kind: 'billing', title: 'Payment received', text: 'Rs. 4,500 received for bill #B-20871.', time: '2 hrs ago', read: true },
  { id: 5, kind: 'info', title: 'Doctor profile updated', text: 'Dr. Priya Sharma consultation fee was revised.', time: '3 hrs ago', read: true },
  { id: 6, kind: 'lab', title: 'Critical value flagged', text: 'Potassium result needs review (UHID 100198).', time: 'Yesterday', read: true },
  { id: 7, kind: 'appointment', title: 'Appointment cancelled', text: 'Dr. Anil Reddy - 4:00 PM slot is now free.', time: 'Yesterday', read: true },
  { id: 8, kind: 'billing', title: 'Insurance claim approved', text: 'Claim #C-5532 approved by the TPA.', time: '2 days ago', read: true },
  { id: 9, kind: 'info', title: 'System maintenance', text: 'Scheduled backup on Sunday at 2:00 AM.', time: '3 days ago', read: true },
];

export default function NotificationMenu() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [items, setItems] = useState(seed);
  const unread = items.filter((n) => !n.read).length;

  return (
    <>
      <IconButton color="inherit" onClick={(e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}>
        <Badge badgeContent={unread} color="error"><NotificationsIcon /></Badge>
      </IconButton>
      <Popover open={!!anchor} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 360, maxWidth: '94vw', mt: 1, borderRadius: 2, overflow: 'hidden' } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.3, borderBottom: `1px solid ${colors.border}`, bgcolor: '#F4F7FD' }}>
          <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 700 }}>Notifications {unread > 0 && <span style={{ color: colors.new }}>({unread})</span>}</Typography>
          <Button size="small" disabled={!unread} onClick={() => setItems(items.map((n) => ({ ...n, read: true })))} sx={{ fontSize: 12 }}>Mark all as read</Button>
        </Box>
        <Box sx={{ maxHeight: 360, overflowY: 'auto', ...thinScroll() }}>
          {items.map((n) => {
            const k = kinds[n.kind];
            return (
              <Box key={n.id} onClick={() => setItems(items.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
                sx={{ display: 'flex', gap: 1.5, px: 2, py: 1.3, cursor: 'pointer', bgcolor: n.read ? '#fff' : '#F3F8FF', borderBottom: `1px solid ${colors.border}`, '&:hover': { bgcolor: '#EAF2FD' } }}>
                <Box sx={{ width: 34, height: 34, flexShrink: 0, borderRadius: '50%', bgcolor: k.bg, color: k.color, display: 'grid', placeItems: 'center', '& svg': { fontSize: 18 } }}>{k.icon}</Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: n.read ? 500 : 700 }}>{n.title}</Typography>
                  <Typography sx={{ fontSize: 12, color: colors.muted }}>{n.text}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#9AA6BF', mt: 0.3 }}>{n.time}</Typography>
                </Box>
                {!n.read && <Box sx={{ width: 8, height: 8, mt: 0.8, borderRadius: '50%', bgcolor: colors.new, flexShrink: 0 }} />}
              </Box>
            );
          })}
        </Box>
        <Box sx={{ textAlign: 'center', py: 0.8, borderTop: `1px solid ${colors.border}` }}>
          <Button size="small" sx={{ fontSize: 12 }}>View all notifications</Button>
        </Box>
      </Popover>
    </>
  );
}
