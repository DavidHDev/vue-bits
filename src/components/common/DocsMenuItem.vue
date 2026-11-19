<template>
  <div
    :class="itemClass"
    role="menuitem"
    data-part="item"
    :data-disabled="disabled ? '' : undefined"
    tabindex="-1"
    @click="select"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useDocsMenu } from './docsMenu';

const props = withDefaults(defineProps<{ itemClass?: string; disabled?: boolean; keepOpen?: boolean }>(), {
  itemClass: 'docs-menu-item',
  disabled: false,
  keepOpen: false
});

const emit = defineEmits<{ select: [] }>();

const menu = useDocsMenu();

function select() {
  if (props.disabled) return;
  emit('select');
  if (!props.keepOpen) menu?.close(true);
}
</script>
