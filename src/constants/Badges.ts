import { CATEGORIES } from './Categories';
import { componentMetadata, type ComponentMetadata } from './Information';

const NEW_FOR_DAYS = 30;
const UPDATED_FOR_DAYS = 14;
const DAY_MS = 86400000;
const now = Date.now();

type Meta = ComponentMetadata[string];

const isRecent = (date: string | undefined, days: number) =>
  Boolean(date) && now - Date.parse(`${date}T00:00:00Z`) < days * DAY_MS;
const toSlug = (value: string) => value.replace(/\s+/g, '-').toLowerCase();
const pathOf = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};
const latestUpdate = (meta: Meta) =>
  (meta.updates || []).reduce((latest, update) => (update.date > latest ? update.date : latest), '');

const metadataByPath = new Map(
  Object.entries(componentMetadata).map(([key, meta]) => [pathOf(meta.docsUrl), { key, meta }])
);

const catalog = CATEGORIES.filter(category => category.name !== 'Get Started').flatMap(category =>
  category.subcategories
    .map(name => ({ name, entry: metadataByPath.get(`/${toSlug(category.name)}/${toSlug(name)}`) }))
    .filter((item): item is { name: string; entry: { key: string; meta: Meta } } => Boolean(item.entry))
);

const recentlyAdded = catalog.filter(({ entry }) => isRecent(entry.meta.added, NEW_FOR_DAYS));
const recentlyUpdated = catalog.filter(
  ({ entry }) => !isRecent(entry.meta.added, NEW_FOR_DAYS) && isRecent(latestUpdate(entry.meta), UPDATED_FOR_DAYS)
);

export const NEW: string[] = recentlyAdded.map(({ name }) => name);
export const NEW_KEYS = new Set(recentlyAdded.map(({ entry }) => entry.key));
export const UPDATED: string[] = recentlyUpdated.map(({ name }) => name);
export const UPDATED_KEYS = new Set(recentlyUpdated.map(({ entry }) => entry.key));
