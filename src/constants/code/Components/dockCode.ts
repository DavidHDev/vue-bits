import code from '@/content/Components/Dock/Dock.vue?raw';
import { createCodeObject } from '@/types/code';

export const dock = createCodeObject(code, 'Components/Dock', {
  dependencies: '',
  usage: `<template>
  <div style="position: relative; height: 400px">
    <Dock
      :items="items"
      :base-item-size="50"
      :magnification="70"
      :panel-height="68"
    />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { HugeiconsIcon, type IconArray } from '@hugeicons/vue';
import { Delete02Icon, Home01Icon, Mail01Icon, MusicNote03Icon, Settings01Icon } from '@hugeicons/core-free-icons';
import Dock, { type DockItemData } from './Dock.vue';

const glyph = (icon: IconArray) => h(HugeiconsIcon, { icon, strokeWidth: 1.8, width: '1em', height: '1em' });

const items: DockItemData[] = [
  {
    icon: glyph(Home01Icon),
    label: 'Home',
    active: true,
    onClick: () => console.log('Home'),
    menu: [
      { label: 'New Window', onClick: () => console.log('New Window') },
      { separator: true },
      { label: 'Options', items: [{ label: 'Open at Login', checked: true }, { label: 'Show in Finder' }] },
      { separator: true },
      { label: 'Quit', onClick: () => console.log('Quit') }
    ]
  },
  { icon: glyph(Mail01Icon), label: 'Mail', badge: 3, onClick: () => console.log('Mail') },
  { icon: glyph(MusicNote03Icon), label: 'Music', active: true, onClick: () => console.log('Music') },
  { icon: glyph(Settings01Icon), label: 'Settings', onClick: () => console.log('Settings') },
  { separator: true },
  { icon: glyph(Delete02Icon), label: 'Trash', onClick: () => console.log('Trash') }
];
</script>`
});
