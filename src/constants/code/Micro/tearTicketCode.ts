import code from '@/content/Micro/TearTicket/TearTicket.vue?raw';
import { createCodeObject } from '@/types/code';

export const tearTicket = createCodeObject(code, 'Micro/TearTicket', {
  usage: `<script setup>
import TearTicket from './TearTicket.vue'
</script>

<template>
<!-- drag the stub to tear it off; Enter or Space tears it from the keyboard -->
<TearTicket @tear="onTear">
  <div>Ticket body</div>
  <template #stub>Admit one</template>
</TearTicket>

<TearTicket
  image="/art.jpg"
  imageAlt="Artwork"
  orientation="horizontal"
  :width="460"
  :height="250"
  :stubSize="150"
  :radius="16"
  :holes="12"
  :holeSize="6"
  :notch="3"
  :roughness="0"
  :tearAngle="30"
  :stretch="30"
  :resistance="0.45"
  :rotate="4"
  tilt
  :tiltMax="9"
  :tiltReach="260"
  :parallax="6"
  :perspective="1000"
  background="#27272a"
  color="#f5f5f5"
  border
  recenter
  :torn="used"
  @tear="used = true"
>
  <div>Ticket body</div>
  <template #stub>Admit one</template>
</TearTicket>
</template>`
});
