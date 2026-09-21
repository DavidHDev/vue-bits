import code from '@/content/Micro/WarmTooltip/WarmTooltip.vue?raw';
import { createCodeObject } from '@/types/code';

export const warmTooltip = createCodeObject(code, 'Micro/WarmTooltip', {
  usage: `<script setup>
import WarmTooltip, { WarmTooltipGroup } from './WarmTooltip.vue'
</script>

<template>
<!-- alone: it wraps itself in a private group -->
<WarmTooltip content="Bold" shortcut="⌘B" v-slot="{ describedby }">
  <button :aria-describedby="describedby">B</button>
</WarmTooltip>

<!-- in a group: neighbours share one label that glides between triggers -->
<WarmTooltipGroup :delay="400" :warmWindow="300" :travel="320" :lean="0">
  <WarmTooltip content="Bold" shortcut="⌘B" v-slot="{ describedby }">
    <button :aria-describedby="describedby">B</button>
  </WarmTooltip>
  <WarmTooltip content="Italic" shortcut="⌘I" side="bottom" v-slot="{ describedby }">
    <button :aria-describedby="describedby">I</button>
  </WarmTooltip>
</WarmTooltipGroup>
</template>`
});
