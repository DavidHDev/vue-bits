<template>
  <TabbedLayout>
    <template #preview>
      <div class="demo-container flex items-center justify-center h-[400px]">
        <Shuffle
          :key="key"
          :text="text"
          :shuffle-direction="shuffleDirection"
          :duration="duration"
          :animation-mode="animationMode"
          :stagger="stagger"
          :trigger-on-hover="triggerOnHover"
          class="font-bold text-white pixel-font"
          :style="{ fontSize: fontSize + 'px' }"
        />
      </div>

      <Customize>
        <PreviewText title="Text" v-model="text" />
        <PreviewSelect title="Direction" :options="directionOptions" v-model="shuffleDirection" />
        <PreviewSelect title="Mode" :options="['evenodd', 'random']" v-model="animationMode" />
        <PreviewSlider title="Font Size (px)" :min="12" :max="100" :step="1" v-model="fontSize" />
        <PreviewSlider title="Duration" :min="0.1" :max="6" :step="0.1" v-model="duration" />
        <PreviewSlider title="Stagger" :min="0.01" :max="0.8" :step="0.01" v-model="stagger" />
        <PreviewSwitch title="Hover Trigger" v-model="triggerOnHover" />
        <RefreshButton @click="refresh" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="shuffle" />
    </template>

    <template #cli>
      <CliInstallation :command="shuffle.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import PropTable from '../../components/common/PropTable.vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewText from '@/components/common/PreviewText.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import Shuffle from '../../content/Animations/Shuffle/Shuffle.vue';
import { shuffle } from '@/constants/code/TextAnimations/shuffleCode';
import { useForceRerender } from '@/composables/useForceRerender';

const { key, refresh } = useForceRerender();

const text = ref('VUEBITS');
const shuffleDirection = ref<'left' | 'right' | 'top' | 'bottom' | 'center'>('center');
const duration = ref(1.6);
const fontSize = ref(50);

const directionOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Center', value: 'center' }
];
const animationMode = ref<'evenodd' | 'random'>('random');
const stagger = ref(0.2);
const triggerOnHover = ref(true);

const propData = [
  {
    name: 'text',
    type: 'string',
    default: '',
    description: 'The text to animate.'
  },
  {
    name: 'shuffle Direction',
    type: "'left' | 'right' | 'top' | 'bottom' | 'center'",
    default: "'center'",
    description: 'Direction of the slide animation.'
  },
  {
    name: 'duration',
    type: 'number',
    default: '0.9',
    description: 'Animation duration in seconds.'
  },
  {
    name: 'animationMode',
    type: "'evenodd' | 'random'",
    default: "'evenodd'",
    description: 'Staggering pattern.'
  },
  {
    name: 'stagger',
    type: 'number',
    default: '0.2',
    description: 'Delay between characters.'
  },
  {
    name: 'triggerOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Whether to re-trigger animation on hover.'
  }
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.pixel-font {
  font-family: 'Press Start 2P', cursive;
}
</style>
