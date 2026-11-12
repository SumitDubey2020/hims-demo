export interface Doctor {
  id: string; code: string; name: string;
  gender: 'Male' | 'Female' | 'Others';
  speciality: string; department: string; designation: string;
  category: string; opIp: string; panelDoctor: boolean;
  status: 'Active' | 'Inactive';
  regNo: string; regCouncil: string; regValidTill: string;
  mobile: string; email: string; landline: string;
  room: string; reportingTo: string; photo?: string;
  feeOp: number; feeIp: number;
}

export const specialities = ['Cardiology', 'General Medicine', 'Orthopaedics', 'Gynaecology', 'Paediatrics', 'Neurology', 'Dermatology', 'Urology'];
export const departments = ['General Medicine', 'Orthopaedics', 'Obstetrics & Gynaecology', 'Paediatrics', 'Neurology', 'Dermatology', 'Urology'];
export const categories = ['Consultant', 'Visiting', 'Resident'];
export const opIpOptions = ['OP', 'IP', 'Both'];
export const councils = ['AP Medical Council', 'Telangana Medical Council', 'Maharashtra Medical Council'];
export const rooms = ['OPD - 1', 'OPD - 2', 'OPD - 3'];
export const reportingList = ['Medical Director', 'HOD', 'Chief Medical Officer'];

const seedRows: [string, string, string, string, number, number][] = [
  ['Dr. Ramesh Kumar', 'Cardiology', 'General Medicine', '9876543210', 500, 750],
  ['Dr. Priya Sharma', 'General Medicine', 'General Medicine', '9888776655', 400, 600],
  ['Dr. Anil Reddy', 'Orthopaedics', 'Orthopaedics', '9123456789', 500, 800],
  ['Dr. Sunitha Rao', 'Gynaecology', 'Obstetrics & Gynaecology', '9988774433', 450, 700],
  ['Dr. Kiran Varma', 'Paediatrics', 'Paediatrics', '9665544332', 400, 650],
  ['Dr. Mohan Rao', 'Neurology', 'Neurology', '9033221100', 600, 900],
  ['Dr. Lakshmi Devi', 'Dermatology', 'Dermatology', '9844112233', 400, 600],
  ['Dr. Vijay Kumar', 'Urology', 'Urology', '9700112233', 550, 800],
];
const extraNames = ['Arjun Mehta', 'Neha Gupta', 'Rahul Nair', 'Sneha Iyer', 'Vikram Singh', 'Pooja Desai', 'Suresh Babu', 'Anita Joshi', 'Manoj Patil'];

export const seedDoctors: Doctor[] = Array.from({ length: 25 }, (_, i) => {
  const r = seedRows[i % 8];
  const name = i < 8 ? r[0] : `Dr. ${extraNames[i % extraNames.length]}`;
  const code = `D${String(i + 1).padStart(4, '0')}`;
  return {
    id: code, code, name, gender: i % 3 === 1 ? 'Female' : 'Male',
    speciality: r[1], department: r[2], designation: 'Senior Consultant',
    category: 'Consultant', opIp: 'Both', panelDoctor: i % 2 === 0,
    status: i === 4 ? 'Inactive' : 'Active',
    regNo: `APMC${12345 + i}`, regCouncil: councils[0], regValidTill: '2028-12-31',
    mobile: i < 8 ? r[3] : `98765${43210 + i}`,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '')}@hospital.com`,
    landline: '0891-2345678', room: rooms[i % 3], reportingTo: reportingList[0],
    feeOp: r[4], feeIp: r[5],
  };
});

const KEY = 'hims.doctors';
export const loadDoctors = (): Doctor[] => {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch { /* ignore */ }
  localStorage.setItem(KEY, JSON.stringify(seedDoctors));
  return seedDoctors;
};
export const saveDoctors = (d: Doctor[]) => localStorage.setItem(KEY, JSON.stringify(d));

export const emptyDoctor = (code: string): Doctor => ({
  id: code, code, name: '', gender: 'Male', speciality: '', department: '', designation: '',
  category: '', opIp: 'Both', panelDoctor: false, status: 'Active', regNo: '', regCouncil: '',
  regValidTill: '', mobile: '', email: '', landline: '', room: '', reportingTo: '', feeOp: 0, feeIp: 0,
});
