import { onMounted } from 'vue';

const CATALOG_KEY = 'vuebits:index-catalog';
const SESSION_KEY = 'vuebits:index-new-this-visit';

const readList = (storage: Storage, key: string): string[] => {
  try {
    const value = JSON.parse(storage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const discover = (currentKeys: string[]) => {
  if (typeof window === 'undefined') return new Set<string>();

  try {
    const sessionKeys = readList(window.sessionStorage, SESSION_KEY);
    if (sessionKeys.length > 0) return new Set(sessionKeys);

    const previousKeys = readList(window.localStorage, CATALOG_KEY);
    if (previousKeys.length === 0) return new Set<string>();

    const previous = new Set(previousKeys);
    const discovered = currentKeys.filter(key => !previous.has(key));
    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(discovered));
    } catch {
      return new Set(discovered);
    }
    return new Set(discovered);
  } catch {
    return new Set<string>();
  }
};

export function useNewSinceLastVisit(keys: string[]) {
  const currentKeys = [...keys].sort();
  const newKeys = discover(currentKeys);

  onMounted(() => {
    try {
      window.localStorage.setItem(CATALOG_KEY, JSON.stringify(currentKeys));
    } catch {
      return;
    }
  });

  return newKeys;
}
