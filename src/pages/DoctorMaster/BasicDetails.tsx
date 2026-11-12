import { type ChangeEvent, type ReactNode, useRef, useState } from 'react';
import { Avatar, Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, MenuItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import AirlineSeatFlatIcon from '@mui/icons-material/AirlineSeatFlat';
import EventIcon from '@mui/icons-material/Event';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { colors } from '../../theme';
import { categories, councils, departments, type Doctor, opIpOptions, reportingList, rooms, specialities } from '../../data/doctors';
import { type Errors, okMessages } from '../../data/validation';

interface Props { value: Doctor; onChange: (patch: Partial<Doctor>) => void; lastConsultation: string; errors: Errors; showAll: boolean }

const Row = ({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '115px minmax(0, 1fr)' }, alignItems: 'start', rowGap: 0.5, mb: 1.3 }}>
    <Typography sx={{ fontSize: 12.5, color: colors.text, pt: { sm: '10px' } }}>
      {label}{required && <span style={{ color: colors.delete }}> *</span>}
    </Typography>
    {children}
  </Box>
);

const Select = ({ value, options, onChange, sx, extra }: { value: string; options: string[]; onChange: (v: string) => void; sx?: object; extra?: object }) => (
  <TextField select value={value} onChange={(e) => onChange(e.target.value)} sx={sx} {...extra}
    slotProps={{ select: { displayEmpty: true, renderValue: (v: unknown) => (v as string) || <span style={{ color: '#9AA6BF' }}>Select</span> } }}>
    {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
  </TextField>
);

const StatCard = ({ icon, bg, color, label, value }: { icon: ReactNode; bg: string; color: string; label: string; value: ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.8 }}>
    <Avatar sx={{ bgcolor: bg, color, width: 46, height: 46 }}>{icon}</Avatar>
    <Box>
      <Typography sx={{ fontSize: 12.5, color: colors.text }}>{label}</Typography>
      {value}
    </Box>
  </Box>
);

