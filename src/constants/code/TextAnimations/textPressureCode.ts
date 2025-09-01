import code from '@content/TextAnimations/TextPressure/TextPressure.vue?raw';
import { createCodeObject } from '@/types/code';

export const textPressure = createCodeObject(code, 'TextAnimations/TextPressure', {
  usage: `<!-- Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ -->
<!-- Font used - https://compressa.preusstype.com/ -->
  
<template>
  <TextPressure
    text="Hello!"
    :flex="true"
    :alpha="false"
    :stroke="false"
    :width="true"
    :weight="true"
    :italic="true"
    text-color="#ffffff"
    stroke-color="#27FF64"
    :min-font-size="36"
  />
</template>

<script setup lang="ts">
  import TextPressure from "./TextPressure.vue";
</script>`
});
