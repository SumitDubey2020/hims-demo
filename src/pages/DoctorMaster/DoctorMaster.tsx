import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Breadcrumbs, Button, Paper, Tab, Tabs, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SchoolIcon from '@mui/icons-material/School';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { colors } from '../../theme';
import { type Doctor, emptyDoctor, loadDoctors, saveDoctors } from '../../data/doctors';
import { validateDoctor } from '../../data/validation';
import AppDialog, { type DialogVariant } from '../../components/AppDialog';
import BasicDetails from './BasicDetails';
import DoctorList from './DoctorList';
import QualificationTab from './QualificationTab';
import OpdSettingsTab from './OpdSettingsTab';

const tabs = [
  { label: 'Basic Details', icon: <PersonIcon /> }, { label: 'Qualification & Experience', icon: <SchoolIcon /> },
  { label: 'OPD Settings', icon: <VaccinesIcon /> }, { label: 'IPD / Other Charges', icon: <HotelIcon /> },
  { label: 'Availability', icon: <CalendarMonthIcon /> }, { label: 'Documents', icon: <DescriptionIcon /> },
  { label: 'Remarks', icon: <RateReviewIcon /> },
];
const nextCode = (list: Doctor[]) => `D${String(Math.max(0, ...list.map((d) => Number(d.code.slice(1)) || 0)) + 1).padStart(4, '0')}`;
const card = { border: `1px solid ${colors.border}`, borderRadius: 2, bgcolor: '#fff', mb: 2.5 };

interface Dlg { variant: DialogVariant; title: string; message: ReactNode; confirmText?: string; onConfirm?: () => void }

