import { Blocks, Bot, Box, Component, LayoutTemplate } from 'lucide-vue-next';
import proSummary from './pro-summary.generated.json';

export type ProCountKey = keyof typeof proSummary.counts;

export interface ProShowcaseItem {
  name: string;
  slug: string;
  href: string;
  image: string;
  imageLight?: string;
}

export interface ProMediaItem {
  name: string;
  slug: string;
  href: string;
  media?: { dark?: string; light?: string; poster?: string; animated?: string };
}

export interface ProCategory {
  count: number;
  noun: string;
  path: string;
  pitch?: string;
  items: ProMediaItem[];
}

export interface ProSection {
  slug: string;
  label: string;
  sidebarLabel?: string;
  icon: typeof Component;
  countKey: ProCountKey;
  countLabel: string;
  tagline: string;
  proPath: string;
}

export const PRO_ASSET_BASE: string = proSummary.assets.baseUrl;
export const PRO_COUNTS = proSummary.counts;
export const PRO_FREE_COUNTS = proSummary.plans.free as Partial<Record<ProCountKey, number>>;
export const PRO_SHOWCASE_ITEMS = proSummary.showcase as Record<string, ProShowcaseItem[]>;
export const PRO_CATEGORIES = proSummary.categories as Record<string, ProCategory>;

export const PRO_SECTIONS: ProSection[] = [
  {
    slug: 'components',
    label: 'Components',
    icon: Component,
    countKey: 'components',
    countLabel: 'animated components',
    tagline: 'Shaders, 3D, cursor effects and text, in Tailwind or plain CSS.',
    proPath: '/docs/components'
  },
  {
    slug: 'blocks',
    label: 'Blocks',
    icon: Blocks,
    countKey: 'blocks',
    countLabel: 'page sections',
    tagline: 'Heroes, pricing, FAQs and footers that stack into a full landing page.',
    proPath: '/docs/blocks'
  },
  {
    slug: 'app-ui',
    label: 'App UI',
    icon: Box,
    countKey: 'appUi',
    countLabel: 'app UI blocks',
    tagline: 'Dashboards, tables, AI chat and auth, in two styles and one theme panel.',
    proPath: '/docs/app-ui'
  },
  {
    slug: 'templates',
    label: 'Templates',
    icon: LayoutTemplate,
    countKey: 'templates',
    countLabel: 'full templates',
    tagline: 'Multi-page Next.js sites. Swap the copy and deploy.',
    proPath: '/docs/templates'
  },
  {
    slug: 'agent-kit',
    label: 'Agent Kit',
    sidebarLabel: 'Skills',
    icon: Bot,
    countKey: 'agentKit',
    countLabel: 'agent skills',
    tagline: 'Give Claude Code, Cursor and Copilot real design taste.',
    proPath: '/docs/agent-kit'
  }
];
