<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container">
        <LetterGlitch
          :key="rerenderKey"
          :glitch-colors="colors"
          :glitch-speed="speed"
          :center-vignette="showCenterVignette"
          :outer-vignette="showOuterVignette"
          :smooth="smooth"
          class="w-full h-full"
        />
        <BackgroundContent pillText="New Background" headline="Am I finally a real hacker now, mom?" />
      </div>

      <Customize>
        <button
          @click="randomizeColors"
          class="bg-[#111] hover:bg-[#222] px-3 py-2 border border-[#333] rounded-lg text-white text-xs transition-colors"
        >
          Randomize Colors
        </button>

        <PreviewSlider title="Glitch Speed" v-model="speed" :min="0" :max="100" :step="5" />

        <PreviewSwitch title="Smooth Animation" v-model="smooth" />

        <PreviewSwitch title="Show Center Vignette" v-model="showCenterVignette" />

        <PreviewSwitch title="Show Outer Vignette" v-model="showOuterVignette" />
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="[]" />
    </template>

    <template #code>
      <CodeExample :code-object="letterGlitch" />
    </template>

    <template #cli>
      <CliInstallation :command="letterGlitch.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { letterGlitch } from '@/constants/code/Backgrounds/letterGlitchCode';
import LetterGlitch from '@/content/Backgrounds/LetterGlitch/LetterGlitch.vue';
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';

const smooth = ref(true);
const speed = ref(10);
const colors = ref(['#2b4539', '#61dca3', '#61b3dc']);
const showCenterVignette = ref(true);
const showOuterVignette = ref(false);

const { rerenderKey, forceRerender } = useForceRerender();

const randomHex = () => {
  return (
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
  );
};

const randomizeColors = () => {
  colors.value = [randomHex(), randomHex(), randomHex()];
  forceRerender();
};

const propData = [
  {
    name: 'glitchColors',
    type: 'string[]',
    default: "['#2b4539', '#61dca3', '#61b3dc']",
    description: 'Controls the colors of the letters rendered in the canvas.'
  },
  {
    name: 'glitchSpeed',
    type: 'number',
    default: '50',
    description: 'Controls the speed at which letters scramble in the animation.'
  },
  {
    name: 'centerVignette',
    type: 'boolean',
    default: 'false',
    description: 'When true, renders a radial gradient in the center of the container'
  },
  {
    name: 'outerVignette',
    type: 'boolean',
    default: 'true',
    description: 'When true, renders an inner radial gradient around the edges of the container.'
  },
  {
    name: 'smooth',
    type: 'boolean',
    default: 'true',
    description: 'When true, smoothens the animation of the letters for a more subtle feel.'
  }
];
</script>
