import code from '@/content/Micro/ScrubField/ScrubField.vue?raw';
import { createCodeObject } from '@/types/code';

export const scrubField = createCodeObject(code, 'Micro/ScrubField', {
  usage: `<script setup>
import { ref } from 'vue'
import ScrubField from './ScrubField.vue'

const radius = ref(24)
</script>

<template>
<ScrubField
  label="Radius"
  suffix="px"
  :value="radius"
  :min="0"
  :max="100"
  :step="1"
  size="md"
  :sensitivity="2"
  :rubberReach="8"
  :returnDuration="300"
  :coarseMultiplier="10"
  :fineMultiplier="0.1"
  showDelta
  showFill
  accent="#f5f5f5"
  chipColor="#27272a"
  @change="value => (radius = value)"
  @commit="value => save(value)"
/>
</template>`
});
