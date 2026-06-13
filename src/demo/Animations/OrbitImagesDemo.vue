<template>
  <h1 class="sub-category">Orbit Images</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="orbitImages.usage"
    :source="orbitImagesSource"
    component-name="OrbitImages"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
        <RefreshButton @click="forceRerender" />
        <OrbitImages
          :key="key"
          :images="images"
          :shape="shape"
          :radius-x="radiusX"
          :radius-y="radiusY"
          :radius="radius"
          :rotation="rotation"
          :duration="duration"
          :item-size="itemSize"
          :direction="direction"
          :fill="fill"
          :show-path="showPath"
          :paused="paused"
          :responsive="true"
          path-color="rgba(255,255,255,0.15)"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect
          title="Shape"
          v-model="shape"
          :options="['ellipse', 'circle', 'square', 'rectangle', 'triangle', 'star', 'heart', 'infinity', 'wave']"
        />
        <PreviewSelect title="Direction" v-model="direction" :options="['normal', 'reverse']" />
        <PreviewSlider title="Radius X" :min="50" :max="600" :step="10" v-model="radiusX" value-unit="px" />
        <PreviewSlider title="Radius Y" :min="50" :max="600" :step="10" v-model="radiusY" value-unit="px" />
        <PreviewSlider title="Radius" :min="50" :max="600" :step="10" v-model="radius" value-unit="px" />
        <PreviewSlider title="Rotation" :min="-180" :max="180" :step="1" v-model="rotation" value-unit="°" />
        <PreviewSlider title="Duration" :min="5" :max="120" :step="5" v-model="duration" value-unit="s" />
        <PreviewSlider title="Item Size" :min="20" :max="120" :step="4" v-model="itemSize" value-unit="px" />
        <PreviewSwitch title="Fill" v-model="fill" />
        <PreviewSwitch title="Show Path" v-model="showPath" />
        <PreviewSwitch title="Paused" v-model="paused" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="orbit-images" :usage="orbitImages.usage!" :source="orbitImagesSource" />
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
import { orbitImages } from '@/constants/code/Animations/orbitImagesCode';
import OrbitImages, { type OrbitShape } from '@/content/Animations/OrbitImages/OrbitImages.vue';
import orbitImagesSource from '@/content/Animations/OrbitImages/OrbitImages.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const images = [
  'https://picsum.photos/300/300?grayscale&random=1',
  'https://picsum.photos/300/300?grayscale&random=2',
  'https://picsum.photos/300/300?grayscale&random=3',
  'https://picsum.photos/300/300?grayscale&random=4',
  'https://picsum.photos/300/300?grayscale&random=5',
  'https://picsum.photos/300/300?grayscale&random=6'
];

const DEFAULTS = {
  shape: 'ellipse' as OrbitShape,
  radiusX: 340,
  radiusY: 80,
  radius: 160,
  rotation: -8,
  duration: 30,
  itemSize: 80,
  direction: 'normal' as 'normal' | 'reverse',
  fill: true,
  showPath: true,
  paused: false
};

const shape = ref<OrbitShape>(DEFAULTS.shape);
const radiusX = ref(DEFAULTS.radiusX);
const radiusY = ref(DEFAULTS.radiusY);
const radius = ref(DEFAULTS.radius);
const rotation = ref(DEFAULTS.rotation);
const duration = ref(DEFAULTS.duration);
const itemSize = ref(DEFAULTS.itemSize);
const direction = ref<'normal' | 'reverse'>(DEFAULTS.direction);
const fill = ref(DEFAULTS.fill);
const showPath = ref(DEFAULTS.showPath);
const paused = ref(DEFAULTS.paused);

const hasChanges = computed(
  () =>
    shape.value !== DEFAULTS.shape ||
    radiusX.value !== DEFAULTS.radiusX ||
    radiusY.value !== DEFAULTS.radiusY ||
    radius.value !== DEFAULTS.radius ||
    rotation.value !== DEFAULTS.rotation ||
    duration.value !== DEFAULTS.duration ||
    itemSize.value !== DEFAULTS.itemSize ||
    direction.value !== DEFAULTS.direction ||
    fill.value !== DEFAULTS.fill ||
    showPath.value !== DEFAULTS.showPath ||
    paused.value !== DEFAULTS.paused
);

