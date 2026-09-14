// Lightweight helpers for the "Copy as Markdown" / "Open in <AI>" actions on docs pages.

const MAX_URL_PROMPT = 6000;

export type AiProvider = 'chatgpt' | 'claude';

const PROVIDER_URL: Record<AiProvider, (prompt: string) => string> = {
  chatgpt: prompt => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  claude: prompt => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
};

export function openInAI(provider: AiProvider, prompt: string) {
  if (!prompt) return;
  const trimmed = prompt.length > MAX_URL_PROMPT ? `${prompt.slice(0, MAX_URL_PROMPT)}\n\n[truncated]` : prompt;
  window.open(PROVIDER_URL[provider](trimmed), '_blank', 'noopener,noreferrer');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
