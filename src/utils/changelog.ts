import { getComponentCatalog, toSlug } from './catalog';

export const CHANGELOG_DESCRIPTION = 'Keep up with the newest additions to Vue Bits.';

const CHANGELOG_START = '2026-09-01';

const CATEGORY_LAUNCHES = [
  {
    category: 'Micro',
    date: '2026-09-18',
    note: 'A new category of small, satisfying interactions: switches, buttons, sliders, toasts, menus, loaders and more.'
  }
];

export type ChangelogType = 'launch' | 'added' | 'updated';

export type ChangelogEntry = {
  id: string;
  type: ChangelogType;
  date: string;
  name: string;
  category: string;
  path: string;
  note: string;
  key?: string;
  components?: { name: string; path: string }[];
};

const TYPE_ORDER: Record<ChangelogType, number> = { launch: 0, added: 1, updated: 2 };

const firstSentence = (text: string) => {
  const match = (text || '').match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text || '').trim();
};

const byNewest = (a: ChangelogEntry, b: ChangelogEntry) => {
  if (a.date !== b.date) return b.date.localeCompare(a.date);
  if (a.type !== b.type) return TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
  return a.name.localeCompare(b.name);
};

export const getChangelogEntries = (): ChangelogEntry[] => {
  const catalog = getComponentCatalog();

  const launches: ChangelogEntry[] = CATEGORY_LAUNCHES.map(({ category, date, note }) => ({
    id: `${category}@launch`,
    type: 'launch' as const,
    date,
    name: category,
    category,
    path: `/c/${toSlug(category)}`,
    note,
    components: catalog
      .filter(entry => entry.category === category && entry.meta.added === date)
      .map(({ name, path }) => ({ name, path }))
      .sort((a, b) => a.name.localeCompare(b.name))
  })).filter(launch => launch.components.length > 0);
  const launched = new Set(launches.flatMap(launch => (launch.components ?? []).map(component => component.path)));

  const changes = catalog.flatMap(({ key, meta, name, category, path }) => {
    const base = { key, name, category, path };
    const added: ChangelogEntry[] =
      meta.added && !launched.has(path)
        ? [{ ...base, id: `${key}@added`, type: 'added', date: meta.added, note: firstSentence(meta.description) }]
        : [];
    const updates: ChangelogEntry[] = (meta.updates || []).map(update => ({
      ...base,
      id: `${key}@${update.date}`,
      type: 'updated',
      date: update.date,
      note: update.note
    }));
    return [...added, ...updates];
  });

  return [...launches, ...changes].filter(entry => entry.date >= CHANGELOG_START).sort(byNewest);
};
