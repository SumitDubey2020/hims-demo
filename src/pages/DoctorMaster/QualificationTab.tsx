import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import InfoIcon from '@mui/icons-material/Info';
import CrudTable from '../../components/CrudTable';
import { FieldRow, Section } from '../../components/Section';
import { useStored } from '../../data/tabData';

interface Qual { id: string; qualification: string; university: string; year: string }
interface Exp { id: string; organisation: string; from: string; to: string; designation: string }
interface Extra { expertise: string; memberships: string; awards: string; languages: string[]; others: string }

const seedQ: Qual[] = [
  { id: 'q1', qualification: 'MBBS', university: 'Andhra University', year: '2002' },
  { id: 'q2', qualification: 'MD - General Medicine', university: 'NTR University', year: '2006' },
  { id: 'q3', qualification: 'DM - Cardiology', university: 'AIIMS', year: '2010' },
];
const seedE: Exp[] = [
  { id: 'e1', organisation: 'City Care Hospital', from: '2010-06-01', to: '2015-05-31', designation: 'Consultant' },
  { id: 'e2', organisation: 'Sunshine Hospitals', from: '2015-06-01', to: '2019-12-31', designation: 'Senior Consultant' },
];
const seedX: Extra = {
  expertise: 'Interventional Cardiology, Cardiac Electrophysiology', memberships: 'Indian Medical Association (IMA)',
  awards: 'Best Cardiologist Award - 2018', languages: ['English', 'Telugu'], others: '',
};
const langs = ['English', 'Hindi', 'Telugu', 'Others'];

export default function QualificationTab({ doctorCode }: { doctorCode: string }) {
  const [quals, setQuals] = useStored<Qual[]>(`hims.qual.${doctorCode}`, seedQ);
  const [exps, setExps] = useStored<Exp[]>(`hims.exp.${doctorCode}`, seedE);
  const [x, setX] = useStored<Extra>(`hims.extra.${doctorCode}`, seedX);
  const text = (k: 'expertise' | 'memberships' | 'awards' | 'others', rows = 1) => (
    <TextField multiline minRows={rows} value={x[k]} onChange={(e) => setX({ ...x, [k]: e.target.value })} />
  );

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
      <CrudTable<Qual> title="Educational Qualification" icon={<SchoolIcon />} addLabel="Add Qualification" rows={quals} onChange={setQuals}
        blank={() => ({ id: '', qualification: '', university: '', year: '' })}
        columns={[{ key: 'qualification', label: 'Qualification', required: true }, { key: 'university', label: 'University / Board' }, { key: 'year', label: 'Year of Passing' }]} />
      <CrudTable<Exp> title="Work Experience" icon={<WorkIcon />} addLabel="Add Experience" rows={exps} onChange={setExps}
        blank={() => ({ id: '', organisation: '', from: '', to: '', designation: '' })}
        columns={[{ key: 'organisation', label: 'Organisation', required: true }, { key: 'from', label: 'From Date', type: 'date' }, { key: 'to', label: 'To Date', type: 'date' }, { key: 'designation', label: 'Designation' }]} />
      <Section title="Additional Details" icon={<InfoIcon />}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, columnGap: 3 }}>
          <Box>
            <FieldRow label="Areas of Expertise" labelWidth={130}>{text('expertise', 2)}</FieldRow>
            <FieldRow label="Awards & Recognitions" labelWidth={130}>{text('awards', 2)}</FieldRow>
          </Box>
          <Box>
            <FieldRow label="Memberships" labelWidth={130}>{text('memberships')}</FieldRow>
            <FieldRow label="Languages Known" labelWidth={130}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {langs.map((l) => (
                  <FormControlLabel key={l} label={l} control={<Checkbox size="small" checked={x.languages.includes(l)}
                    onChange={(e) => setX({ ...x, languages: e.target.checked ? [...x.languages, l] : x.languages.filter((v) => v !== l) })} />} />
                ))}
              </Box>
            </FieldRow>
            <FieldRow label="Others Specify" labelWidth={130}>{text('others')}</FieldRow>
          </Box>
        </Box>
      </Section>
    </Box>
  );
}
