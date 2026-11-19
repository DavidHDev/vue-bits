import code from '@/content/Micro/FolderFloat/FolderFloat.vue?raw';
import { createCodeObject } from '@/types/code';

export const folderFloat = createCodeObject(code, 'Micro/FolderFloat', {
  installation: `npm install matter-js @types/matter-js`,
  dependencies: 'matter-js',
  usage: `<template>
  <FolderFloat
    :items="['Try a warmer palette', 'Tighten the spacing', 'Logo feels small', 'Love the new hero']"
    label="Design feedback"
    sublabel="4 notes"
    trigger="hover"
    :close-on-select="true"
    :physics="true"
    :drift="0.5"
    folder-color="#3d403d"
    front-color="#4f5550"
    paper-color="#f5f5f5"
    item-color="#f5f5f5"
    item-text-color="#161816"
    label-color="#f5f5f5"
    :width="200"
    :height="148"
    :radius="14"
    :spread="180"
    :lift="26"
    :tilt="8"
    :flap-angle="34"
    :rest-angle="16"
    :open-duration="520"
    :stagger="45"
    :bounce="0.3"
    @select="(value, index) => console.log(value, index)"
  />
</template>

<script setup lang="ts">
import FolderFloat from './FolderFloat.vue'
</script>`
});
