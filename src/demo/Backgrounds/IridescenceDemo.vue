<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <Iridescence :key="key" :speed="speed" :color="colors" :mouseReact="mouseInteraction" :amplitude="amplitude" />
        <BackgroundContent pillText="New Background" headline="Radiant iridescence with customizable colors" />
      </div>

      <Customize>
        <PreviewSlider :min="0" :max="1" :step="0.1" v-model="colors[0]" title="Red" />

        <PreviewSlider :min="0" :max="1" :step="0.1" v-model="colors[1]" title="Green" />

        <PreviewSlider :min="0" :max="1" :step="0.1" v-model="colors[2]" title="Blue" />

        <PreviewSlider :min="0" :max="2" :step="0.1" v-model="speed" title="Speed" />

        <PreviewSlider :min="0" :max="0.5" :step="0.01" v-model="amplitude" title="Amplitude" />

        <PreviewSwitch v-model="mouseInteraction" title="Enable Mouse Interaction" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependencyList="['ogl']" />
    </template>

    <template #code>
      <CodeExample :codeObject="iridescence" />
    </template>

    <template #cli>
      <CliInstallation v-bind="iridescence" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { useForceRerender } from '../../composables/useForceRerender';
import { iridescence } from '../../constants/code/Backgrounds/iridescenceCode';
import Iridescence from '../../content/Backgrounds/Iridescence/Iridescence.vue';

const colors = ref<[number, number, number]>([0.5, 0.6, 0.8]);
const speed = ref(1);
const amplitude = ref(0.1);
const mouseInteraction = ref(true);

const { rerenderKey: key } = useForceRerender();

const propData = [
  {
    name: 'color',
    type: 'Array<number>',
    default: '[1, 1, 1]',
    description: 'Base color as an array of RGB values (each between 0 and 1).'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1.0',
    description: 'Speed multiplier for the animation.'
  },
  {
    name: 'amplitude',
    type: 'number',
    default: '0.1',
    description: 'Amplitude for the mouse-driven effect.'
  },
  {
    name: 'mouseReact',
    type: 'boolean',
    default: 'true',
    description: 'Enable or disable mouse interaction with the shader.'
  }
];
</script>
