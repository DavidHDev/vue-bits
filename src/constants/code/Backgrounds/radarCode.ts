import code from '@content/Backgrounds/Radar/Radar.vue?raw';
import { createCodeObject } from '../../../types/code';

export const radar = createCodeObject(code, 'Backgrounds/Radar', {
  installation: `npm install ogl`,
  usage: `<template>
  <div style="width: 100%; height: 600px; position: relative;">
    <Radar
        :speed="1"
        :scale="0.5"
        :ringCount="10"
        :spokeCount="10"
        :ringThickness="0.05"
        :spokeThickness="0.01"
        :sweepSpeed="1"
        :sweepWidth="2"
        :sweepLobes="1"
        color="#9f29ff"
        backgroundColor="#000000"
        :falloff="2"
        :brightness="1"
        :enableMouseInteraction="true"
        :mouseInfluence="0.1"
    />
  </div>
</template>

<script setup lang="ts">
  import Radar from "./Radar.vue";
</script>`
});
