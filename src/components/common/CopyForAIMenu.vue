<template>
  <DocsMenu placement="bottom-end" :gutter="8" min-width="236px" :z-index="zIndex">
    <template #trigger>
      <button type="button" class="docs-tool" aria-label="Copy for AI">
        <span v-if="done" class="docs-menu-icon docs-tool-done">
          <HugeiconsIcon :icon="Tick02Icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
        </span>
        <HugeiconsIcon v-else :icon="Copy01Icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
        {{ done ? 'Copied' : 'Copy for AI' }}
        <HugeiconsIcon
          :icon="ArrowDown01Icon"
          :size="14"
          :stroke-width="1.8"
          class="docs-tool-chevron"
          aria-hidden="true"
        />
      </button>
    </template>
    <AIMenuSections :copy-items="copyItems" :open-items="openItems" :done="done" />
  </DocsMenu>
</template>

<script setup lang="ts">
import { HugeiconsIcon } from '@hugeicons/vue';
import { ArrowDown01Icon, Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import type { AIMenuItem } from '@/composables/useAIExportActions';
import AIMenuSections from './AIMenuSections.vue';
import DocsMenu from './DocsMenu.vue';

withDefaults(
  defineProps<{ copyItems: AIMenuItem[]; openItems: AIMenuItem[]; done: string | null; zIndex?: number }>(),
  {
    zIndex: 1500
  }
);
</script>
