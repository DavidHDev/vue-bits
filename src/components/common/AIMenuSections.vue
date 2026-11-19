<template>
  <DocsMenuGroup label="Copy">
    <DocsMenuItem v-for="item in copyItems" :key="item.key" @select="item.run">
      <span v-if="done === item.key" class="docs-menu-icon docs-tool-done">
        <HugeiconsIcon :icon="Tick02Icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
      </span>
      <span v-else class="docs-menu-icon">
        <HugeiconsIcon :icon="item.icon as IconArray" :size="16" :stroke-width="1.6" aria-hidden="true" />
      </span>
      {{ done === item.key ? 'Copied' : item.label }}
    </DocsMenuItem>
  </DocsMenuGroup>
  <DocsMenuGroup label="Open in">
    <DocsMenuItem v-for="item in openItems" :key="item.key" @select="item.run">
      <span class="docs-menu-icon">
        <component :is="item.icon" :size="15" aria-hidden="true" />
      </span>
      {{ item.label }}
      <span class="docs-menu-trail">
        <HugeiconsIcon :icon="ArrowUpRight01Icon" :size="14" :stroke-width="1.8" aria-hidden="true" />
      </span>
    </DocsMenuItem>
  </DocsMenuGroup>
</template>

<script setup lang="ts">
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { ArrowUpRight01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import type { AIMenuItem } from '@/composables/useAIExportActions';
import DocsMenuGroup from './DocsMenuGroup.vue';
import DocsMenuItem from './DocsMenuItem.vue';

defineProps<{ copyItems: AIMenuItem[]; openItems: AIMenuItem[]; done: string | null }>();
</script>
