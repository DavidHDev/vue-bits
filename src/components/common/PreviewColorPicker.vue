<template>
  <PreviewColorPickerCustom v-model="modelValue" :title="title" :variant="variant" :alpha="alpha" />
</template>

<script setup lang="ts">
import PreviewColorPickerCustom from './PreviewColorPickerCustom.vue';

withDefaults(
  defineProps<{
    title?: string;
    variant?: 'row' | 'swatch';
    alpha?: boolean;
  }>(),
  { title: '', variant: 'row', alpha: false }
);

const modelValue = defineModel<string>({ default: '#ffffff' });
</script>
