import code from '@/content/Micro/CometDial/CometDial.vue?raw';
import { createCodeObject } from '@/types/code';

export const cometDial = createCodeObject(code, 'Micro/CometDial', {
  usage: `<script setup>
import CometDial from './CometDial.vue'
</script>

<template>
<div :style="{ position: 'relative', width: '100%', height: '500px', background: '#050610' }">
  <CometDial
    :defaultValue="62"
    :min="0"
    :max="100"
    :step="1"
    unit="%"
    label="Level"
    accent="#f5f5f5"
    ink="#fdfdfd"
    :size="250"
    :sweep="320"
    :thickness="5"
    :speed="25"
    :tapBounce="0.2"
    :flickBounce="0.1"
    :momentum="1"
    :cometReach="180"
    :cometWidth="12"
    @change="value => console.log(value)"
    @changeEnd="(value, { velocity, bounce }) => console.log('settling toward', value, velocity, bounce)"
  />
</div>
</template>`
});
