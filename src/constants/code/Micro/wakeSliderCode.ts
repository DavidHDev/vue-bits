import code from '@/content/Micro/WakeSlider/WakeSlider.vue?raw';
import { createCodeObject } from '@/types/code';

export const wakeSlider = createCodeObject(code, 'Micro/WakeSlider', {
  usage: `<script setup>
import { ref } from 'vue'
import WakeSlider from './WakeSlider.vue'

const value = ref(50)
</script>

<template>
<WakeSlider :value="value" @change="value = $event" />

<WakeSlider
  :value="value"
  :min="0"
  :max="100"
  :step="1"
  :bars="32"
  :height="56"
  :restHeight="12"
  :gap="4"
  fillColor="#f5f5f5"
  trackColor="#27272a"
  crestColor=""
  :sensitivity="1"
  :reach="6"
  :skew="0.6"
  :glide="0.3"
  :smoothing="100"
  showValue
  ariaLabel="Volume"
  @change="value = $event"
/>
</template>`
});
