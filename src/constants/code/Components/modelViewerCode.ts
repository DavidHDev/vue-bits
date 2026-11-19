import code from '@/content/Components/ModelViewer/ModelViewer.vue?raw';
import { createCodeObject } from '@/types/code';

export const modelViewer = createCodeObject(code, 'Components/ModelViewer', {
  installation: `npm install three`,
  usage: `<template>
  <ModelViewer
    url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb"
    :width="500"
    :height="500"
    environment="studio"
    :auto-rotate="true"
  />
</template>

<script setup lang="ts">
import ModelViewer from './ModelViewer.vue';
</script>`
});
