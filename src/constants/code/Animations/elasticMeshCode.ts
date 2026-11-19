import code from '@/content/Animations/ElasticMesh/ElasticMesh.vue?raw';
import { createCodeObject } from '@/types/code';

export const elasticMesh = createCodeObject(code, 'Animations/ElasticMesh', {
  dependencies: '',
  usage: `<template>
  <div style="width: 100%; height: 500px; position: relative">
    <ElasticMesh
      text="Squish"
      material="balloon"
      color="#3b5bff"
      :inflate="1"
      :stiffness="0.5"
      :wobble="0.6"
      theme="dark"
    />
  </div>

  <div style="width: 100%; height: 500px; position: relative">
    <ElasticMesh src="/logo.svg" material="chrome" :image-colors="false" />
  </div>
</template>

<script setup lang="ts">
import ElasticMesh from './ElasticMesh.vue'
</script>`
});
