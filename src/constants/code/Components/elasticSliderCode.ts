import code from '@/content/Components/ElasticSlider/ElasticSlider.vue?raw';
import { createCodeObject } from '@/types/code';

export const elasticSlider = createCodeObject(code, 'Components/ElasticSlider', {
  usage: `<template>  
  <ElasticSlider 
    :default-value="75"
    :starting-value="0"
    :max-value="100"
    :is-stepped="true"
    :step-size="5"
  />

  <!-- With custom icons using slots -->
  <ElasticSlider>
    <template #left-icon>
      <i class="pi pi-minus text-xl"></i>
    </template>
    <template #right-icon>
      <i class="pi pi-plus text-xl"></i>
    </template>
  </ElasticSlider>
</template>

<script setup lang="ts">
import ElasticSlider from "./ElasticSlider.vue";
</script>`
});
