import code from '@/content/Components/ElasticSlider/ElasticSlider.vue?raw';
import { createCodeObject } from '@/types/code';

export const elasticSlider = createCodeObject(code, 'Components/ElasticSlider', {
  installation: `npm install @hugeicons/vue @hugeicons/core-free-icons`,
  usage: `<template>
  <ElasticSlider
    :default-value="50"
    :left-icon="h(HugeiconsIcon, { icon: VolumeLowIcon, size: 20 })"
    :right-icon="h(HugeiconsIcon, { icon: VolumeHighIcon, size: 20 })"
    @change="value => console.log(value)"
  />
</template>

<script setup lang="ts">
import { h } from 'vue';
import { HugeiconsIcon } from '@hugeicons/vue';
import { VolumeHighIcon, VolumeLowIcon } from '@hugeicons/core-free-icons';
import ElasticSlider from './ElasticSlider.vue';
</script>`
});
