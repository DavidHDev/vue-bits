import code from '@/content/TextAnimations/TechText/TechText.vue?raw';
import { createCodeObject } from '@/types/code';

export const techText = createCodeObject(code, 'TextAnimations/TechText', {
  usage: `<script setup>
import TechText from './TechText.vue'
</script>

<template>
<!-- move the cursor over the wordmark; drag a letter to spring it off the baseline -->
<TechText text="React Bits" />

<TechText
  text="Vue Bits"
  fontFamily=""
  :fontWeight="600"
  :fontSize="150"
  :letterSpacing="-0.05"
  color="#ffffff"
  accentColor="#ffffff"
  reveal="letter"
  :reach="200"
  :softness="0.7"
  lineStyle="dashed"
  :dashLength="4"
  :dashGap="2"
  :strokeWidth="1.5"
  :specks="15"
  selection
  labels
  draggable
  sweep
  :speed="1"
/>
</template>`
});
