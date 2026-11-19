<template>
  <div class="code-highlighter-root" style="position: relative">
    <div
      style="position: relative; overflow: hidden"
      :style="{ maxHeight: shouldCollapse && !expanded ? `calc(1.55em * ${maxLines} + 2.5rem)` : 'none' }"
    >
      <ShikiCode v-if="codeString" :code="codeString" :language="language" :show-line-numbers="showLineNumbers" />
      <div
        v-else
        class="code-unsupported"
        style="display: flex; align-items: center; gap: 8px; color: var(--text-dimmed)"
      >
        <span>Sorry, this combination is not supported</span>
        <TbMoodSad />
      </div>

      <div
        v-if="shouldCollapse && !expanded"
        style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: linear-gradient(to bottom, transparent, var(--code-bg));
        "
      />

      <button v-if="shouldCollapse" type="button" class="docs-expand-button" @click="expanded = !expanded">
        {{ expanded ? 'Collapse Snippet' : 'Expand Snippet' }}
      </button>
    </div>

    <div v-if="codeString && showCopyButton" class="docs-code-header">
      <CodeCopyButton :code-string="codeString" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { TbMoodSad } from 'vue-icons-plus/tb';
import CodeCopyButton from './CodeCopyButton.vue';
import ShikiCode from './ShikiCode.vue';

const props = withDefaults(
  defineProps<{
    language?: string;
    codeString?: string | null;
    showLineNumbers?: boolean;
    maxLines?: number;
    snippetId?: string;
    showCopyButton?: boolean;
  }>(),
  { language: 'vue', codeString: '', showLineNumbers: true, maxLines: 25, showCopyButton: true }
);

const hashSnippet = (str: string) => {
  if (!str) return 'empty';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    if (i > 500) break;
  }
  return hash.toString(36);
};

const route = useRoute();
const key = computed(() => props.snippetId || hashSnippet(`${props.codeString ?? ''}|${props.language}`));
const expanded = ref(routeExpansionState[route.path]?.[key.value] ?? false);

watch(
  [expanded, () => route.path, key],
  ([value, path, snippet]) => {
    if (!routeExpansionState[path]) routeExpansionState[path] = {};
    routeExpansionState[path][snippet] = value;
  },
  { immediate: true }
);

const shouldCollapse = computed(() => (props.codeString?.split('\n').length ?? 0) > props.maxLines);
</script>

<script lang="ts">
const routeExpansionState: Record<string, Record<string, boolean>> = {};
</script>
