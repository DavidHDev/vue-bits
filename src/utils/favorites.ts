const STORAGE_KEY = 'savedComponents';

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(x => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

const write = (list: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    try {
      window.dispatchEvent(new CustomEvent('favorites:updated', { detail: list }));
    } catch {
      // no-op
    }
  } catch {
    // no-op
  }
};

export const getSavedComponents = () => read();

export const isComponentSaved = (key: string) => read().includes(key);

export const addSavedComponent = (key: string) => {
  const list = read();
  if (!list.includes(key)) {
    const next = [...list, key];
    write(next);
    return next;
  }
  return list;
};

export const removeSavedComponent = (key: string) => {
  const list = read();
  const next = list.filter(item => item !== key);
  write(next);
  return next;
};

export const toggleSavedComponent = (key: string) => {
  const list = read();
  if (list.includes(key)) {
    const next = list.filter(item => item !== key);
    write(next);
    return { saved: false, list: next };
  }
  const next = [...list, key];
  write(next);
  return { saved: true, list: next };
};

export default {
  getSavedComponents,
  isComponentSaved,
  addSavedComponent,
  removeSavedComponent,
  toggleSavedComponent
};
