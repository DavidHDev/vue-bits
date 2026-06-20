<template>
  <h1 class="sub-category">Circular Gallery</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="circularGallery.usage"
    :source="circularGallerySource"
    component-name="CircularGallery"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] demo-container">
        <CircularGallery
          :key="rerenderKey"
          :bend="bend"
          :border-radius="borderRadius"
          :scroll-speed="scrollSpeed"
          :scroll-ease="scrollEase"
          :font-url="fontUrl"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="Font" v-model="fontUrl" :options="FONT_OPTIONS" />
        <PreviewSlider title="Bend Level" v-model="bend" :min="-10" :max="10" :step="1" />
        <PreviewSlider title="Border Radius" v-model="borderRadius" :min="0" :max="0.5" :step="0.01" />
        <PreviewSlider title="Scroll Speed" v-model="scrollSpeed" :min="0.5" :max="5" :step="0.1" />
        <PreviewSlider title="Scroll Ease" v-model="scrollEase" :min="0.01" :max="0.15" :step="0.01" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="circular-gallery" :usage="circularGallery.usage!" :source="circularGallerySource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { circularGallery } from '@/constants/code/Components/circularGalleryCode';
import CircularGallery from '@/content/Components/CircularGallery/CircularGallery.vue';
import circularGallerySource from '@/content/Components/CircularGallery/CircularGallery.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  bend: 1,
  borderRadius: 0.05,
  scrollSpeed: 2,
  scrollEase: 0.05,
  fontUrl: ''
};

const bend = ref(DEFAULTS.bend);
const borderRadius = ref(DEFAULTS.borderRadius);
const scrollSpeed = ref(DEFAULTS.scrollSpeed);
const scrollEase = ref(DEFAULTS.scrollEase);
const fontUrl = ref(DEFAULTS.fontUrl);

const FONT_OPTIONS = [
  { label: 'Figtree (default)', value: '' },
  { label: 'Orbitron', value: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap' },
  {
    label: 'Playfair Display',
    value: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap'
  },
  { label: 'Pacifico', value: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap' },
  { label: 'Bungee', value: 'https://fonts.googleapis.com/css2?family=Bungee&display=swap' },
  { label: 'Roboto Mono', value: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap' }
];

const hasChanges = computed(
  () =>
    bend.value !== DEFAULTS.bend ||
    borderRadius.value !== DEFAULTS.borderRadius ||
    scrollSpeed.value !== DEFAULTS.scrollSpeed ||
    scrollEase.value !== DEFAULTS.scrollEase ||
    fontUrl.value !== DEFAULTS.fontUrl
);

function reset() {
  bend.value = DEFAULTS.bend;
  borderRadius.value = DEFAULTS.borderRadius;
  scrollSpeed.value = DEFAULTS.scrollSpeed;
  scrollEase.value = DEFAULTS.scrollEase;
  fontUrl.value = DEFAULTS.fontUrl;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'Array<{ image: string; text: string }>',
    default: 'undefined',
    description: 'List of items to display in the gallery. Each item should have an image URL and a text label.'
  },
  {
    name: 'bend',
    type: 'number',
    default: '3',
    description:
      'Determines the curvature of the gallery layout. A negative value bends in one direction, a positive value in the opposite.'
  },
  {
    name: 'textColor',
    type: 'string',
    default: '"#ffffff"',
    description: 'Specifies the color of the text labels.'
  },
  {
    name: 'borderRadius',
    type: 'number',
    default: '0.05',
    description: 'Sets the border radius for the media items to achieve rounded corners.'
  },
  {
    name: 'font',
    type: 'string',
    default: '"bold 30px Figtree"',
    description: 'CSS font shorthand (style, weight, size, family) used for the text labels below each card.'
  },
  {
    name: 'fontUrl',
    type: 'string',
    default: 'undefined',
    description:
      'URL of a font to load for the labels. Accepts a stylesheet URL (e.g. a Google Fonts link) or a direct font file (.woff2, .woff, .ttf, .otf). The loaded family overrides the family in `font`.'
  },
  {
    name: 'scrollSpeed',
    type: 'number',
    default: '2',
    description:
      'Controls how much the gallery moves per scroll event. Lower values result in slower scrolling, higher values in faster scrolling.'
  },
  {
    name: 'scrollEase',
    type: 'number',
    default: '0.05',
    description:
      'Controls the smoothness of scroll transitions. Lower values create smoother, more fluid motion, while higher values make it more responsive.'
  }
];
</script>
