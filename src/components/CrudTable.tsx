import { type ReactNode, useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Radio, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { colors } from '../theme';
import { newId } from '../data/tabData';
import { Section } from './Section';

export interface Col<T> { key: keyof T & string; label: string; type?: 'text' | 'date' | 'number' | 'radio'; required?: boolean }
interface Props<T extends { id: string }> {
  title: string; icon?: ReactNode; addLabel: string; columns: Col<T>[]; rows: T[];
  onChange: (rows: T[]) => void; blank: () => T; searchPlaceholder?: string;
}

const fmt = (v: unknown) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v.split('-').reverse().join('/') : String(v ?? ''));
const th = { fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', bgcolor: colors.tableHead, py: 0.9 } as const;
const td = { fontSize: 12.5, py: 0.7, whiteSpace: 'nowrap' } as const;

export default function CrudTable<T extends { id: string }>({ title, icon, addLabel, columns, rows, onChange, blank, searchPlaceholder }: Props<T>) {
  const [editing, setEditing] = useState<T | null>(null);
  const [q, setQ] = useState('');
  const [tried, setTried] = useState(false);
  const isNew = editing ? !rows.some((r) => r.id === editing.id) : false;
  const view = useMemo(() => rows.filter((r) => !q || Object.values(r).some((v) => String(v).toLowerCase().includes(q.toLowerCase()))), [rows, q]);
  const fields = columns.filter((c) => c.type !== 'radio');
  const valid = editing && fields.every((c) => !c.required || String(editing[c.key] ?? '').trim());

  const save = () => {
    if (!editing) return;
    if (!valid) { setTried(true); return; }
    onChange(isNew ? [...rows, editing] : rows.map((r) => (r.id === editing.id ? editing : r)));
    setEditing(null);
    setTried(false);
  };

  return (
    <Section title={title} icon={icon}
      action={<Button size="small" variant="contained" startIcon={<AddIcon />} sx={{ fontSize: 12 }} onClick={() => { setTried(false); setEditing({ ...blank(), id: newId() }); }}>{addLabel}</Button>}>
      {searchPlaceholder && (
        <TextField placeholder={searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} sx={{ mb: 1.5 }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }} />
      )}
      <Box sx={{ border: `1px solid ${colors.border}`, borderRadius: 1, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={th}>SL.No.</TableCell>
              {columns.map((c) => <TableCell key={c.key} sx={th} align={c.type === 'radio' ? 'center' : 'left'}>{c.label}{c.required && <span style={{ color: colors.delete }}> *</span>}</TableCell>)}
              <TableCell sx={th} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {view.map((r, i) => (
              <TableRow key={r.id} hover>
                <TableCell sx={td}>{i + 1}</TableCell>
                {columns.map((c) => (
                  <TableCell key={c.key} sx={td} align={c.type === 'radio' ? 'center' : 'left'}>
                    {c.type === 'radio'
                      ? <Radio size="small" sx={{ p: 0.3 }} checked={Boolean(r[c.key])} onChange={() => onChange(rows.map((x) => ({ ...x, [c.key]: x.id === r.id })))} />
                      : fmt(r[c.key])}
                  </TableCell>
                ))}
                <TableCell sx={td} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, cursor: 'pointer' }}>
                    <EditIcon sx={{ fontSize: 16, color: colors.new }} onClick={() => setEditing(r)} />
                    <DeleteIcon sx={{ fontSize: 16, color: colors.delete }} onClick={() => onChange(rows.filter((x) => x.id !== r.id))} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {!view.length && <TableRow><TableCell colSpan={columns.length + 2} align="center" sx={{ ...td, color: colors.muted, py: 2 }}>No records</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontSize: 15, fontWeight: 700 }}>{isNew ? addLabel : `Edit ${title}`}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: '8px !important' }}>
          {editing && fields.map((c) => (
            <TextField key={c.key} label={c.label} required={c.required} type={c.type === 'date' ? 'date' : 'text'}
              slotProps={{ inputLabel: { shrink: true, sx: { fontSize: 13 } } }} value={String(editing[c.key] ?? '')}
              error={tried && !!c.required && !String(editing[c.key] ?? '').trim()}
              helperText={tried && c.required && !String(editing[c.key] ?? '').trim() ? `${c.label} is required` : undefined}
              onChange={(e) => setEditing({ ...editing, [c.key]: e.target.value } as T)} />
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Section>
  );
}
