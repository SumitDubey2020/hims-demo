import type { Doctor } from './doctors';

export type Errors = Partial<Record<keyof Doctor, string>>;

/** Shown in green under a field once it has been touched and is valid. */
export const okMessages: Partial<Record<keyof Doctor, string>> = {
  code: 'Doctor code is available',
  name: 'Looks good',
  speciality: 'Speciality selected',
  department: 'Department selected',
  regNo: 'Registration number looks good',
  regValidTill: 'Registration is valid',
  mobile: 'Valid mobile number',
  email: 'Valid email address',
  landline: 'Valid landline number',
};

export function validateDoctor(d: Doctor, all: Doctor[], isNew: boolean): Errors {
  const e: Errors = {};
  const today = new Date().toISOString().slice(0, 10);

  if (!d.code.trim()) e.code = 'Doctor code is required';
  else if (isNew && all.some((x) => x.code.toLowerCase() === d.code.trim().toLowerCase())) e.code = 'This doctor code already exists';

  if (!d.name.trim()) e.name = 'Doctor name is required';
  else if (d.name.trim().length < 3) e.name = 'Name must be at least 3 characters';

  if (!d.speciality) e.speciality = 'Please select a speciality';
  if (!d.department) e.department = 'Please select a department';
  if (!d.regNo.trim()) e.regNo = 'Registration number is required';
  if (d.regValidTill && d.regValidTill < today) e.regValidTill = 'Registration has expired';

  if (!d.mobile) e.mobile = 'Mobile number is required';
  else if (!/^\d{10}$/.test(d.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';

  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Enter a valid email address';
  if (d.landline && !/^[\d\s-]{6,15}$/.test(d.landline)) e.landline = 'Enter a valid landline number';
  return e;
}
