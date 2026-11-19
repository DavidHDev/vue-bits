import code from '@/content/Backgrounds/Ballpit/Ballpit.vue?raw';
import { createCodeObject } from '@/types/code';

export const ballpit = createCodeObject(code, 'Backgrounds/Ballpit', {
  dependencies: '',
  usage: `<!-- Component inspired by Kevin Levron: https://x.com/soju22/status/1858925191671271801 -->

<template>
  <div style="position: relative; overflow: hidden; height: 500px; width: 100%">
    <Ballpit
      :count="200"
      :colors="['#ffffff']"
      material="satin"
      :gravity="0"
      :drift="0.4"
      :follow-cursor="true"
      :grab="true"
      click-effect="burst"
    />
  </div>
</template>

<script setup lang="ts">
import Ballpit from './Ballpit.vue';
</script>`
});
