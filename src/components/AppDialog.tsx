import type { ReactNode } from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LogoutIcon from '@mui/icons-material/Logout';
import { colors } from '../theme';

export type DialogVariant = 'delete' | 'save' | 'update' | 'success' | 'error' | 'logout';

const cfg: Record<DialogVariant, { color: string; bg: string; icon: ReactNode }> = {
  delete: { color: colors.delete, bg: '#FDE8E8', icon: <DeleteIcon /> },
  save: { color: colors.save, bg: '#E3F6E9', icon: <SaveIcon /> },
  update: { color: colors.new, bg: '#E3EFFD', icon: <EditIcon /> },
  success: { color: colors.save, bg: '#E3F6E9', icon: <CheckCircleIcon /> },
  error: { color: colors.delete, bg: '#FDE8E8', icon: <ErrorIcon /> },
  logout: { color: '#F59E0B', bg: '#FEF3C7', icon: <LogoutIcon /> },
};

interface Props {
  open: boolean; variant: DialogVariant; title: string; message: ReactNode;
  confirmText?: string; cancelText?: string; onConfirm?: () => void; onClose: () => void;
}

/** One popup for every message: confirm (delete/save/update/logout) when onConfirm is given, otherwise an info popup with OK. */
export default function AppDialog({ open, variant, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onClose }: Props) {
  const c = cfg[variant];
  return (
    <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: { borderRadius: 3, width: 390, maxWidth: '92vw', overflow: 'hidden' } } }}>
      <Box sx={{ height: 5, bgcolor: c.color }} />
      <Box sx={{ px: 3, pt: 3, pb: 2.5, textAlign: 'center' }}>
        <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: '50%', bgcolor: c.bg, color: c.color, display: 'grid', placeItems: 'center', '& svg': { fontSize: 32 } }}>
          {c.icon}
        </Box>
        <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 0.8 }}>{title}</Typography>
        <Typography sx={{ fontSize: 13, color: colors.muted, lineHeight: 1.55 }}>{message}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 3 }}>
          {onConfirm ? (
            <>
              <Button variant="outlined" onClick={onClose} sx={{ minWidth: 100, color: colors.text, borderColor: colors.border }}>{cancelText}</Button>
              <Button variant="contained" onClick={onConfirm} sx={{ minWidth: 110, bgcolor: c.color, '&:hover': { bgcolor: c.color, filter: 'brightness(0.92)' } }}>{confirmText}</Button>
            </>
          ) : (
            <Button variant="contained" onClick={onClose} sx={{ minWidth: 110, bgcolor: c.color, '&:hover': { bgcolor: c.color, filter: 'brightness(0.92)' } }}>OK</Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
