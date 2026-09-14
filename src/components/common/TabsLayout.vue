<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Check, ChevronDown, FileCode2, FileText, RotateCcw, Sparkles, Terminal } from 'lucide-vue-next';
import { FiCode, FiEye } from 'vue-icons-plus/fi';
import { PiShareFat } from 'vue-icons-plus/pi';
import { RiHeartFill, RiHeartLine } from 'vue-icons-plus/ri';
import { SiAnthropic, SiOpenai, SiVercel } from 'vue-icons-plus/si';

import { registryUrl, shadcnAddSnippet } from '@/constants/cli';
import { colors } from '@/constants/colors.ts';
import { dependenciesForSlug } from '@/constants/componentDependencies';
import { buildCompactPrompt, copyText, openInAI } from '@/utils/aiExport';
import { isComponentSaved, toggleSavedComponent } from '@/utils/favorites';
import { useToast } from 'primevue/usetoast';
import Dependencies from './Dependencies.vue';

type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

const props = withDefaults(
  defineProps<{
    className?: string;
    componentName?: string;
    usage?: string;
    source?: string;
    propsTable?: PropRow[];
    hasChanges?: boolean;
    onreset?: () => void;
  }>(),
  {
    usage: '',
    source: '',
    propsTable: () => [],
    hasChanges: false
  }
);

const toast = useToast();
const route = useRoute();

const activeTab = ref<'preview' | 'code'>('preview');

const TAB_STYLE_PROPS = {
  border: `1px solid ${colors.borderSecondary}`,
  borderRadius: '10px',
  fontSize: '14px',
  color: '#ffffff'
};

const category = computed(() => (route.params.category as string) ?? '');
const subcategory = computed(() => (route.params.subcategory as string) ?? '');

function toPascal(str: string) {
  return (str || '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const promptComponentName = computed(() => {
  if (props.componentName) return props.componentName;

  return toPascal(subcategory.value);
});

const hasPrompt = computed(() => {
  return Boolean(promptComponentName.value && props.source);
});

const previewTabId = computed(() => `${subcategory.value || 'component'}-preview-tab`);

const codeTabId = computed(() => `${subcategory.value || 'component'}-code-tab`);

const previewPanelId = computed(() => `${subcategory.value || 'component'}-preview-panel`);

const codePanelId = computed(() => `${subcategory.value || 'component'}-code-panel`);

function stripHeader(source: string) {
  return source.replace(/^['"][^'"]+['"];\s*/gm, '').trim();
}

const dependencyList = computed(() => dependenciesForSlug(route.params.subcategory as string));

// ── Favorites ──────────────────────────────────────────────────────────────
const favoriteKey = computed(() => {
  if (!category.value || !subcategory.value) return null;
  return `${toPascal(category.value)}/${toPascal(subcategory.value)}`;
});

const showFavorite = computed(() => Boolean(favoriteKey.value) && category.value !== 'get-started');

const isSaved = ref(false);

function refreshSaved() {
  isSaved.value = favoriteKey.value ? isComponentSaved(favoriteKey.value) : false;
}

watch(favoriteKey, refreshSaved, { immediate: true });

function toggleFavorite() {
  if (!favoriteKey.value) return;

  const { saved } = toggleSavedComponent(favoriteKey.value);
  isSaved.value = saved;

  const name = promptComponentName.value;

  toast.add({
    severity: saved ? 'success' : 'error',
    summary: saved ? `Added <${name} /> to favorites` : `Removed <${name} /> from favorites`,
    life: 3000
  });
}

// ── Share ──────────────────────────────────────────────────────────────────
async function copyShareLink() {
  if (await copyText(window.location.href)) {
    toast.add({ severity: 'success', summary: 'Share link copied', life: 2500 });
  } else {
    toast.add({ severity: 'error', summary: 'Could not copy the link', life: 2500 });
  }
}

// ── Copy for AI ────────────────────────────────────────────────────────────
const menuOpen = ref(false);
const done = ref<string | null>(null);
const aiMenuRootRef = ref<HTMLElement | null>(null);

const installCommand = computed(() => {
  if (!subcategory.value) return '';
  return shadcnAddSnippet(subcategory.value, 'npm');
});

function buildFullPrompt() {
  const sourceShown = stripHeader(props.source);
  const deps = dependencyList.value.join(', ');

  let prompt = `## Integrate the <${promptComponentName.value} /> component from Vue Bits

You are helping integrate an open-source Vue component into an existing application.

### Component: ${promptComponentName.value}
### Variant: TypeScript + Tailwind
${deps ? `### Dependencies: ${deps}` : ''}

---

### Usage Example
\`\`\`vue
${props.usage}
\`\`\`
`;

  if (props.propsTable.length > 0) {
    prompt += `
### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
${props.propsTable.map(p => `| ${p.name} | ${p.type} | ${p.default || '—'} | ${p.description} |`).join('\n')}
`;
  }

  prompt += `
### Full Component Source
\`\`\`vue
${sourceShown}
\`\`\`

### Integration Instructions
1. Copy the component source into the appropriate directory in the project.
2. Import and render the component using the usage example above as a starting point.
3. Adjust props as needed for the specific use case.
`;

  return prompt;
}

