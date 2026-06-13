<template>
  <h1 class="sub-category">Flying Posters</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="flyingPosters.usage"
    :source="flyingPostersSource"
    component-name="FlyingPosters"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <RefreshButton @click="forceRerender" />
        <FlyingPosters
          :key="rerenderKey"
          :items="items"
          :plane-width="planeWidth"
          :plane-height="planeHeight"
          :distortion="distortion"
          :scroll-ease="scrollEase"
          :camera-fov="cameraFov"
          :camera-z="cameraZ"
        />
        <div
          class="absolute inset-0 flex justify-center items-center font-[900] text-[#222] text-[clamp(2rem,6vw,6rem)] pointer-events-none select-none"
        >
          Scroll.
        </div>
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Plane Width" v-model="planeWidth" :min="300" :max="400" :step="10" />
        <PreviewSlider title="Plane Height" v-model="planeHeight" :min="200" :max="350" :step="10" />
        <PreviewSlider title="Distortion" v-model="distortion" :min="0" :max="10" :step="0.5" />
        <PreviewSlider title="Scroll Ease" v-model="scrollEase" :min="0.001" :max="0.05" :step="0.005" />
        <PreviewSlider title="Camera FOV" v-model="cameraFov" :min="20" :max="90" :step="1" />
        <PreviewSlider title="Camera Z" v-model="cameraZ" :min="5" :max="50" :step="2" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="flying-posters" :usage="flyingPosters.usage!" :source="flyingPostersSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { flyingPosters } from '@/constants/code/Components/flyingPostersCode';
import FlyingPosters from '@/content/Components/FlyingPosters/FlyingPosters.vue';
import flyingPostersSource from '@/content/Components/FlyingPosters/FlyingPosters.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  items: [
    'https://picsum.photos/500/500?grayscale',
    'https://picsum.photos/600/600?grayscale',
    'https://picsum.photos/400/400?grayscale'
  ],
  planeWidth: 320,
  planeHeight: 320,
  distortion: 3,
  scrollEase: 0.01,
  cameraFov: 45,
  cameraZ: 20
};

const items = ref(DEFAULTS.items);
const planeWidth = ref(DEFAULTS.planeWidth);
const planeHeight = ref(DEFAULTS.planeHeight);
const distortion = ref(DEFAULTS.distortion);
const scrollEase = ref(DEFAULTS.scrollEase);
const cameraFov = ref(DEFAULTS.cameraFov);
const cameraZ = ref(DEFAULTS.cameraZ);

const hasChanges = computed(
  () =>
    items.value !== DEFAULTS.items ||
    planeWidth.value !== DEFAULTS.planeWidth ||
    planeHeight.value !== DEFAULTS.planeHeight ||
    distortion.value !== DEFAULTS.distortion ||
    scrollEase.value !== DEFAULTS.scrollEase ||
    cameraFov.value !== DEFAULTS.cameraFov ||
    cameraZ.value !== DEFAULTS.cameraZ
);

function reset() {
  items.value = DEFAULTS.items;
  planeWidth.value = DEFAULTS.planeWidth;
  planeHeight.value = DEFAULTS.planeHeight;
  distortion.value = DEFAULTS.distortion;
  scrollEase.value = DEFAULTS.scrollEase;
  cameraFov.value = DEFAULTS.cameraFov;
  cameraZ.value = DEFAULTS.cameraZ;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'items',
    type: 'string[]',
    default: '[]',
    description: 'An array of image URLs to be displayed as flying posters.'
  },
  {
    name: 'planeWidth',
    type: 'number',
    default: '320',
    description: 'The width of each poster plane in pixels.'
  },
  {
    name: 'planeHeight',
    type: 'number',
    default: '320',
    description: 'The height of each poster plane in pixels.'
  },
  {
    name: 'distortion',
    type: 'number',
    default: '3',
    description: "The amount of distortion applied to the posters' movement."
  },
  {
    name: 'scrollEase',
    type: 'number',
    default: '0.01',
    description: 'The easing factor for smooth scrolling interactions.'
  },
  {
    name: 'cameraFov',
    type: 'number',
    default: '45',
    description: 'The field of view for the camera in degrees.'
  },
  {
    name: 'cameraZ',
    type: 'number',
    default: '20',
    description: 'The Z position of the camera, affecting zoom and perspective.'
  }
];
</script>