export default function DoctorMaster() {
  const [doctors, setDoctors] = useState<Doctor[]>(loadDoctors);
  const [form, setForm] = useState<Doctor>(doctors[0]);
  const [tab, setTab] = useState(0);
  const [dlg, setDlg] = useState<Dlg | null>(null);
  const [submitted, setSubmitted] = useState(false); // true after Save/Update is clicked: shows all field messages
  const [formKey, setFormKey] = useState(0); // remounts the form to clear 'touched' state

  // success popups close themselves
  useEffect(() => {
    if (dlg?.variant !== 'success') return;
    const t = setTimeout(() => setDlg(null), 2500);
    return () => clearTimeout(t);
  }, [dlg]);

  const persist = (list: Doctor[]) => { setDoctors(list); saveDoctors(list); };
  const exists = doctors.some((d) => d.id === form.id);
  const error = (title: string, message: string) => setDlg({ variant: 'error', title, message });
  const success = (title: string, message: string) => setDlg({ variant: 'success', title, message });

  const errors = useMemo(() => validateDoctor(form, doctors, !exists), [form, doctors, exists]);
  const validate = () => {
    setSubmitted(true);
    if (Object.keys(errors).length) { setTab(0); window.scrollTo({ top: 0, behavior: 'smooth' }); return false; }
    return true;
  };
  const resetFeedback = () => { setSubmitted(false); setFormKey((k) => k + 1); };

  const onNew = () => { setForm(emptyDoctor(nextCode(doctors))); resetFeedback(); };

  const onSave = () => {
    if (!validate()) return;
    setDlg({
      variant: 'save', title: 'Save Doctor?', message: `Do you want to save ${form.name} (${form.code})?`, confirmText: 'Yes, Save',
      onConfirm: () => { persist([{ ...form, id: form.code }, ...doctors]); success('Saved Successfully', `${form.name} has been added to the doctor list.`); },
    });
  };

  const onUpdate = () => {
    if (!exists) return error('No Doctor Selected', 'Select a doctor from the list to update.');
    if (!validate()) return;
    setDlg({
      variant: 'update', title: 'Update Doctor?', message: `Do you want to update the details of ${form.name} (${form.code})?`, confirmText: 'Yes, Update',
      onConfirm: () => { persist(doctors.map((d) => (d.id === form.id ? form : d))); success('Updated Successfully', `${form.name}'s details have been updated.`); },
    });
  };

  const askDelete = (d: Doctor) => setDlg({
    variant: 'delete', title: 'Delete Doctor?', confirmText: 'Yes, Delete',
    message: `Are you sure you want to delete ${d.name} (${d.code})? This action cannot be undone.`,
    onConfirm: () => {
      persist(doctors.filter((x) => x.id !== d.id));
      if (d.id === form.id) onNew();
      success('Deleted Successfully', `${d.name} has been removed from the doctor list.`);
    },
  });

  // Edit / View in the list: load into the form and bring the form into view
  const selectDoctor = (d: Doctor) => {
    setForm(d); setTab(0); resetFeedback();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const btn = (label: string, icon: ReactNode, bg: string, onClick: () => void) => (
    <Button variant="contained" startIcon={icon} onClick={onClick} sx={{ bgcolor: bg, px: 2, height: 36, fontSize: 13, '&:hover': { bgcolor: bg, filter: 'brightness(0.92)' } }}>{label}</Button>
  );

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
      <Breadcrumbs separator="›" sx={{ mb: 1, '& ol': { justifyContent: 'flex-end' } }}>
        <Typography sx={{ fontSize: 12 }}>Home</Typography><Typography sx={{ fontSize: 12 }}>Master Setup</Typography>
        <Typography sx={{ fontSize: 12, color: colors.new, fontWeight: 600 }}>Doctor Master</Typography>
      </Breadcrumbs>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Avatar variant="rounded" sx={{ bgcolor: colors.new, width: 44, height: 44 }}><PersonIcon /></Avatar>
        <Box sx={{ flex: '1 1 320px' }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>Doctor Master</Typography>
          <Typography sx={{ fontSize: 12.5, color: colors.muted }}>Create and manage doctor details, consultation fees and department mapping</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {btn('New', <AddIcon />, colors.new, onNew)}
          {btn('Save', <SaveIcon />, colors.save, onSave)}
          {btn('Update', <EditNoteIcon />, colors.update, onUpdate)}
          {btn('Delete', <DeleteIcon />, colors.delete, () => (exists ? askDelete(form) : error('No Doctor Selected', 'Select a doctor from the list to delete.')))}
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onNew} sx={{ height: 36, fontSize: 13, bgcolor: '#fff', color: colors.text, borderColor: colors.border }}>Clear</Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={card}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ bgcolor: '#F4F7FD', borderBottom: `1px solid ${colors.border}`, borderRadius: '8px 8px 0 0', minHeight: 44 }}>
          {tabs.map((t) => (
            <Tab key={t.label} icon={t.icon} iconPosition="start" label={t.label}
              sx={{ minHeight: 44, fontSize: 13, px: 2, color: colors.muted, '&.Mui-selected': { color: colors.new, bgcolor: '#fff' } }} />
          ))}
        </Tabs>
        {tab === 0 ? <BasicDetails key={formKey} value={form} onChange={(p) => setForm({ ...form, ...p })} lastConsultation="20/10/2026" errors={errors} showAll={submitted} />
          : tab === 1 ? <QualificationTab doctorCode={form.code} />
          : tab === 2 ? <OpdSettingsTab doctorCode={form.code} />
          : <Box sx={{ p: 6, textAlign: 'center', color: colors.muted }}>{tabs[tab].label} — coming soon</Box>}
      </Paper>

      <Paper elevation={0} sx={card}>
        <DoctorList doctors={doctors} onSelect={selectDoctor} onDelete={askDelete} />
      </Paper>

      {dlg && <AppDialog open variant={dlg.variant} title={dlg.title} message={dlg.message} confirmText={dlg.confirmText} onConfirm={dlg.onConfirm} onClose={() => setDlg(null)} />}
    </Box>
  );
}
