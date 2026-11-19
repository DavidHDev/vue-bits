import code from '@/content/TextAnimations/TextPressure/TextPressure.vue?raw';
import { createCodeObject } from '@/types/code';

export const textPressure = createCodeObject(code, 'TextAnimations/TextPressure', {
  dependencies: '',
  usage: `<!-- Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ -->
<!-- Font used - https://compressa.preusstype.com/ -->

<!-- Note: -->
<!-- Make sure the font you're using supports all the variable properties. -->
<!-- Vue Bits does not take responsibility for the fonts used -->

<template>
  <div style="position: relative; height: 300px">
    <TextPressure
      text="Hello!"
      :flex="true"
      :alpha="false"
      :stroke="false"
      :width="true"
      :weight="true"
      :italic="true"
      :radius="0.5"
      :smoothing="0.5"
      idle="wave"
      :idle-speed="1"
      :click-ripple="true"
      stroke-color="#ff0000"
      :stroke-width="3"
      :min-font-size="36"
    />
  </div>
</template>

<script setup lang="ts">
import TextPressure from './TextPressure.vue'
</script>`
});
