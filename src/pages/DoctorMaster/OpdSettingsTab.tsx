import { Box, Checkbox, FormControlLabel, MenuItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import NotesIcon from '@mui/icons-material/Notes';
import CrudTable from '../../components/CrudTable';
import { FieldRow, Section } from '../../components/Section';
import { useStored } from '../../data/tabData';
import { colors } from '../../theme';

interface Opd {
  opFee: string; followFee: string; followDays: string; duration: string; online: boolean; token: boolean;
  maxPatients: string; applicable: string[]; remarks: string;
}
interface Svc { id: string; code: string; name: string; isDefault: boolean }

const seedOpd: Opd = {
  opFee: '500.00', followFee: '300.00', followDays: '15', duration: '15', online: true, token: true, maxPatients: '60',
  applicable: ['General Patients', 'Insurance Patients', 'Cashless Patients'],
  remarks: 'OPD consultation settings and charges configured as per hospital policy.',
};
const seedSvc: Svc[] = [
  { id: 's1', code: 'S001', name: 'Consultation', isDefault: true },
  { id: 's2', code: 'S002', name: 'Follow Up Consultation', isDefault: false },
  { id: 's3', code: 'S003', name: 'Procedure Consultation', isDefault: false },
  { id: 's4', code: 'S004', name: 'Second Opinion', isDefault: false },
];
const patientTypes = ['General Patients', 'Corporate Patients', 'Insurance Patients', 'Cashless Patients', 'Package Patients', 'Credit Patients'];

const YesNo = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <RadioGroup row value={value ? 'yes' : 'no'} onChange={(e) => onChange(e.target.value === 'yes')}>
    <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
    <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
  </RadioGroup>
);

export default function OpdSettingsTab({ doctorCode }: { doctorCode: string }) {
  const [d, setD] = useStored<Opd>(`hims.opd.${doctorCode}`, seedOpd);
  const [svcs, setSvcs] = useStored<Svc[]>(`hims.opdsvc.${doctorCode}`, seedSvc);
  const set = <K extends keyof Opd>(k: K, v: Opd[K]) => setD({ ...d, [k]: v });
  const num = (k: 'opFee' | 'followFee' | 'followDays' | 'maxPatients') => (
    <TextField value={d[k]} onChange={(e) => set(k, e.target.value.replace(/[^\d.]/g, ''))} slotProps={{ htmlInput: { inputMode: 'decimal' } }}
      error={!d[k]} helperText={!d[k] ? 'This field is required' : undefined} />
  );
  const W = 200;

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5 }, display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) minmax(0,1fr)' }, columnGap: 2.5, alignItems: 'start' }}>
      <Box>
        <Section title="Consultation Settings" icon={<TuneIcon />}>
          <FieldRow label="OP Consultation Fee" labelWidth={W}>{num('opFee')}</FieldRow>
          <FieldRow label="Follow Up Consultation Fee" labelWidth={W}>{num('followFee')}</FieldRow>
          <FieldRow label="Follow Up Days" labelWidth={W}>{num('followDays')}</FieldRow>
          <FieldRow label="Consultation Duration (Minutes)" labelWidth={W}>
            <TextField select value={d.duration} onChange={(e) => set('duration', e.target.value)}>
              {['10', '15', '20', '30', '45', '60'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>
          </FieldRow>
          <FieldRow label="Allow Online Booking" labelWidth={W}><YesNo value={d.online} onChange={(v) => set('online', v)} /></FieldRow>
          <FieldRow label="Token Required" labelWidth={W}><YesNo value={d.token} onChange={(v) => set('token', v)} /></FieldRow>
          <FieldRow label="Maximum Patient Per Day" labelWidth={W}>{num('maxPatients')}</FieldRow>
        </Section>
        <Section title="OPD Charge Applicability" icon={<FactCheckIcon />}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {patientTypes.map((p) => (
              <FormControlLabel key={p} label={p} control={<Checkbox size="small" checked={d.applicable.includes(p)}
                onChange={(e) => set('applicable', e.target.checked ? [...d.applicable, p] : d.applicable.filter((v) => v !== p))} />} />
            ))}
          </Box>
        </Section>
      </Box>

      <Box>
        <CrudTable<Svc> title="OPD Service Mapping" icon={<MedicalServicesIcon />} addLabel="Add Service" rows={svcs} onChange={setSvcs}
          searchPlaceholder="Search service by code or name..." blank={() => ({ id: '', code: '', name: '', isDefault: false })}
          columns={[{ key: 'code', label: 'Service Code', required: true }, { key: 'name', label: 'Service Name', required: true }, { key: 'isDefault', label: 'Default', type: 'radio' }]} />
        <Section title="OPD Remarks" icon={<NotesIcon />}>
          <TextField multiline minRows={3} value={d.remarks} slotProps={{ htmlInput: { maxLength: 500 } }} onChange={(e) => set('remarks', e.target.value)} />
          <Typography sx={{ textAlign: 'right', fontSize: 11.5, color: colors.muted, mt: 0.5 }}>{d.remarks.length}/500</Typography>
        </Section>
      </Box>
    </Box>
  );
}
