import code from '@/content/Micro/SlingButton/SlingButton.vue?raw';
import { createCodeObject } from '@/types/code';

export const slingButton = createCodeObject(code, 'Micro/SlingButton', {
  usage: `<script setup>
import SlingButton from './SlingButton.vue'

const send = () => api.send(message.value)
</script>

<template>
<SlingButton
  padColor="#f5f5f5"
  iconColor="#18181b"
  accentColor="#f5f5f5"
  wellColor="#27272a"
  bandColor="#52525b"
  :size="56"
  :strokeWidth="3"
  :armAt="48"
  :maxPull="160"
  :launchSpeed="2600"
  :recoil="0.2"
  :flight="120"
  :particles="14"
  :spread="60"
  axis="any"
  tapSends
  ariaLabel="Send"
  @send="send"
/>

<!-- your own pad content -->
<SlingButton @send="send">
  <MyPaperPlane />
</SlingButton>
</template>`
});
