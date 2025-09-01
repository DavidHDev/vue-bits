<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <Plasma
          :color="color"
          :speed="speed"
          :direction="direction"
          :scale="scale"
          :opacity="opacity"
          :mouseInteractive="mouseInteractive"
        />
        <BackgroundContent pill-text="New Background" headline="Minimal plasma waves that soothe the eyes" />
      </div>

      <Customize>
        <PreviewColor title="Color" v-model="color" />
        <PreviewSelect title="Direction" v-model="direction" :options="directionOptions" />
        <PreviewSlider :min="0.1" :max="3.0" :step="0.1" v-model="speed" title="Speed" />
        <PreviewSlider :min="0.5" :max="3.0" :step="0.1" v-model="scale" title="Scale" />
        <PreviewSlider :min="0.1" :max="1.0" :step="0.1" v-model="opacity" title="Opacity" />
        <PreviewSwitch title="Mouse Interactive" v-model="mouseInteractive" />
      </Customize>

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="plasma" />
    </template>

    <template #cli>
      <CliInstallation :command="plasma.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { plasma } from '@/constants/code/Backgrounds/plasmaCode';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSelect from '../../components/common/PreviewSelect.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import Plasma from '../../content/Backgrounds/Plasma/Plasma.vue';

const directionOptions = [
  { value: 'forward', label: 'Forward' },
  { value: 'reverse', label: 'Reverse' },
  { value: 'pingpong', label: 'Ping Pong' }
];

const color = ref('#9EF2BE');
const speed = ref(1.0);
const direction = ref<'forward' | 'reverse' | 'pingpong'>('forward');
const scale = ref(1.0);
const opacity = ref(1.0);
const mouseInteractive = ref(false);

const propData = [
  {
    name: 'color',
    type: 'string',
    default: 'undefined',
    description: 'Optional hex color to tint the plasma effect. If not provided, uses original colors.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1.0',
    description: 'Animation speed multiplier. Higher values = faster animation.'
  },
  {
    name: 'direction',
    type: "'forward' | 'reverse' | 'pingpong'",
    default: "'forward'",
    description: "Animation direction. 'pingpong' oscillates back and forth."
  },
  {
    name: 'scale',
    type: 'number',
    default: '1.0',
    description: 'Zoom level of the plasma pattern. Higher values zoom in.'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1.0',
    description: 'Overall opacity of the effect (0-1).'
  },
  {
    name: 'mouseInteractive',
    type: 'boolean',
    default: 'false',
    description: 'Whether the plasma responds to mouse movement.'
  }
];
</script>
