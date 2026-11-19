import { CATEGORIES } from '@/constants/Categories';
import { componentMetadata } from '@/constants/Information';

export const toSlug = (value: string) => value.replace(/\s+/g, '-').toLowerCase();

export const categoryIndexPath = (categoryName: string) => `/c/${toSlug(categoryName)}`;

type Meta = (typeof componentMetadata)[string];

export type CatalogItem = {
  key: string;
  meta: Meta;
  name: string;
  category: string;
  categorySlug: string;
  slug: string;
  path: string;
};

const pathOf = (url: string) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};

export const getComponentCatalog = (): CatalogItem[] => {
  const metadataByPath = new Map(
    Object.entries(componentMetadata).map(([key, meta]) => [pathOf(meta.docsUrl), { key, meta }])
  );

  return CATEGORIES.filter(category => category.name !== 'Get Started').flatMap(category =>
    category.subcategories.flatMap(name => {
      const categorySlug = toSlug(category.name);
      const slug = toSlug(name);
      const path = `/${categorySlug}/${slug}`;
      const found = metadataByPath.get(path);
      return found ? [{ ...found, name, category: category.name, categorySlug, slug, path }] : [];
    })
  );
};

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'by',
  'for',
  'from',
  'in',
  'into',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'to',
  'with',
  'your',
  'vue',
  'component',
  'components',
  'animated',
  'animation',
  'effect',
  'effects',
  'customizable'
]);

const tokens = (value: string) =>
  new Set(
    String(value)
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter(word => word.length > 2 && !STOP_WORDS.has(word)) ?? []
  );

export type ComponentOverview = {
  heading: string;
  intro: string;
  path: string;
  category: { name: string; path: string };
  related: { name: string; path: string; description: string }[];
};

let catalogCache: CatalogItem[] | null = null;
const catalog = () => (catalogCache ??= getComponentCatalog());

const relatedComponents = (item: CatalogItem) => {
  const keywords = tokens(`${item.name} ${item.meta.description} ${(item.meta.tags ?? []).join(' ')}`);
  return catalog()
    .filter(candidate => candidate.path !== item.path && candidate.categorySlug === item.categorySlug)
    .map(candidate => {
      const candidateKeywords = tokens(
        `${candidate.name} ${candidate.meta.description} ${(candidate.meta.tags ?? []).join(' ')}`
      );
      const score = [...keywords].filter(word => candidateKeywords.has(word)).length;
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name))
    .slice(0, 3)
    .map(({ candidate }) => ({ name: candidate.name, path: candidate.path, description: candidate.meta.description }));
};

export const getComponentOverviewByPath = (path: string): ComponentOverview | null => {
  const item = catalog().find(entry => entry.path === path);
  if (!item) return null;
  return {
    heading: item.name,
    intro: item.meta.description,
    path: item.path,
    category: { name: item.category, path: categoryIndexPath(item.category) },
    related: relatedComponents(item)
  };
};
