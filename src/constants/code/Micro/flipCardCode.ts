import code from '@/content/Micro/FlipCard/FlipCard.vue?raw';
import { createCodeObject } from '@/types/code';

export const flipCard = createCodeObject(code, 'Micro/FlipCard', {
  usage: `<script setup>
import FlipCard from './FlipCard.vue'
</script>

<template>
<FlipCard
  axis="y"
  flipOnClick
  draggable
  :dragDistance="0"
  tilt
  :tiltMax="12"
  glare
  :glareOpacity="0.22"
  :hoverScale="1.03"
  :perspective="1100"
  :stiffness="170"
  :damping="20"
  :width="300"
  :height="400"
  :radius="22"
  background="#27272a"
  color="#f5f5f5"
  shadow
  shadowColor="#000000"
  :shadowOpacity="0.45"
  @flipChange="flipped => console.log(flipped)"
>
  <template #front>
    <img
      src="/landscape.jpg"
      alt="Wooded landscape"
      :style="{ width: '100%', height: '100%', objectFit: 'cover' }"
    />
  </template>
  <template #back>
    <div :style="{ padding: '24px' }">
      <h3>Wooded Landscape</h3>
      <p>17th century · Rijksmuseum</p>
    </div>
  </template>
</FlipCard>
</template>`
});
