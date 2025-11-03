import code from '@content/Backgrounds/Hyperspeed/Hyperspeed.vue?raw';
import presets from '@content/Backgrounds/Hyperspeed/HyperspeedPresets.ts?raw';
import { createCodeObject } from '../../../types/code';

export const hyperspeed = createCodeObject(code, 'Backgrounds/Hyperspeed', {
  installation: `npm install three postprocessing`,
  utility: presets,
  usage: `<template>
  <div class="hyperspeed-container">
    <Hyperspeed :effect-options="effectOptions" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import Hyperspeed from './Hyperspeed.vue'
  import { hyperspeedPresets } from './HyperspeedPresets'

  // Use a preset or create custom options
  const effectOptions = ref(hyperspeedPresets.one)

  // Or create your own custom configuration
  const customOptions = ref({
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xffffff,
      brokenLines: 0xffffff,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3,
    },
  })
</script>

<style scoped>
.hyperspeed-container {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>`
});
