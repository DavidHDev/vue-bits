<script setup lang="ts">
import { getComponentCatalog } from '@/utils/catalog';

const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

type Item = { name: string; cat: string };

const ROW_A: Item[] = [
  { name: 'Dot Field', cat: 'backgrounds' },
  { name: 'Line Waves', cat: 'backgrounds' },
  { name: 'Blob Cursor', cat: 'animations' },
  { name: 'Soft Aurora', cat: 'backgrounds' },
  { name: 'Magnet Lines', cat: 'backgrounds' },
  { name: 'Antigravity', cat: 'backgrounds' },
  { name: 'Ballpit', cat: 'backgrounds' },
  { name: 'Pixel Trail', cat: 'animations' },
  { name: 'Magic Rings', cat: 'backgrounds' }
];

const ROW_B: Item[] = [
  { name: 'Radar', cat: 'backgrounds' },
  { name: 'Shape Grid', cat: 'backgrounds' },
  { name: 'Ribbons', cat: 'animations' },
  { name: 'Grainient', cat: 'backgrounds' },
  { name: 'Orbit Images', cat: 'animations' },
  { name: 'Metallic Paint', cat: 'animations' },
  { name: 'Balatro', cat: 'backgrounds' },
  { name: 'Aurora', cat: 'backgrounds' },
  { name: 'Splash Cursor', cat: 'animations' },
  { name: 'Beams', cat: 'backgrounds' }
];

const catalog = getComponentCatalog();
const pathFor = (item: Item) =>
  catalog.find(entry => entry.name === item.name)?.path ?? `/${item.cat}/${toSlug(item.name)}`;

const rowA = [...ROW_A, ...ROW_A].map(item => ({ ...item, to: pathFor(item) }));
const rowB = [...ROW_B, ...ROW_B].map(item => ({ ...item, to: pathFor(item) }));
</script>

<template>
  <div class="ln-feat-marquee">
    <div class="ln-feat-marquee-track">
      <div class="ln-feat-marquee-scroll">
        <RouterLink v-for="(c, i) in rowA" :key="i" :to="c.to" class="ln-feat-pill">{{ c.name }}</RouterLink>
      </div>
    </div>
    <div class="ln-feat-marquee-track">
      <div class="ln-feat-marquee-scroll ln-feat-marquee-scroll--rev">
        <RouterLink v-for="(c, i) in rowB" :key="i" :to="c.to" class="ln-feat-pill">{{ c.name }}</RouterLink>
      </div>
    </div>
  </div>
</template>
