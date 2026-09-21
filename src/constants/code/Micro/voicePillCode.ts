import code from '@/content/Micro/VoicePill/VoicePill.vue?raw';
import { createCodeObject } from '@/types/code';

export const voicePill = createCodeObject(code, 'Micro/VoicePill', {
  usage: `<script setup>
import VoicePill from './VoicePill.vue'
</script>

<template>
<!-- tap to latch, hold and release to stop; slide left while held to cancel -->
<VoicePill @start="onStart" @stop="({ reason, duration }) => onStop(reason, duration)" />

<VoicePill
  accentColor="#f5f5f5"
  iconColor="#a1a1aa"
  background="#27272a"
  :size="40"
  shape="pill"
  :reach="12"
  showTime
  waveform
  slideToCancel
  :cancelDistance="64"
  :attack="40"
  :release="240"
  :sensitivity="1"
  :floor="0.1"
  :openDuration="200"
  :pressScale="0.95"
  mode="auto"
  :holdAfter="300"
  reactive="simulated"
  ariaLabel="Dictate"
/>
</template>`
});
