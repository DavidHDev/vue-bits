<template>
  <h1 class="sub-category">Dome Gallery</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="domeGallery.usage"
    :source="domeGallerySource"
    component-name="DomeGallery"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] demo-container">
        <DomeGallery
          :key="rerenderKey"
          :fit="fit"
          :min-radius="minRadius"
          :max-vertical-rotation-deg="maxVerticalRotationDeg"
          :segments="segments"
          :drag-dampening="dragDampening"
          :grayscale="grayscale"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Fit" v-model="fit" :min="0.5" :max="1" :step="0.05" />
        <PreviewSlider title="Min Radius" v-model="minRadius" :min="300" :max="1000" :step="50" />
        <PreviewSlider title="Max Vertical Rotation" v-model="maxVerticalRotationDeg" :min="0" :max="20" :step="1" />
        <PreviewSlider title="Segments" v-model="segments" :min="20" :max="34" :step="2" />
        <PreviewSlider title="Drag Dampening" v-model="dragDampening" :min="0" :max="5" :step="0.2" />
        <PreviewSwitch title="Grayscale" v-model="grayscale" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="dome-gallery" :usage="domeGallery.usage!" :source="domeGallerySource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { domeGallery } from '@/constants/code/Components/domeGalleryCode';
import DomeGallery from '@/content/Components/DomeGallery/DomeGallery.vue';
import domeGallerySource from '@/content/Components/DomeGallery/DomeGallery.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  fit: 0.8,
  minRadius: 600,
  maxVerticalRotationDeg: 0,
  segments: 34,
  dragDampening: 2,
  grayscale: true
};

const fit = ref(DEFAULTS.fit);
const minRadius = ref(DEFAULTS.minRadius);
const maxVerticalRotationDeg = ref(DEFAULTS.maxVerticalRotationDeg);
const segments = ref(DEFAULTS.segments);
const dragDampening = ref(DEFAULTS.dragDampening);
const grayscale = ref(DEFAULTS.grayscale);

const hasChanges = computed(
  () =>
    fit.value !== DEFAULTS.fit ||
    minRadius.value !== DEFAULTS.minRadius ||
    maxVerticalRotationDeg.value !== DEFAULTS.maxVerticalRotationDeg ||
    segments.value !== DEFAULTS.segments ||
    dragDampening.value !== DEFAULTS.dragDampening ||
    grayscale.value !== DEFAULTS.grayscale
);

function reset() {
  fit.value = DEFAULTS.fit;
  minRadius.value = DEFAULTS.minRadius;
  maxVerticalRotationDeg.value = DEFAULTS.maxVerticalRotationDeg;
  segments.value = DEFAULTS.segments;
  dragDampening.value = DEFAULTS.dragDampening;
  grayscale.value = DEFAULTS.grayscale;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'images',
    type: '(string | { src: string; alt?: string })[]',
    default: 'DEFAULT_IMAGES',
    description: 'Array of image URLs (strings) or image objects with src and optional alt text'
  },
  {
    name: 'fit',
    type: 'number',
    default: '0.5',
    description: 'Size factor for the dome radius based on container dimensions'
  },
  {
    name: 'fitBasis',
    type: "'auto' | 'min' | 'max' | 'width' | 'height'",
    default: "'auto'",
    description: 'Basis for calculating the dome size'
  },
  {
    name: 'minRadius',
    type: 'number',
    default: '600',
    description: 'Minimum radius for the dome in pixels'
  },
  {
    name: 'maxRadius',
    type: 'number',
    default: 'Infinity',
    description: 'Maximum radius for the dome in pixels'
  },
  {
    name: 'padFactor',
    type: 'number',
    default: '0.25',
    description: 'Padding factor for the viewer area'
  },
  {
    name: 'overlayBlurColor',
    type: 'string',
    default: "'#120F17'",
    description: 'Color for the outer portion of the radial overlay blur'
  },
  {
    name: 'maxVerticalRotationDeg',
    type: 'number',
    default: '5',
    description: 'Maximum vertical rotation angle in degrees'
  },
  {
    name: 'dragSensitivity',
    type: 'number',
    default: '20',
    description: 'Sensitivity of drag interactions'
  },
  {
    name: 'enlargeTransitionMs',
    type: 'number',
    default: '300',
    description: 'Duration of image enlargement transition in milliseconds'
  },
  {
    name: 'segments',
    type: 'number',
    default: '35',
    description: 'Number of segments for both X and Y to keep the dome proportional'
  },
  {
    name: 'dragDampening',
    type: 'number',
    default: '2',
    description: 'Damping factor for drag inertia (0-1, higher = more damping)'
  },
  {
    name: 'openedImageWidth',
    type: 'string',
    default: "'400px'",
    description: 'Width of the enlarged image'
  },
  {
    name: 'openedImageHeight',
    type: 'string',
    default: "'400px'",
    description: 'Height of the enlarged image'
  },
  {
    name: 'imageBorderRadius',
    type: 'string',
    default: "'30px'",
    description: 'Border radius for closed tile images'
  },
  {
    name: 'openedImageBorderRadius',
    type: 'string',
    default: "'30px'",
    description: 'Border radius for opened/enlarged images'
  },
  {
    name: 'grayscale',
    type: 'boolean',
    default: 'true',
    description: 'Whether to render all images in grayscale'
  }
];
</script>
