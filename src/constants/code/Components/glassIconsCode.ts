import code from '@/content/Components/GlassIcons/GlassIcons.vue?raw';
import { createCodeObject } from '@/types/code';

export const glassIcons = createCodeObject(code, 'Components/GlassIcons', {
  dependencies: '',
  usage: `<template>
  <div style="height: 600px; position: relative">
    <GlassIcons
      :items="items"
      :size="82"
      :gap="66"
      :columns="3"
      :roundness="0.6"
      :refraction="0.8"
      :bevel="0.6"
      :dispersion="0"
      :frost="0.2"
      :shine="0.85"
      tint="#dfdfdf"
      :tint-opacity="0.2"
      icon-color="#ffffff"
      plate="tilt"
      :tilt="30"
      :spread="0.5"
      hover="press"
      :parallax="1"
      labels="hover"
      :intro="true"
      theme="dark"
    />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { Folder01Icon, Book02Icon, FavouriteIcon, CloudIcon, Note01Icon, ChartHistogramIcon } from '@hugeicons/core-free-icons';
import GlassIcons, { type GlassIconsItem } from './GlassIcons.vue';

const glyph = (icon: IconArray) => h(HugeiconsIcon, { icon });

const items: GlassIconsItem[] = [
  { icon: glyph(Folder01Icon), color: 'blue', label: 'Files', href: '/files' },
  { icon: glyph(Book02Icon), color: 'teal', label: 'Books' },
  { icon: glyph(FavouriteIcon), color: 'red', label: 'Health' },
  { icon: glyph(CloudIcon), color: 'indigo', label: 'Weather' },
  { icon: glyph(Note01Icon), color: 'orange', label: 'Notes' },
  { icon: glyph(ChartHistogramIcon), color: 'green', label: 'Stats', onClick: () => {} }
];
</script>`
});
