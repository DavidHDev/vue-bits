<template>
  <div ref="rootRef" class="docs-select" :style="{ '--docs-select-width': width }">
    <DocsMenu placement="bottom-start" :gutter="8" :min-width="menuWidth" @open-change="onOpenChange">
      <template #trigger>
        <button
          type="button"
          class="docs-tool docs-select-trigger"
          :name="name"
          :disabled="disabled"
          aria-haspopup="listbox"
        >
          <span class="docs-select-value">{{ modelValue }}</span>
          <HugeiconsIcon
            :icon="ArrowDown01Icon"
            :size="14"
            :stroke-width="1.8"
            class="docs-tool-chevron"
            aria-hidden="true"
          />
        </button>
      </template>
      <DocsMenuItem v-for="option in options" :key="option" @select="emit('update:modelValue', option)">
        {{ option }}
        <span v-if="option === modelValue" class="docs-menu-check">
          <HugeiconsIcon :icon="Tick02Icon" :size="16" :stroke-width="1.6" aria-hidden="true" />
        </span>
      </DocsMenuItem>
    </DocsMenu>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/vue';
import { ref } from 'vue';
import DocsMenu from './DocsMenu.vue';
import DocsMenuItem from './DocsMenuItem.vue';

withDefaults(
  defineProps<{
    modelValue: string;
    options: string[];
    name?: string;
    width?: string;
    disabled?: boolean;
  }>(),
  { name: undefined, width: '180px', disabled: false }
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const rootRef = ref<HTMLElement | null>(null);
const menuWidth = ref<string | undefined>(undefined);

function onOpenChange(open: boolean) {
  if (open && rootRef.value) menuWidth.value = `${rootRef.value.offsetWidth}px`;
}
</script>
