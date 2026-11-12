import { useMemo, useState } from 'react';
import { Box, Button, InputAdornment, MenuItem, Pagination, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { colors } from '../../theme';
import { departments, type Doctor, specialities } from '../../data/doctors';

interface Props { doctors: Doctor[]; onSelect: (d: Doctor) => void; onDelete: (d: Doctor) => void }
const PAGE_SIZE = 8;
const filterField = { width: 135, '& .MuiOutlinedInput-root': { height: 34 } };
const money = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function DoctorList({ doctors, onSelect, onDelete }: Props) {
  const [draft, setDraft] = useState({ q: '', speciality: '', department: '', status: '' });
  const [applied, setApplied] = useState(draft);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => doctors.filter((d) => {
    const q = applied.q.toLowerCase();
    return (!q || [d.code, d.name, d.speciality, d.department].some((s) => s.toLowerCase().includes(q)))
      && (!applied.speciality || d.speciality === applied.speciality)
      && (!applied.department || d.department === applied.department)
      && (!applied.status || d.status === applied.status);
  }), [doctors, applied]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const start = (current - 1) * PAGE_SIZE;
  const view = rows.slice(start, start + PAGE_SIZE);

  const exportCsv = () => {
    const head = ['Code', 'Name', 'Speciality', 'Department', 'Mobile', 'OP Fee', 'IP Fee', 'Status'];
    const body = rows.map((d) => [d.code, d.name, d.speciality, d.department, d.mobile, d.feeOp, d.feeIp, d.status].join(','));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([[head.join(','), ...body].join('\n')], { type: 'text/csv' }));
    a.download = 'doctor-list.csv';
    a.click();
  };

  const sel = (key: 'speciality' | 'department' | 'status', opts: string[]) => (
    <TextField select value={draft[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} sx={filterField}
      slotProps={{ select: { displayEmpty: true, renderValue: (v: unknown) => (v as string) || '-- All --' } }}>
      <MenuItem value="">-- All --</MenuItem>
      {opts.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
    </TextField>
  );
  const th = { fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', color: colors.text, bgcolor: colors.tableHead, py: 1 };
  const td = { py: 0.8, fontSize: 12.5 };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
        <ListAltIcon sx={{ color: colors.update }} />
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: colors.update, mr: 1 }}>Doctor List</Typography>
        <TextField placeholder="Search by code, name, speciality, department..." value={draft.q} onChange={(e) => setDraft({ ...draft, q: e.target.value })}
          sx={{ flex: '1 1 260px', maxWidth: 380, '& .MuiOutlinedInput-root': { height: 34 } }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }} />
        <Typography sx={{ fontSize: 13 }}>Speciality</Typography>{sel('speciality', specialities)}
        <Typography sx={{ fontSize: 13 }}>Department</Typography>{sel('department', departments)}
        <Typography sx={{ fontSize: 13 }}>Status</Typography>{sel('status', ['Active', 'Inactive'])}
        <Button variant="contained" startIcon={<SearchIcon />} onClick={() => { setApplied(draft); setPage(1); }}>Search</Button>
        <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportCsv} sx={{ color: colors.text, borderColor: colors.border, bgcolor: '#fff' }}>Export</Button>
      </Box>

      <Box sx={{ border: `1px solid ${colors.border}`, borderRadius: 1, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={th} align="center">SL.No</TableCell><TableCell sx={th}>Doctor Code</TableCell><TableCell sx={th}>Doctor Name</TableCell>
              <TableCell sx={th}>Speciality</TableCell><TableCell sx={th}>Department</TableCell><TableCell sx={th}>Mobile No.</TableCell>
              <TableCell sx={th} align="right">Consultation Fee (OP)</TableCell><TableCell sx={th} align="right">Consultation Fee (IP)</TableCell>
              <TableCell sx={th} align="center">Status</TableCell><TableCell sx={th} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {view.map((d, i) => (
              <TableRow key={d.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#F8FAFE' } }}>
                <TableCell sx={td} align="center">{start + i + 1}</TableCell>
                <TableCell sx={td}>{d.code}</TableCell><TableCell sx={td}>{d.name}</TableCell>
                <TableCell sx={td}>{d.speciality}</TableCell><TableCell sx={td}>{d.department}</TableCell><TableCell sx={td}>{d.mobile}</TableCell>
                <TableCell sx={td} align="right">{money(d.feeOp)}</TableCell><TableCell sx={td} align="right">{money(d.feeIp)}</TableCell>
                <TableCell sx={td} align="center">
                  <Box sx={{ display: 'inline-block', px: 1.8, py: 0.15, borderRadius: 4, fontSize: 12.5, fontWeight: 500, bgcolor: d.status === 'Active' ? '#D5F2DD' : '#FAD4D4', color: d.status === 'Active' ? '#1B7F3A' : colors.delete }}>{d.status}</Box>
                </TableCell>
                <TableCell sx={td} align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, cursor: 'pointer' }}>
                    <VisibilityIcon fontSize="small" sx={{ color: colors.new }} onClick={() => onSelect(d)} />
                    <EditIcon fontSize="small" sx={{ color: colors.new }} onClick={() => onSelect(d)} />
                    <DeleteIcon fontSize="small" sx={{ color: colors.delete }} onClick={() => onDelete(d)} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {!view.length && <TableRow><TableCell colSpan={10} align="center" sx={{ py: 3, color: colors.muted }}>No records found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
        <Typography sx={{ fontSize: 13 }}>Showing {rows.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, rows.length)} of {rows.length} records</Typography>
        <Pagination count={pages} page={current} onChange={(_, p) => setPage(p)} color="primary" shape="rounded" size="small" variant="outlined" />
      </Box>
    </Box>
  );
}
