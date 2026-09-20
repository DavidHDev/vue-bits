import code from '@/content/Micro/BranchedMenu/BranchedMenu.vue?raw';
import { createCodeObject } from '@/types/code';

export const branchedMenu = createCodeObject(code, 'Micro/BranchedMenu', {
  usage: `<script setup>
import { Download04Icon, Rocket01Icon, Settings02Icon } from '@hugeicons/core-free-icons';
import BranchedMenu from './BranchedMenu.vue'
</script>

<template>
<div :style="{ position: 'relative', width: '100%', height: '500px', background: '#050610' }">
  <BranchedMenu
    :items="[
        {
        label: 'Getting started',
        children: [
            { value: 'install', label: 'Installation', icon: Download04Icon },
            { value: 'quick', label: 'Quick start', icon: Rocket01Icon },
            { value: 'config', label: 'Configuration', icon: Settings02Icon }
        ]
        },
        { label: 'Components', children: [{ value: 'buttons', label: 'Buttons' }, { value: 'overlays', label: 'Overlays' }] }
    ]"
    :defaultOpen="[0]"
    defaultActive="quick"
    color="#f5f5f5"
    accentColor="#f5f5f5"
    lineColor="#3f3f46"
    :width="240"
    :rowHeight="36"
    :indent="40"
    :trunk="14"
    :radius="10"
    :lineWidth="1.5"
    :fontSize="14"
    :drawDuration="400"
    :foldDuration="300"
    @select="(value, item) => navigate(value)"
  />
</div>
</template>`
});
