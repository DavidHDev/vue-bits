<script setup lang="ts">
const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

type Item = { name: string; cat: 'backgrounds' | 'animations' };

const ROW_A: Item[] = [
  { name: 'Dot Field', cat: 'backgrounds' },
  { name: 'Line Waves', cat: 'backgrounds' },
  { name: 'Blob Cursor', cat: 'animations' },
  { name: 'Soft Aurora', cat: 'backgrounds' },
  { name: 'Magnet Lines', cat: 'animations' },
  { name: 'Antigravity', cat: 'animations' },
  { name: 'Ballpit', cat: 'backgrounds' },
  { name: 'Pixel Trail', cat: 'animations' },
  { name: 'Magic Rings', cat: 'animations' }
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

// Note: components don't exist yet, so links go to /get-started/introduction
const HREF = '/get-started/introduction';
const rowADoubled = [...ROW_A, ...ROW_A];
const rowBDoubled = [...ROW_B, ...ROW_B];
</script>

<template>
  <div class="ln-feat-marquee">
    <div class="ln-feat-marquee-track">
      <div class="ln-feat-marquee-scroll">
        <a
          v-for="(c, i) in rowADoubled"
          :key="i"
          :href="HREF"
          :data-slug="toSlug(c.name)"
          :data-cat="c.cat"
          class="ln-feat-pill"
        >
          {{ c.name }}
        </a>
      </div>
    </div>
    <div class="ln-feat-marquee-track">
      <div class="ln-feat-marquee-scroll--rev ln-feat-marquee-scroll">
        <a
          v-for="(c, i) in rowBDoubled"
          :key="i"
          :href="HREF"
          :data-slug="toSlug(c.name)"
          :data-cat="c.cat"
          class="ln-feat-pill"
        >
          {{ c.name }}
        </a>
      </div>
    </div>
  </div>
</template>
