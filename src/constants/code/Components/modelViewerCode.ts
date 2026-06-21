import code from '@/content/Components/ModelViewer/ModelViewer.vue?raw';
import { createCodeObject } from '@/types/code';

export const modelViewer = createCodeObject(code, 'Components/ModelViewer', {
  installation: `npm install three @tresjs/core @tresjs/cientos`,
  usage: `<template>
  <div class="h-[400px]">
    <ModelViewer
      url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
      width="100%"
      height="100%"
      :max-zoom-distance="0.7"
      @model-loaded="onModelLoaded"
    />
  </div>
</template>

<script setup lang="ts">
  import ModelViewer from './ModelViewer.vue';

  const onModelLoaded = () => {
    console.log('Model loaded!');
  };
</script>`
});
