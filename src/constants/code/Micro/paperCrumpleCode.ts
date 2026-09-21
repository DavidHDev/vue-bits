import code from '@/content/Micro/PaperCrumple/PaperCrumple.vue?raw';
import { createCodeObject } from '@/types/code';

export const paperCrumple = createCodeObject(code, 'Micro/PaperCrumple', {
  usage: `<script setup>
import PaperCrumple from './PaperCrumple.vue'
</script>

<template>
<!-- hold to crumple, drag to move, release to unfold -->
<PaperCrumple src="/paper.jpg" alt="A handwritten poem" />

<PaperCrumple
  src="/paper.jpg"
  backSrc=""
  alt="A handwritten poem"
  :width="400"
  :height="400"
  :sceneHeight="360"
  imageFit="contain"
  releaseBehavior="restore"
  :crumpleAmount="0.85"
  :crumpleDuration="0.55"
  :releaseDuration="0.4"
  :foldCount="6"
  :foldSharpness="0.6"
  :wrinkleDepth="0.65"
  :creaseStrength="0.18"
  paperColor="#f4f0e8"
  :roughness="0.92"
  :paperTexture="0.08"
  :lightIntensity="1.8"
  :lightAngle="-35"
  shadow
  :shadowOpacity="0.16"
  draggable
  :dragRotation="10"
  :dragRadius="180"
  returnToOrigin
  :seed="7"
  :detail="64"
  @stateChange="state => console.log(state)"
  @error="error => console.error(error)"
/>
</template>`
});
