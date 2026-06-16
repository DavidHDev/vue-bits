<template>
  <h1 class="sub-category">Masonry</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="masonry.usage"
    :source="masonrySource"
    component-name="Masonry"
    :props-table="props"
  >
    <template #preview>
      <div class="relative demo-container" style="height: 700px; overflow: hidden">
        <RefreshButton @click="forceRerender" />
        <Masonry
          :key="rerenderKey"
          :items="sampleItems"
          :ease="ease"
          :duration="duration"
          :stagger="stagger"
          :animate-from="animateFrom"
          :scale-on-hover="scaleOnHover"
          :blur-to-focus="blurToFocus"
          :color-shift-on-hover="colorShiftOnHover"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Ease"
          v-model="ease"
          :options="[
            'power1.out',
            'power2.out',
            'power3.out',
            'power4.out',
            'back.out',
            'bounce.out',
            'elastic.out',
            'sine.out'
          ]"
        />
        <PreviewSelect
          title="Animation From"
          v-model="animateFrom"
          :options="['bottom', 'top', 'left', 'right', 'center', 'random']"
        />
        <PreviewSlider title="Duration" v-model="duration" :min="0.1" :max="2" :step="0.1" value-unit="s" />
        <PreviewSlider title="Stagger Delay (s)" v-model="stagger" :min="0.01" :max="0.2" :step="0.01" value-unit="s" />
        <PreviewSwitch title="Scale on Hover" v-model="scaleOnHover" />
        <PreviewSwitch title="Blur to Focus" v-model="blurToFocus" />
        <PreviewSwitch title="Color Shift on Hover" v-model="colorShiftOnHover" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="masonry" :usage="masonry.usage!" :source="masonrySource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { masonry } from '@/constants/code/Components/masonryCode';
import Masonry from '@/content/Components/Masonry/Masonry.vue';
import masonrySource from '@/content/Components/Masonry/Masonry.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  ease: 'power3.out',
  animateFrom: 'bottom' as 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random',
  duration: 0.6,
  stagger: 0.05,
  scaleOnHover: true,
  blurToFocus: true,
  colorShiftOnHover: false
};

const ease = ref(DEFAULTS.ease);
const duration = ref(DEFAULTS.duration);
const stagger = ref(DEFAULTS.stagger);
const animateFrom = ref<'bottom' | 'top' | 'left' | 'right' | 'center' | 'random'>(DEFAULTS.animateFrom);
const scaleOnHover = ref(DEFAULTS.scaleOnHover);
const blurToFocus = ref(DEFAULTS.blurToFocus);
const colorShiftOnHover = ref(DEFAULTS.colorShiftOnHover);

const sampleItems = ref([
  { id: '1', img: 'https://picsum.photos/300/400?random=1&grayscale', url: 'https://picsum.photos', height: 400 },
  { id: '2', img: 'https://picsum.photos/300/600?random=2&grayscale', url: 'https://picsum.photos', height: 600 },
  { id: '3', img: 'https://picsum.photos/300/350?random=3&grayscale', url: 'https://picsum.photos', height: 350 },
  { id: '4', img: 'https://picsum.photos/300/500?random=4&grayscale', url: 'https://picsum.photos', height: 500 },
  { id: '5', img: 'https://picsum.photos/300/450?random=5&grayscale', url: 'https://picsum.photos', height: 450 },
  { id: '6', img: 'https://picsum.photos/300/380?random=6&grayscale', url: 'https://picsum.photos', height: 380 },
  { id: '7', img: 'https://picsum.photos/300/520?random=7&grayscale', url: 'https://picsum.photos', height: 520 },
  { id: '8', img: 'https://picsum.photos/300/420?random=8&grayscale', url: 'https://picsum.photos', height: 420 },
  { id: '9', img: 'https://picsum.photos/300/480?random=9&grayscale', url: 'https://picsum.photos', height: 480 },
  { id: '10', img: 'https://picsum.photos/300/360?random=10&grayscale', url: 'https://picsum.photos', height: 360 },
  { id: '11', img: 'https://picsum.photos/300/550?random=11&grayscale', url: 'https://picsum.photos', height: 550 },
  { id: '12', img: 'https://picsum.photos/300/400?random=12&grayscale', url: 'https://picsum.photos', height: 400 },
  { id: '13', img: 'https://picsum.photos/300/470?random=13&grayscale', url: 'https://picsum.photos', height: 470 },
  { id: '14', img: 'https://picsum.photos/300/390?random=14&grayscale', url: 'https://picsum.photos', height: 390 },
  { id: '15', img: 'https://picsum.photos/300/510?random=15&grayscale', url: 'https://picsum.photos', height: 510 }
]);

const hasChanges = computed(
  () =>
    ease.value !== DEFAULTS.ease ||
    duration.value !== DEFAULTS.duration ||
    stagger.value !== DEFAULTS.stagger ||
    animateFrom.value !== DEFAULTS.animateFrom ||
    scaleOnHover.value !== DEFAULTS.scaleOnHover ||
    blurToFocus.value !== DEFAULTS.blurToFocus ||
    colorShiftOnHover.value !== DEFAULTS.colorShiftOnHover
);

function reset() {
  ease.value = DEFAULTS.ease;
  duration.value = DEFAULTS.duration;
  stagger.value = DEFAULTS.stagger;
  animateFrom.value = DEFAULTS.animateFrom;
  scaleOnHover.value = DEFAULTS.scaleOnHover;
  blurToFocus.value = DEFAULTS.blurToFocus;
  colorShiftOnHover.value = DEFAULTS.colorShiftOnHover;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'Item[]',
    default: '[]',
    description:
      'Array of items to display in the masonry grid. Each item must have id, img, url, and height properties.'
  },
  { name: 'ease', type: 'string', default: '"power3.out"', description: 'GSAP easing function for animations.' },
  { name: 'duration', type: 'number', default: '0.6', description: 'Duration of the animation in seconds.' },
  {
    name: 'stagger',
    type: 'number',
    default: '0.05',
    description: 'Stagger delay between item animations in seconds.'
  },
  {
    name: 'animateFrom',
    type: 'string',
    default: '"bottom"',
    description: 'Direction items animate from: "bottom", "top", "left", "right", "center", or "random".'
  },
  { name: 'scaleOnHover', type: 'boolean', default: 'true', description: 'Whether items scale on hover.' },
  { name: 'hoverScale', type: 'number', default: '0.95', description: 'Scale factor when hovering over items.' },
  {
    name: 'blurToFocus',
    type: 'boolean',
    default: 'true',
    description: 'Whether items start blurred and focus on entrance.'
  },
  {
    name: 'colorShiftOnHover',
    type: 'boolean',
    default: 'false',
    description: 'Whether to show color overlay on hover.'
  }
];
</script>
