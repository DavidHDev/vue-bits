import code from '@/content/Micro/GlideSelect/GlideSelect.vue?raw';
import { createCodeObject } from '@/types/code';

export const glideSelect = createCodeObject(code, 'Micro/GlideSelect', {
  usage: `<script setup>
import { ref } from 'vue'
import GlideSelect from './GlideSelect.vue'

const formats = [
  { value: 'png', label: 'PNG', tag: 'Lossless' },
  { value: 'jpg', label: 'JPG', tag: 'Smallest' },
  { value: 'webp', label: 'WebP', tag: 'Modern' }
]
const format = ref('png')
</script>

<template>
<GlideSelect
  :options="formats"
  :value="format"
  ariaLabel="Export format"
  placeholder="Select…"
  showTags
  accentColor="#f5f5f5"
  surfaceColor="#27272a"
  highlightColor="#3f3f46"
  textColor="#f5f5f5"
  size="md"
  :radius="10"
  :menuWidth="176"
  placement="bottom"
  align="left"
  :popDuration="180"
  :glideDuration="220"
  rememberPosition
  @change="value => (format = value)"
/>

<!-- plain strings work too -->
<GlideSelect :options="['XS', 'S', 'M', 'L', 'XL']" defaultValue="M" />
</template>`
});
