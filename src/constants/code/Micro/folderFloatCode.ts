import code from '@/content/Micro/FolderFloat/FolderFloat.vue?raw';
import { createCodeObject } from '@/types/code';

export const folderFloat = createCodeObject(code, 'Micro/FolderFloat', {
  usage: `<script setup>
import FolderFloat from './FolderFloat.vue'

const items = [
  'Try a warmer palette',
  'Tighten the spacing',
  { label: 'Logo feels small', value: 'logo' },
  'Love the new hero'
]
</script>

<template>
<div :style="{ position: 'relative', width: '100%', height: '500px', background: '#050610' }">
  <FolderFloat
    :items="items"
    label="Design feedback"
    sublabel=""
    trigger="hover"
    closeOnSelect
    physics
    :drift="0.5"
    folderColor="#3f3f46"
    frontColor="#52525b"
    paperColor="#f5f5f5"
    itemColor="#f5f5f5"
    itemTextColor="#18181b"
    labelColor="#f5f5f5"
    :width="200"
    :height="148"
    :radius="14"
    :spread="180"
    :lift="26"
    :tilt="8"
    :flapAngle="34"
    :restAngle="16"
    :openDuration="520"
    :stagger="45"
    :bounce="0.3"
    @select="(value, index) => console.log(value, index)"
    @openChange="open => console.log(open)"
  />
</div>
</template>`
});