function reset() {
  shape.value = DEFAULTS.shape;
  radiusX.value = DEFAULTS.radiusX;
  radiusY.value = DEFAULTS.radiusY;
  radius.value = DEFAULTS.radius;
  rotation.value = DEFAULTS.rotation;
  duration.value = DEFAULTS.duration;
  itemSize.value = DEFAULTS.itemSize;
  direction.value = DEFAULTS.direction;
  fill.value = DEFAULTS.fill;
  showPath.value = DEFAULTS.showPath;
  paused.value = DEFAULTS.paused;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'images', type: 'string[]', default: '[]', description: 'Array of image URLs to orbit along the path.' },
  {
    name: 'altPrefix',
    type: 'string',
    default: '"Orbiting image"',
    description: 'Prefix for auto-generated alt attributes.'
  },
  {
    name: 'shape',
    type: 'string',
    default: '"ellipse"',
    description: 'Preset shape: ellipse, circle, square, rectangle, triangle, star, heart, infinity, wave, or custom.'
  },
  {
    name: 'customPath',
    type: 'string',
    default: 'undefined',
    description: 'Custom SVG path string (used when shape="custom").'
  },
  {
    name: 'baseWidth',
    type: 'number',
    default: '1400',
    description: 'Base width for the design coordinate space used for responsive scaling.'
  },
  { name: 'radiusX', type: 'number', default: '700', description: 'Horizontal radius for ellipse/rectangle shapes.' },
  { name: 'radiusY', type: 'number', default: '170', description: 'Vertical radius for ellipse/rectangle shapes.' },
  {
    name: 'radius',
    type: 'number',
    default: '300',
    description: 'Radius for circle, square, triangle, star, heart shapes.'
  },
  { name: 'starPoints', type: 'number', default: '5', description: 'Number of points for star shape.' },
  { name: 'starInnerRatio', type: 'number', default: '0.5', description: 'Inner radius ratio for star (0-1).' },
  {
    name: 'rotation',
    type: 'number',
    default: '-8',
    description: 'Rotation angle of the entire orbit path in degrees.'
  },
  { name: 'duration', type: 'number', default: '40', description: 'Duration of one complete orbit in seconds.' },
  { name: 'itemSize', type: 'number', default: '64', description: 'Width/height of each orbiting item in pixels.' },
  {
    name: 'direction',
    type: 'string',
    default: '"normal"',
    description: 'Animation direction: "normal" or "reverse".'
  },
  {
    name: 'fill',
    type: 'boolean',
    default: 'true',
    description: 'Whether to distribute items evenly around the orbit.'
  },
  { name: 'width', type: 'number | "100%"', default: '100', description: 'Container width in pixels or "100%".' },
  { name: 'height', type: 'number | "auto"', default: '100', description: 'Container height in pixels or "auto".' },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS class for the container.' },
  { name: 'showPath', type: 'boolean', default: 'false', description: 'Whether to show the orbit path for debugging.' },
  {
    name: 'pathColor',
    type: 'string',
    default: '"rgba(0,0,0,0.1)"',
    description: 'Stroke color when showPath is true.'
  },
  { name: 'pathWidth', type: 'number', default: '2', description: 'Stroke width when showPath is true.' },
  {
    name: 'easing',
    type: 'string',
    default: '"linear"',
    description: 'Animation easing: linear, easeIn, easeOut, easeInOut.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Whether the animation is paused.' },
  {
    name: 'centerContent',
    type: 'slot',
    default: 'undefined',
    description: 'Custom content rendered at the center of the orbit.'
  },
  {
    name: 'responsive',
    type: 'boolean',
    default: 'false',
    description: 'Enable responsive scaling based on container width.'
  }
];
</script>
