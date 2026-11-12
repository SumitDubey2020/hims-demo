import { useEffect, useState } from 'react';

/** Tiny localStorage-backed state, keyed per doctor. Swap for API/Zustand later. */
export function useStored<T>(key: string, seed: T): [T, (v: T) => void] {
  const read = (): T => {
    try { const r = localStorage.getItem(key); return r ? (JSON.parse(r) as T) : seed; } catch { return seed; }
  };
  const [value, setValue] = useState<T>(read);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setValue(read()); }, [key]);
  const save = (v: T) => { setValue(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } };
  return [value, save];
}
export const newId = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;
