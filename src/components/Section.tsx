import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../theme';

export const Section = ({ title, icon, action, children }: { title: string; icon?: ReactNode; action?: ReactNode; children: ReactNode }) => (
  <Box sx={{ border: `1px solid ${colors.border}`, borderRadius: 1.5, bgcolor: '#fff', mb: 2, minWidth: 0 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.2, flexWrap: 'wrap' }}>
      <Box sx={{ color: colors.new, display: 'flex', '& svg': { fontSize: 18 } }}>{icon}</Box>
      <Typography sx={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: colors.update }}>{title}</Typography>
      {action}
    </Box>
    <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
  </Box>
);

export const FieldRow = ({ label, required, labelWidth = 115, children }: { label: string; required?: boolean; labelWidth?: number; children: ReactNode }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `${labelWidth}px minmax(0, 1fr)` }, alignItems: 'center', rowGap: 0.5, mb: 1.3 }}>
    <Typography sx={{ fontSize: 12.5 }}>{label}{required && <span style={{ color: colors.delete }}> *</span>}</Typography>
    {children}
  </Box>
);