export default function BasicDetails({ value: d, onChange, lastConsultation, errors, showAll }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState<Partial<Record<keyof Doctor, boolean>>>({});
  const set = (k: keyof Doctor) => (e: ChangeEvent<HTMLInputElement>) => onChange({ [k]: e.target.value } as Partial<Doctor>);
  const blur = (k: keyof Doctor) => () => setTouched((t) => ({ ...t, [k]: true }));

  /** Inline feedback for a field: red error text, or green success text once valid. */
  const fp = (k: keyof Doctor) => {
    if (!showAll && !touched[k]) return {};
    if (errors[k]) return { error: true, helperText: errors[k] };
    if (d[k] && okMessages[k]) return { helperText: <span style={{ color: colors.save }}>✓ {okMessages[k]}</span> };
    return {};
  };
  const selectProps = (k: keyof Doctor) => ({ ...fp(k), onBlur: blur(k) });

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.size > 1024 * 1024) return;
    const r = new FileReader();
    r.onload = () => onChange({ photo: r.result as string });
    r.readAsDataURL(f);
  };
  const active = d.status === 'Active';

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5 }, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      <Box sx={{ flex: '1 1 620px', minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', columnGap: 3, alignItems: 'start' }}>
        {/* Column 1 */}
        <Box>
          <Row label="Doctor Code" required>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField value={d.code} onChange={set('code')} onBlur={blur('code')} {...fp('code')} sx={{ flex: 1 }} />
              <IconButton sx={{ bgcolor: colors.new, color: '#fff', borderRadius: 1, width: 38, height: 38, '&:hover': { bgcolor: colors.update } }}><SearchIcon /></IconButton>
            </Box>
          </Row>
          <Row label="Doctor Name" required><TextField value={d.name} onChange={set('name')} onBlur={blur('name')} {...fp('name')} /></Row>
          <Row label="Gender" required>
            <RadioGroup row value={d.gender} onChange={(e) => onChange({ gender: e.target.value as Doctor['gender'] })}>
              {['Male', 'Female', 'Others'].map((g) => <FormControlLabel key={g} value={g} control={<Radio size="small" />} label={g} />)}
            </RadioGroup>
          </Row>
          <Row label="Speciality" required><Select value={d.speciality} options={specialities} onChange={(v) => onChange({ speciality: v })} extra={selectProps('speciality')} /></Row>
          <Row label="Department" required><Select value={d.department} options={departments} onChange={(v) => onChange({ department: v })} extra={selectProps('department')} /></Row>
          <Row label="Designation"><TextField value={d.designation} onChange={set('designation')} /></Row>
          <Row label="Category"><Select value={d.category} options={categories} onChange={(v) => onChange({ category: v })} /></Row>
          <Row label="OP/IP">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Select value={d.opIp} options={opIpOptions} onChange={(v) => onChange({ opIp: v })} sx={{ width: 145 }} />
              <FormControlLabel label="Panel Doctor" control={<Checkbox checked={d.panelDoctor} onChange={(e) => onChange({ panelDoctor: e.target.checked })} />} />
            </Box>
          </Row>
          <Row label="Status" required>
            <Select value={d.status} options={['Active', 'Inactive']} onChange={(v) => onChange({ status: v as Doctor['status'] })}
              sx={{ width: 145, '& .MuiOutlinedInput-root': { bgcolor: active ? '#DFF5E5' : '#FDE3E3', color: active ? '#1B7F3A' : colors.delete } }} />
          </Row>
        </Box>

        {/* Column 2 */}
        <Box>
          <Row label="Registration No." required><TextField value={d.regNo} onChange={set('regNo')} onBlur={blur('regNo')} {...fp('regNo')} /></Row>
          <Row label="Registration Council"><Select value={d.regCouncil} options={councils} onChange={(v) => onChange({ regCouncil: v })} /></Row>
          <Row label="Registration Valid Till">
            <TextField type="date" value={d.regValidTill} onChange={set('regValidTill')} onBlur={blur('regValidTill')} {...fp('regValidTill')}
              slotProps={{ input: { endAdornment: <InputAdornment position="end"><CalendarMonthIcon fontSize="small" sx={{ color: colors.muted }} /></InputAdornment> } }} />
          </Row>
          <Row label="Mobile No." required>
            <TextField value={d.mobile} onChange={(e) => onChange({ mobile: e.target.value.replace(/\D/g, '') })} onBlur={blur('mobile')} {...fp('mobile')} slotProps={{ htmlInput: { maxLength: 10, inputMode: 'numeric' } }} />
          </Row>
          <Row label="Email"><TextField value={d.email} onChange={set('email')} onBlur={blur('email')} {...fp('email')} /></Row>
          <Row label="Landline No."><TextField value={d.landline} onChange={set('landline')} onBlur={blur('landline')} {...fp('landline')} /></Row>
          <Row label="Consultation Room"><Select value={d.room} options={rooms} onChange={(v) => onChange({ room: v })} /></Row>
          <Row label="Reporting To"><Select value={d.reportingTo} options={reportingList} onChange={(v) => onChange({ reportingTo: v })} /></Row>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Photo */}
        <Box sx={{ width: { xs: '100%', sm: 200 }, boxSizing: 'border-box', bgcolor: '#F4F7FD', border: `1px solid ${colors.border}`, borderRadius: 1.5, p: 2, textAlign: 'center' }}>
          <Avatar variant="rounded" src={d.photo} sx={{ width: 122, height: 135, mx: 'auto', mb: 1.5, bgcolor: '#DCE6F5', color: '#8FA3C6' }}>
            <PersonIcon sx={{ fontSize: 80 }} />
          </Avatar>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={onFile} />
          <Box sx={{ display: 'flex', gap: 0.8, justifyContent: 'center' }}>
            <Button size="small" variant="contained" onClick={() => fileRef.current?.click()} sx={{ fontSize: 11.5, px: 1 }}>Upload Photo</Button>
            <Button size="small" variant="contained" color="error" onClick={() => onChange({ photo: undefined })} sx={{ fontSize: 11.5, px: 1 }}>Remove</Button>
          </Box>
          <Typography sx={{ mt: 1.5, fontSize: 11.5, color: colors.muted }}>JPG/PNG (Max 1 MB)</Typography>
        </Box>

        {/* Quick Information */}
        <Box sx={{ width: { xs: '100%', sm: 240 }, flexShrink: 0, bgcolor: '#F4F7FD', borderRadius: 1.5, overflow: 'hidden' }}>
          <Typography sx={{ bgcolor: '#DCE8F8', color: colors.update, fontWeight: 700, fontSize: 14, px: 2, py: 1 }}>Quick Information</Typography>
          <Box sx={{ p: 2.5, pb: 1 }}>
            <StatCard icon={<GroupsIcon />} bg="#DDF3E4" color="#1E9E4A" label="Total OP Consultations"
              value={<Typography sx={{ fontWeight: 700, fontSize: 16, color: '#1E9E4A' }}>1,245</Typography>} />
            <StatCard icon={<AirlineSeatFlatIcon />} bg="#DCE6F7" color={colors.update} label="Total IP Consultations"
              value={<Typography sx={{ fontWeight: 700, fontSize: 16 }}>320</Typography>} />
            <StatCard icon={<EventIcon />} bg="#E8DDF5" color="#7B3FC4" label="Last Consultation Date"
              value={<Typography sx={{ fontWeight: 700, fontSize: 16 }}>{lastConsultation}</Typography>} />
            <StatCard icon={<VerifiedUserIcon />} bg="#DDF3E4" color="#1E9E4A" label="Status"
              value={<Box sx={{ mt: 0.3, px: 1.5, py: 0.2, borderRadius: 4, fontWeight: 700, fontSize: 13, display: 'inline-block', bgcolor: active ? '#CDEFD6' : '#FAD4D4', color: active ? '#1B7F3A' : colors.delete }}>{d.status}</Box>} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
