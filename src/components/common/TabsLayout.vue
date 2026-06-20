<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Check, Clipboard, RotateCcw } from 'lucide-vue-next';
import { FiCode, FiEye } from 'vue-icons-plus/fi';

import { colors } from '@/constants/colors.ts';
import { dependenciesForSlug } from '@/constants/componentDependencies';
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
const copied = ref(false);

const TAB_STYLE_PROPS = {
  border: `1px solid ${colors.borderSecondary}`,
  borderRadius: '10px',
  fontSize: '14px',
  color: '#ffffff'
};

const subcategory = computed(() => route.params.subcategory as string);

const promptComponentName = computed(() => {
  if (props.componentName) return props.componentName;

  return subcategory.value
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
});

const hasPrompt = computed(() => {
  return Boolean(promptComponentName.value && props.source);
});

const previewTabId = computed(() => `${subcategory.value ?? 'component'}-preview-tab`);

const codeTabId = computed(() => `${subcategory.value ?? 'component'}-code-tab`);

const previewPanelId = computed(() => `${subcategory.value ?? 'component'}-preview-panel`);

const codePanelId = computed(() => `${subcategory.value ?? 'component'}-code-panel`);

function stripHeader(source: string) {
  return source.replace(/^['"][^'"]+['"];\s*/gm, '').trim();
}

const dependencyList = computed(() => dependenciesForSlug(route.params.subcategory as string));

function buildPrompt() {
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

const handleCopyPrompt = async () => {
  if (!hasPrompt.value) return;

  await navigator.clipboard.writeText(buildPrompt());

  copied.value = true;

  toast.add({
    severity: 'success',
    summary: 'Copied',
    detail: 'Prompt copied to clipboard',
    life: 2500
  });

  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

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
      class="flex justify-between items-center gap-2 mb-4 w-full"
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
      <div class="flex items-center gap-2">
        <button
          v-if="hasPrompt"
          @click="handleCopyPrompt"
          type="button"
          class="flex items-center gap-2 px-4 border rounded-[10px] h-10"
          :style="TAB_STYLE_PROPS"
        >
          <Check v-if="copied" :size="14" :color="colors.accent" />

          <Clipboard v-else :size="14" />

          {{ copied ? 'Copied!' : 'Copy Prompt' }}
        </button>

        <button
          v-if="onreset && activeTab === 'preview' && hasChanges"
          @click="onreset"
          type="button"
          class="flex items-center gap-2 px-4 border rounded-[10px] h-10"
          :style="TAB_STYLE_PROPS"
        >
          <RotateCcw :size="14" />

          Reset
        </button>
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
