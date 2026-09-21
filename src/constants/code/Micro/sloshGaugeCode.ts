import code from '@/content/Micro/SloshGauge/SloshGauge.vue?raw';
import { createCodeObject } from '@/types/code';

export const sloshGauge = createCodeObject(code, 'Micro/SloshGauge', {
  usage: `<script setup>
import { ref } from 'vue'
import SloshGauge from './SloshGauge.vue'

const level = ref(60)
</script>

<template>
<!-- read-only: every change to the value sloshes the liquid toward it -->
<SloshGauge :value="battery" ariaLabel="Battery" />

<!-- interactive: press or drag the tank, arrows step -->
<SloshGauge
  :value="level"
  interactive
  showValue
  liquidColor="#f5f5f5"
  glassColor="#27272a"
  :width="88"
  :height="180"
  :radius="20"
  :ticks="4"
  :viscosity="0.15"
  :tilt="0.45"
  :splash="0.42"
  unit="%"
  ariaLabel="Volume"
  @change="value => (level = value)"
/>
</template>`
});
