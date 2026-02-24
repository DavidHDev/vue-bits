<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[400px] overflow-hidden">
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

      <Customize>
        <PreviewSelect
          title="Shape"
          v-model="shape"
          :options="shapeOptions"
        />

        <PreviewSelect
          title="Direction"
          v-model="direction"
          :options="directionOptions"
        />

        <PreviewSlider
          title="Radius X"
          v-model="radiusX"
          :min="50"
          :max="600"
          :step="10"
          value-unit="px"
        />

        <PreviewSlider
          title="Radius Y"
          v-model="radiusY"
          :min="50"
          :max="600"
          :step="10"
          value-unit="px"
        />

        <PreviewSlider
          title="Radius"
          v-model="radius"
          :min="50"
          :max="600"
          :step="10"
          value-unit="px"
        />

        <PreviewSlider
          title="Rotation"
          v-model="rotation"
          :min="-180"
          :max="180"
          :step="1"
          value-unit="°"
        />

        <PreviewSlider
          title="Duration"
          v-model="duration"
          :min="5"
          :max="120"
          :step="5"
          value-unit="s"
        />

        <PreviewSlider
          title="Item Size"
          v-model="itemSize"
          :min="20"
          :max="120"
          :step="4"
          value-unit="px"
        />

        <PreviewSwitch title="Fill (Distribute Evenly)" v-model="fill" />

        <PreviewSwitch title="Show Path" v-model="showPath" />

        <PreviewSwitch title="Paused" v-model="paused" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="[]" />
    </template>

    <template #code>
      <CodeExample :code-object="orbitImages" />
    </template>

    <template #cli>
      <CliInstallation :command="orbitImages.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import RefreshButton from '../../components/common/RefreshButton.vue';
import OrbitImages from '../../content/Animations/OrbitImages/OrbitImages.vue';
import { orbitImages } from '@/constants/code/Animations/orbitImagesCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { rerenderKey: key, forceRerender } = useForceRerender();

const images = [
  'https://picsum.photos/300/300?grayscale&random=1',
  'https://picsum.photos/300/300?grayscale&random=2',
  'https://picsum.photos/300/300?grayscale&random=3',
  'https://picsum.photos/300/300?grayscale&random=4',
  'https://picsum.photos/300/300?grayscale&random=5',
  'https://picsum.photos/300/300?grayscale&random=6'
];

const shape = ref<string>('ellipse');
const radiusX = ref(340);
const radiusY = ref(80);
const radius = ref(160);
const rotation = ref(-8);
const duration = ref(30);
const itemSize = ref(80);
const direction = ref<'normal' | 'reverse'>('normal');
const fill = ref(true);
const showPath = ref(true);
const paused = ref(false);

const shapeOptions = [
  { label: 'Ellipse', value: 'ellipse' },
  { label: 'Circle', value: 'circle' },
  { label: 'Square', value: 'square' },
  { label: 'Rectangle', value: 'rectangle' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Star', value: 'star' },
  { label: 'Heart', value: 'heart' },
  { label: 'Infinity', value: 'infinity' },
  { label: 'Wave', value: 'wave' }
];

const directionOptions = [
  { label: 'Normal', value: 'normal' },
  { label: 'Reverse', value: 'reverse' }
];

const propData = [
  { name: 'images', type: 'string[]', default: '[]', description: 'Array of image URLs to orbit along the path.' },
  { name: 'altPrefix', type: 'string', default: '"Orbiting image"', description: 'Prefix for auto-generated alt attributes.' },
  { name: 'shape', type: 'OrbitShape', default: '"ellipse"', description: 'Preset shape: ellipse, circle, square, rectangle, triangle, star, heart, infinity, wave, or custom.' },
  { name: 'customPath', type: 'string', default: 'undefined', description: 'Custom SVG path string (used when shape="custom").' },
  { name: 'baseWidth', type: 'number', default: '1400', description: 'Base width for the design coordinate space used for responsive scaling.' },
  { name: 'radiusX', type: 'number', default: '700', description: 'Horizontal radius for ellipse/rectangle shapes.' },
  { name: 'radiusY', type: 'number', default: '170', description: 'Vertical radius for ellipse/rectangle shapes.' },
  { name: 'radius', type: 'number', default: '300', description: 'Radius for circle, square, triangle, star, heart shapes.' },
  { name: 'starPoints', type: 'number', default: '5', description: 'Number of points for star shape.' },
  { name: 'starInnerRatio', type: 'number', default: '0.5', description: 'Inner radius ratio for star (0-1).' },
  { name: 'rotation', type: 'number', default: '-8', description: 'Rotation angle of the entire orbit path in degrees.' },
  { name: 'duration', type: 'number', default: '40', description: 'Duration of one complete orbit in seconds.' },
  { name: 'itemSize', type: 'number', default: '64', description: 'Width/height of each orbiting item in pixels.' },
  { name: 'direction', type: '"normal" | "reverse"', default: '"normal"', description: 'Animation direction.' },
  { name: 'fill', type: 'boolean', default: 'true', description: 'Whether to distribute items evenly around the orbit.' },
  { name: 'width', type: 'number | "100%"', default: '100', description: 'Container width in pixels or "100%".' },
  { name: 'height', type: 'number | "auto"', default: '100', description: 'Container height in pixels or "auto".' },
  { name: 'className', type: 'string', default: '""', description: 'Additional CSS class for the container.' },
  { name: 'showPath', type: 'boolean', default: 'false', description: 'Whether to show the orbit path for debugging.' },
  { name: 'pathColor', type: 'string', default: '"rgba(0,0,0,0.1)"', description: 'Stroke color when showPath is true.' },
  { name: 'pathWidth', type: 'number', default: '2', description: 'Stroke width when showPath is true.' },
  { name: 'easing', type: 'string', default: '"linear"', description: 'Animation easing: linear, easeIn, easeOut, easeInOut.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Whether the animation is paused.' },
  { name: 'responsive', type: 'boolean', default: 'false', description: 'Enable responsive scaling based on container width.' }
];

watch([shape, direction], () => {
  forceRerender();
});
</script>
