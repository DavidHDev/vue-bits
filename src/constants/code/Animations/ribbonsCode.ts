import code from '@content/Animations/Ribbons/Ribbons.vue?raw';
import { createCodeObject } from '../../../types/code';

export const ribbons = createCodeObject(code, 'Animations/Ribbons', {
  installation: `npm install ogl`,
  usage: `<template>
  <Ribbons
    :colors="['#ff9346', '#7cff67', '#ffee51', '#27FF64']"
    :base-spring="0.03"
    :base-friction="0.9"
    :base-thickness="30"
    :offset-factor="0.05"
    :max-age="500"
    :point-count="50"
    :speed-multiplier="0.6"
    :enable-fade="false"
    :enable-shader-effect="false"
    :effect-amplitude="2"
    :background-color="[0, 0, 0, 0]"
  />
</template>

<script setup lang="ts">
  import Ribbons from "./Ribbons.vue";
</script>`
});
