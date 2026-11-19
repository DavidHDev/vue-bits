import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue';
import { useToast } from 'primevue/usetoast';
import { CodeSquareIcon, CommandLineIcon, FileScriptIcon, SparklesIcon } from '@hugeicons/core-free-icons';
import { SiAnthropic, SiOpenai, SiVercel } from 'vue-icons-plus/si';
import { jsrepoAddSnippet, registryUrl, shadcnAddSnippet } from '@/constants/cli';
import { buildCompactPrompt, copyText, openInAI, type AiProviderKey } from '@/utils/aiExport';
import { useInstallation } from './useInstallation';

export type AIExportInput = {
  componentName?: string;
  category?: string;
  subcategory?: string;
  fullPrompt?: string;
  configuredUsage?: string;
  componentSource?: string;
};

export type AIMenuItem = {
  key: string;
  label: string;
  icon: unknown;
  run: () => void;
};

export function useAIExportActions(input: MaybeRefOrGetter<AIExportInput | null>) {
  const toast = useToast();
  const done = ref<string | null>(null);
  const { cliTool, packageManager } = useInstallation();

  const installCommand = computed(() => {
    const slug = toValue(input)?.subcategory;
    if (!slug) return '';
    return cliTool.value === 'jsrepo'
      ? jsrepoAddSnippet(slug, packageManager.value)
      : shadcnAddSnippet(slug, packageManager.value);
  });

  const run = async (key: string, text: string | undefined, message: string) => {
    if (!text) {
      toast.add({ severity: 'error', summary: 'Nothing to copy for this component', life: 2500 });
      return;
    }
    if (await copyText(text)) {
      done.value = key;
      toast.add({ severity: 'success', summary: message, life: 2500 });
      setTimeout(() => {
        if (done.value === key) done.value = null;
      }, 2000);
    } else {
      toast.add({ severity: 'error', summary: 'Could not copy to clipboard', life: 2500 });
    }
  };

  const copyItems = computed<AIMenuItem[]>(() => {
    const value = toValue(input) || {};
    return [
      {
        key: 'prompt',
        label: 'Copy prompt',
        icon: SparklesIcon,
        run: () => run('prompt', value.fullPrompt, 'Prompt copied — paste into any AI assistant')
      },
      {
        key: 'usage',
        label: 'Copy configured code',
        icon: CodeSquareIcon,
        run: () => run('usage', value.configuredUsage, 'Configured usage copied')
      },
      {
        key: 'source',
        label: 'Copy component source',
        icon: FileScriptIcon,
        run: () => run('source', value.componentSource, 'Component source copied')
      },
      {
        key: 'install',
        label: 'Copy install command',
        icon: CommandLineIcon,
        run: () => run('install', installCommand.value, 'Install command copied')
      }
    ];
  });

  const openItems = computed<AIMenuItem[]>(() => {
    const value = toValue(input) || {};
    const payload = {
      prompt: buildCompactPrompt({
        componentName: value.componentName || '',
        category: value.category || '',
        subcategory: value.subcategory || '',
        installCommand: installCommand.value,
        usage: value.configuredUsage
      }),
      registryUrl: value.subcategory ? registryUrl(value.subcategory) : ''
    };

    return (
      [
        { key: 'chatgpt', label: 'Open in ChatGPT', icon: SiOpenai },
        { key: 'claude', label: 'Open in Claude', icon: SiAnthropic },
        { key: 'v0', label: 'Open in v0', icon: SiVercel }
      ] as { key: AiProviderKey; label: string; icon: unknown }[]
    ).map(item => ({ ...item, run: () => openInAI(item.key, payload) }));
  });

  return { copyItems, openItems, done, installCommand };
}
