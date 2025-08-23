import code from '@/content/Animations/ElectricBorder/ElectricBorder.vue?raw';
import { createCodeObject } from '@/types/code';

export const electricBorder = createCodeObject(code, 'Animations/ElectricBorder', {
  usage: `// CREDIT
// Component inspired by @BalintFerenczy on X
// https://codepen.io/BalintFerenczy/pen/KwdoyEN

<template>
  <ElectricBorder
    :color="'#7df9ff'"
    :speed="1"
    :chaos="0.5"
    :thickness="2"
    :style="{ borderRadius: '16px' }"
  >
    <div>
      <p :style="{ margin: '6px 0 0', opacity: 0.8 }">
        A glowing, animated border wrapper.
      </p>
    </div>
  </ElectricBorder>
</template>

<script setup lang="ts">
  import ElectricBorder from "./ElectricBorder.vue";
</script>`
});
