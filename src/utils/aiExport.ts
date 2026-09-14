// Helpers for the "Copy for AI" menu on component pages (TabsLayout.vue):
// copying prompts/usage/source/install commands, and opening a compact
// integration prompt directly in an AI assistant.

const SITE_ORIGIN = 'https://vue-bits.dev';
const MAX_URL_PROMPT = 6000;

export type AiProviderKey = 'chatgpt' | 'claude' | 'v0';

interface AiProvider {
  label: string;
  kind: 'prompt' | 'registry';
  build: (value: string) => string;
}

export const AI_PROVIDERS: Record<AiProviderKey, AiProvider> = {
  chatgpt: {
    label: 'Open in ChatGPT',
    kind: 'prompt',
    build: prompt => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`
  },
  claude: {
    label: 'Open in Claude',
    kind: 'prompt',
    build: prompt => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
  },
  v0: {
    label: 'Open in v0',
    kind: 'registry',
    build: url => `https://v0.dev/chat/api/open?url=${encodeURIComponent(url)}`
  }
};

export function openInAI(providerKey: AiProviderKey, payload: { prompt?: string; registryUrl?: string } | string) {
  const provider = AI_PROVIDERS[providerKey];
  if (!provider) return false;

  const { prompt = '', registryUrl: itemUrl = '' } = typeof payload === 'string' ? { prompt: payload } : payload || {};

  let target: string;
  if (provider.kind === 'registry') {
    if (!itemUrl) return false;
    target = provider.build(itemUrl);
  } else {
    if (!prompt) return false;
    const trimmed = prompt.length > MAX_URL_PROMPT ? `${prompt.slice(0, MAX_URL_PROMPT)}\n\n[truncated]` : prompt;
    target = provider.build(trimmed);
  }

  window.open(target, '_blank', 'noopener,noreferrer');
  return true;
}

export const componentDocsUrl = (category: string, subcategory: string) => `${SITE_ORIGIN}/${category}/${subcategory}`;

export function buildCompactPrompt({
  componentName,
  category,
  subcategory,
  installCommand,
  usage
}: {
  componentName: string;
  category: string;
  subcategory: string;
  installCommand?: string;
  usage?: string;
}) {
  const lines = [
    `Help me add the <${componentName} /> component from Vue Bits to my project.`,
    '',
    'Variant: TypeScript + Tailwind',
    `Docs: ${componentDocsUrl(category, subcategory)}`
  ];

  if (installCommand) {
    lines.push('', 'Install it with:', installCommand);
  }

  if (usage) {
    lines.push('', 'Use this configuration:', usage);
  }

  lines.push(
    '',
    'Please install any listed dependencies, add the component to my project, and wire it into the right place.',
    `If this is not the right component, the full library index is at ${SITE_ORIGIN}/llms.txt.`
  );

  return lines.join('\n');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:absolute;left:-9999px;top:0;';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
