<script setup lang="ts">
import { computed, provide } from 'vue';
import { COMPONENT_PROPS_CONTEXT } from './componentProps';

const props = withDefaults(
  defineProps<{
    props: Record<string, unknown>;
    defaultProps: Record<string, unknown>;
    resetProps: () => void;
    hasChanges: boolean;
    demoOnlyProps?: string[];
    computedProps?: Record<string, unknown>;
  }>(),
  {
    demoOnlyProps: () => [],
    computedProps: () => ({})
  }
);

provide(COMPONENT_PROPS_CONTEXT, {
  props: computed(() => props.props),
  defaultProps: computed(() => props.defaultProps),
  hasChanges: computed(() => props.hasChanges),
  resetProps: () => props.resetProps(),
  demoOnlyProps: computed(() => props.demoOnlyProps),
  computedProps: computed(() => props.computedProps)
});
</script>

<template>
  <slot />
</template>