async function runCopy(key: string, text: string, message: string) {
  if (!text) {
    toast.add({ severity: 'error', summary: 'Nothing to copy for this component', life: 2500 });
    menuOpen.value = false;
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

  menuOpen.value = false;
}

const copyItems = computed(() => [
  {
    key: 'prompt',
    label: 'Copy prompt',
    icon: Sparkles,
    run: () => runCopy('prompt', buildFullPrompt(), 'Prompt copied — paste into any AI assistant')
  },
  {
    key: 'usage',
    label: 'Copy usage example',
    icon: FileText,
    run: () => runCopy('usage', props.usage, 'Usage example copied')
  },
  {
    key: 'source',
    label: 'Copy component source',
    icon: FileCode2,
    run: () => runCopy('source', stripHeader(props.source), 'Component source copied')
  },
  {
    key: 'install',
    label: 'Copy install command',
    icon: Terminal,
    run: () => runCopy('install', installCommand.value, 'Install command copied')
  }
]);

function openAIProvider(providerKey: 'chatgpt' | 'claude' | 'v0') {
  const compactPrompt = buildCompactPrompt({
    componentName: promptComponentName.value,
    category: category.value,
    subcategory: subcategory.value,
    installCommand: installCommand.value,
    usage: props.usage
  });

  menuOpen.value = false;
  openInAI(providerKey, { prompt: compactPrompt, registryUrl: registryUrl(subcategory.value) });
}

function toggleAiMenu() {
  menuOpen.value = !menuOpen.value;
}

function handleOutsideClick(event: MouseEvent) {
  if (!aiMenuRootRef.value?.contains(event.target as Node)) menuOpen.value = false;
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscape);
});

function selectTab(tab: 'preview' | 'code') {
  activeTab.value = tab;

  requestAnimationFrame(() => {
    const targetId = tab === 'preview' ? previewTabId.value : codeTabId.value;

    document.getElementById(targetId)?.focus();
  });
}

function handleTabKey(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();

    selectTab(activeTab.value === 'preview' ? 'code' : 'preview');
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();

    selectTab(activeTab.value === 'preview' ? 'code' : 'preview');
  } else if (event.key === 'Home') {
    event.preventDefault();

    selectTab('preview');
  } else if (event.key === 'End') {
    event.preventDefault();

    selectTab('code');
  }
}
</script>

