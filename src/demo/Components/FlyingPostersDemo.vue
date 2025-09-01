<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container h-[600px] overflow-hidden">
        <FlyingPosters
          :key="rerenderKey"
          :items="items"
          :plane-width="planeWidth"
          :plane-height="planeHeight"
          :distortion="distortion"
          :scroll-ease="scrollEase"
          :camera-fov="cameraFov"
          :camera-z="cameraZ"
          class="h-full w-full"
        />

        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none text-[4rem] font-[900] text-[#222] select-none"
        >
          Scroll.
        </div>
      </div>

      <Customize>
        <PreviewSlider title="Plane Width" v-model="planeWidth" :min="200" :max="400" :step="20" />

        <PreviewSlider title="Plane Height" v-model="planeHeight" :min="200" :max="400" :step="20" />

        <PreviewSlider title="Distortion" v-model="distortion" :min="0" :max="10" :step="0.5" />

        <PreviewSlider title="Scroll Ease" v-model="scrollEase" :min="0.005" :max="0.05" :step="0.005" />

        <PreviewSlider title="Camera FOV" v-model="cameraFov" :min="30" :max="90" :step="5" />

        <PreviewSlider title="Camera Z" v-model="cameraZ" :min="10" :max="40" :step="2" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="flyingPosters" />
    </template>

    <template #cli>
      <CliInstallation :command="flyingPosters.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import FlyingPosters from '../../content/Components/FlyingPosters/FlyingPosters.vue';
import { flyingPosters } from '@/constants/code/Components/flyingPostersCode';
import { useForceRerender } from '@/composables/useForceRerender';

const planeWidth = ref(320);
const planeHeight = ref(320);
const distortion = ref(3);
const scrollEase = ref(0.01);
const cameraFov = ref(45);
const cameraZ = ref(20);

const { rerenderKey } = useForceRerender();

const items = ref([
  'https://picsum.photos/800/800?grayscale&random=1',
  'https://picsum.photos/800/800?grayscale&random=2',
  'https://picsum.photos/800/800?grayscale&random=3',
  'https://picsum.photos/800/800?grayscale&random=4',
  'https://picsum.photos/800/800?grayscale&random=5',
  'https://picsum.photos/800/800?grayscale&random=6',
  'https://picsum.photos/800/800?grayscale&random=7',
  'https://picsum.photos/800/800?grayscale&random=8',
  'https://picsum.photos/800/800?grayscale&random=9',
  'https://picsum.photos/800/800?grayscale&random=10',
  'https://picsum.photos/800/800?grayscale&random=11',
  'https://picsum.photos/800/800?grayscale&random=12',
  'https://picsum.photos/800/800?grayscale&random=13',
  'https://picsum.photos/800/800?grayscale&random=14',
  'https://picsum.photos/800/800?grayscale&random=15'
]);

const propData = [
  {
    name: 'items',
    type: 'string[]',
    default: '[]',
    description:
      'An array of image URLs to display in the 3D poster gallery. Each URL should point to a valid image resource.'
  },
  {
    name: 'planeWidth',
    type: 'number',
    default: '320',
    description:
      'The width of each poster plane in pixels. This affects the visual size of the posters in the 3D space.'
  },
  {
    name: 'planeHeight',
    type: 'number',
    default: '320',
    description:
      'The height of each poster plane in pixels. This affects the visual size of the posters in the 3D space.'
  },
  {
    name: 'distortion',
    type: 'number',
    default: '3',
    description:
      'The amount of distortion effect applied to the posters during animation. Higher values create more dramatic effects.'
  },
  {
    name: 'scrollEase',
    type: 'number',
    default: '0.01',
    description: 'The easing factor for scroll animation. Lower values create smoother, more fluid scroll transitions.'
  },
  {
    name: 'cameraFov',
    type: 'number',
    default: '45',
    description:
      'The field of view for the 3D camera in degrees. A wider FOV shows more of the scene but with perspective distortion.'
  },
  {
    name: 'cameraZ',
    type: 'number',
    default: '20',
    description:
      'The Z-axis position of the 3D camera. Higher values move the camera further back, showing more posters at once.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Additional CSS classes to apply to the component container.'
  }
];
</script>
