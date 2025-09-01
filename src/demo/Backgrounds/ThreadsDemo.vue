<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
        <Threads
          :amplitude="amplitude"
          :distance="distance"
          :enableMouseInteraction="enableMouseInteraction"
          :color="[1, 1, 1]"
        />
        <BackgroundContent pillText="New Background" headline="Not to be confused with the Threads app by Meta!" />
      </div>

      <Customize>
        <PreviewSlider :min="0" :max="5" :step="0.1" v-model="amplitude" title="Amplitude" />

        <PreviewSlider :min="0" :max="2" :step="0.1" v-model="distance" title="Distance" />

        <PreviewSwitch v-model="enableMouseInteraction" title="Enable Mouse Interaction" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependencyList="['ogl']" />
    </template>

    <template #code>
      <CodeExample :codeObject="threads" />
    </template>

    <template #cli>
      <CliInstallation :command="threads.cli" />
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
import { threads } from '../../constants/code/Backgrounds/threadsCode';
import Threads from '../../content/Backgrounds/Threads/Threads.vue';

const amplitude = ref(1);
const distance = ref(0);
const enableMouseInteraction = ref(true);

const propData = [
  {
    name: 'color',
    type: '[number, number, number]',
    default: '[1, 1, 1]',
    description: 'Customizes the color of the lines (RGB).'
  },
  {
    name: 'amplitude',
    type: 'number',
    default: '1',
    description: 'Adjusts the intensity of the wave effect on the lines.'
  },
  {
    name: 'distance',
    type: 'number',
    default: '0',
    description: 'Controls the spacing between the lines. A value of 0 means no offset.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'false',
    description: "Enables smooth mouse hover effects that modulate the line's movement and amplitude."
  }
];
</script>
