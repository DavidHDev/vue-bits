import code from '@/content/Micro/PulseHeart/PulseHeart.vue?raw';
import { createCodeObject } from '@/types/code';

export const pulseHeart = createCodeObject(code, 'Micro/PulseHeart', {
  usage: `<script setup>
import PulseHeart from './PulseHeart.vue'

const onChange = (liked, count) => api.setLike(postId, liked)
</script>

<template>
<PulseHeart
  :count="1204"
  showCount
  icon="heart"
  idleOutline
  likedColor="#ff4d6d"
  idleColor="#8b8b93"
  pillColor="#232326"
  textColor="#f5f5f5"
  :size="40"
  :corner="32"
  :duration="560"
  :dotSize="0.3"
  :overshoot="1.7"
  :beat="3"
  :rollDuration="350"
  label="Like"
  @change="onChange"
/>

<!-- your own glyph -->
<PulseHeart :count="12">
  <template #icon>
    <MyThumbSvg />
  </template>
</PulseHeart>
</template>`
});
