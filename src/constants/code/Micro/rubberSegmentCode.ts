import code from '@/content/Micro/RubberSegment/RubberSegment.vue?raw';
import { createCodeObject } from '@/types/code';

export const rubberSegment = createCodeObject(code, 'Micro/RubberSegment', {
  usage: `<script setup>
import { ref } from 'vue'
import RubberSegment from './RubberSegment.vue'

const period = ref('Week')
</script>

<template>
<RubberSegment
  :items="['Day', 'Week', 'Month', 'Year']"
  :value="period"
  trackColor="#27272a"
  thumbColor="#fafafa"
  textColor="#fafafa"
  activeTextColor="#18181b"
  size="md"
  :radius="10"
  :inset="3"
  equalSlots
  :stretch="100"
  :squash="3"
  :speed="1"
  :glide="75"
  draggable
  ariaLabel="Period"
  @change="(value, index) => (period = value)"
/>
</template>`
});