<template>
  <div class="w-full" :class="className">
    <!-- Tabs -->
    <div
      class="flex flex-wrap justify-between items-center gap-2 mb-4 w-full"
      role="tablist"
      aria-label="Component example sections"
      tabindex="-1"
      @keydown="handleTabKey"
    >
      <div class="flex gap-2">
        <!-- Preview -->
        <button
          :id="previewTabId"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'preview'"
          :aria-controls="previewPanelId"
          :tabindex="activeTab === 'preview' ? 0 : -1"
          @click="selectTab('preview')"
          class="flex justify-center items-center gap-2 px-4 border rounded-[10px] h-10 transition-all"
          :style="{
            ...TAB_STYLE_PROPS,
            background: activeTab === 'preview' ? colors.bgElevated : 'transparent',
            color: activeTab === 'preview' ? colors.accent : '#fff'
          }"
        >
          <FiEye :size="16" />
          Preview
        </button>

        <!-- Code -->
        <button
          :id="codeTabId"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'code'"
          :aria-controls="codePanelId"
          :tabindex="activeTab === 'code' ? 0 : -1"
          @click="selectTab('code')"
          class="flex justify-center items-center gap-2 px-4 border rounded-[10px] h-10 transition-all"
          :style="{
            ...TAB_STYLE_PROPS,
            background: activeTab === 'code' ? colors.bgElevated : 'transparent',
            color: activeTab === 'code' ? colors.accent : '#fff'
          }"
        >
          <FiCode :size="16" />
          Code
        </button>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-if="onreset && activeTab === 'preview' && hasChanges"
          @click="onreset"
          type="button"
          class="flex items-center gap-2 px-4 border rounded-[10px] h-10 transition-colors duration-200 hover:bg-(--bg-hover)"
          :style="TAB_STYLE_PROPS"
        >
          <RotateCcw :size="14" />

          Reset
        </button>

        <div v-if="showFavorite" class="group relative">
          <button
            type="button"
            :aria-pressed="isSaved"
            :aria-label="isSaved ? 'Remove from Favorites' : 'Add to Favorites'"
            @click="toggleFavorite"
            class="flex justify-center items-center border rounded-[10px] w-10 h-10 transition-colors duration-200"
            :class="isSaved ? 'hover:bg-[rgba(160,255,188,0.26)]' : 'hover:bg-(--bg-hover)'"
            :style="{ ...TAB_STYLE_PROPS, background: isSaved ? 'rgba(160,255,188,0.18)' : 'transparent' }"
          >
            <RiHeartFill v-if="isSaved" :size="16" :color="colors.accent" />
            <RiHeartLine v-else :size="16" color="#fff" />
          </button>

          <span
            class="top-1/2 right-full z-10 absolute flex items-center opacity-0 group-hover:opacity-100 mr-2 px-4 rounded-[10px] h-10 font-medium text-xs whitespace-nowrap transition-opacity -translate-y-1/2 duration-150 pointer-events-none"
            :style="{ background: colors.bgBody, border: `1px solid ${colors.borderPrimary}`, color: colors.accent }"
          >
            {{ isSaved ? 'Remove from Favorites' : 'Add to Favorites' }}
          </span>
        </div>

        <div v-if="showFavorite" class="group relative">
          <button
            type="button"
            aria-label="Copy share link"
            @click="copyShareLink"
            class="flex justify-center items-center w-10 h-10 border rounded-[10px] transition-colors duration-200 hover:bg-(--bg-hover)"
            :style="TAB_STYLE_PROPS"
          >
            <PiShareFat :size="16" color="#fff" />
          </button>

          <span
            class="top-1/2 right-full z-10 absolute flex items-center opacity-0 group-hover:opacity-100 mr-2 px-4 rounded-[10px] h-10 font-medium text-xs whitespace-nowrap transition-opacity -translate-y-1/2 duration-150 pointer-events-none"
            :style="{ background: colors.bgBody, border: `1px solid ${colors.borderPrimary}`, color: colors.accent }"
          >
            Copy share link
          </span>
        </div>

        <div v-if="hasPrompt" ref="aiMenuRootRef" class="relative">
          <button
            type="button"
            aria-haspopup="menu"
            :aria-expanded="menuOpen"
            aria-label="Copy for AI"
            @click="toggleAiMenu"
            class="flex items-center gap-1.5 px-4 border rounded-[10px] h-10 transition-colors duration-200 hover:bg-(--bg-hover)"
            :style="TAB_STYLE_PROPS"
          >
            <Check v-if="done" :size="14" :color="colors.accent" />
            {{ done ? 'Copied!' : 'Copy for AI' }}
            <ChevronDown :size="14" color="#fff" />
          </button>

          <div
            v-if="menuOpen"
            role="menu"
            class="top-[calc(100%+8px)] right-0 z-1500 absolute p-1 rounded-[10px] min-w-58.75"
            :style="{
              background: colors.bgBody,
              border: `1px solid ${colors.borderPrimary}`,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }"
          >
            <button
              v-for="item in copyItems"
              :key="item.key"
              type="button"
              role="menuitem"
              class="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-sm cursor-pointer bg-transparent border-0 transition-colors duration-150 hover:bg-(--bg-hover)"
              style="color: #fff"
              @click="item.run"
            >
              <Check v-if="done === item.key" :size="16" :color="colors.accent" />
              <component :is="item.icon" v-else :size="16" :color="colors.textMuted" />
              {{ item.label }}
            </button>

            <div class="my-1 h-px" :style="{ background: colors.borderPrimary }" />

            <button
              type="button"
              role="menuitem"
              class="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-sm cursor-pointer bg-transparent border-0 transition-colors duration-150 hover:bg-(--bg-hover)"
              style="color: #fff"
              @click="openAIProvider('chatgpt')"
            >
              <SiOpenai :size="16" :color="colors.textMuted" />
              Open in ChatGPT
            </button>

            <button
              type="button"
              role="menuitem"
              class="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-sm cursor-pointer bg-transparent border-0 transition-colors duration-150 hover:bg-(--bg-hover)"
              style="color: #fff"
              @click="openAIProvider('claude')"
            >
              <SiAnthropic :size="16" :color="colors.textMuted" />
              Open in Claude
            </button>

            <button
              type="button"
              role="menuitem"
              class="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-sm cursor-pointer bg-transparent border-0 transition-colors duration-150 hover:bg-(--bg-hover)"
              style="color: #fff"
              @click="openAIProvider('v0')"
            >
              <SiVercel :size="16" :color="colors.textMuted" />
              Open in v0
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Panel -->
    <div v-if="activeTab === 'preview'" :id="previewPanelId" role="tabpanel" :aria-labelledby="previewTabId">
      <slot name="preview" />

      <slot name="customize" />

      <slot name="propTable" />

      <Dependencies :dependency-list="dependencyList" />
    </div>

    <!-- Code Panel -->
    <div v-else :id="codePanelId" role="tabpanel" :aria-labelledby="codeTabId">
      <slot name="code" />
    </div>
  </div>
</template>
