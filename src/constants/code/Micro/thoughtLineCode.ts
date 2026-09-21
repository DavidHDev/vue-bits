import code from '@/content/Micro/ThoughtLine/ThoughtLine.vue?raw';
import { createCodeObject } from '@/types/code';

export const thoughtLine = createCodeObject(code, 'Micro/ThoughtLine', {
  usage: `<script setup>
import ThoughtLine from './ThoughtLine.vue'
</script>

<template>
<!-- working: true while the agent thinks, false once it settles -->
<ThoughtLine :working="thinking" @settle="seconds => console.log(seconds)" />

<!-- append steps as the agent progresses; the last one is current -->
<ThoughtLine :working="thinking" :steps="steps" />

<ThoughtLine
  label="Thinking…"
  doneLabel=""
  glyph="sparkle"
  :steps="steps"
  collapsible
  collapseOnSettle
  color="currentColor"
  glyphColor=""
  :fontSize="16"
  :breathPeriod="1.6"
  :breathDepth="0.45"
  shimmer
  :shimmerDuration="1.8"
  :settleDuration="350"
  :settleBlur="2"
  :working="thinking"
  :settleAfter="0"
  showTimer
/>
</template>`
});
