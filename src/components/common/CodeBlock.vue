<script setup lang="ts">
import { VCodeBlock } from '@wdns/vue-code-block';
import { computed, ref } from 'vue';

const {
  code,
  language = 'html',
  showCopy = true,
  maxLines = 0
} = defineProps<{
  code: string;
  language?: string;
  showCopy?: boolean;
  maxLines?: number;
}>();

const expanded = ref(false);
const shouldCollapse = computed(() => maxLines > 0 && code.split('\n').length > maxLines);
const collapsedHeight = computed(() => `calc(1.6em * ${maxLines} + 2.5rem)`);
</script>

<template>
  <div class="code-highlighter" :data-language="language">
    <div
      class="code-clip"
      :style="shouldCollapse && !expanded ? { maxHeight: collapsedHeight, overflow: 'hidden' } : undefined"
    >
      <VCodeBlock
        :code="code"
        :lang="language"
        theme="nord"
        highlightjs
        :copy-button="showCopy"
        :persistent-copy-button="showCopy"
        class="code-block"
      />
      <div v-if="shouldCollapse && !expanded" class="code-fade" />
    </div>
    <button v-if="shouldCollapse" type="button" class="docs-expand-button" @click="expanded = !expanded">
      {{ expanded ? 'Collapse Snippet' : 'Expand Snippet' }}
    </button>
  </div>
</template>

<style scoped>
.code-clip {
  position: relative;
}

.code-fade {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 60%;
  background: linear-gradient(to bottom, transparent, var(--bg-body));
  pointer-events: none;
}

.docs-expand-button {
  position: absolute;
  right: 0.8em;
  bottom: 0.9em;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--inset-border);
  border-radius: var(--radius-sm);
  background: var(--bg-body);
  box-shadow: var(--surface-ghost-highlight);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color var(--transition-base),
    transform 0.12s ease;
}

.docs-expand-button:hover {
  background: var(--surface-ghost);
}

.docs-expand-button:active {
  transform: scale(0.97);
}

:deep(.v-code-block) {
  background: transparent;
  margin: 0;
}

:deep(.v-code-block pre) {
  background: transparent !important;
  margin: 0;
  font-size: 13px;
  font-family: 'Geist Mono', ui-monospace, monospace;
  line-height: 1.6;
  overflow-x: auto;
}

:deep(.v-code-block .hljs) {
  background: transparent;
  font-size: 13px;
}
</style>
