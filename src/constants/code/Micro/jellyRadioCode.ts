import code from '@/content/Micro/JellyRadio/JellyRadio.vue?raw';
import { createCodeObject } from '@/types/code';

export const jellyRadio = createCodeObject(code, 'Micro/JellyRadio', {
  usage: `<script setup>
import { ref } from 'vue'
import JellyRadio from './JellyRadio.vue'

const level = ref('Medium')
</script>

<template>
<JellyRadio
  :items="['Off', 'Low', 'Medium', 'High', 'Max']"
  :value="level"
  chipColor="#27272a"
  activeColor="#f5f5f5"
  textColor="#f5f5f5"
  activeTextColor="#18181b"
  size="md"
  :gap="8"
  :radius="18"
  :swell="0.2"
  :barge="6"
  :shrink="0.05"
  :jelly="1"
  :bounce="0.25"
  :stagger="22"
  :stiffness="580"
  ariaLabel="Fan speed"
  @change="(value, index) => (level = value)"
/>

<!-- objects can disable a chip -->
<JellyRadio
  :items="[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'year', label: 'Year', disabled: true }
  ]"
  defaultValue="day"
/>
</template>`
});
