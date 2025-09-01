<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container">
        <Waves :wave-speed-x="waveSpeedX" :line-color="color" class="w-full h-full" />
      </div>

      <Customize>
        <PreviewSlider title="Wave Speed X" v-model="waveSpeedX" :min="0" :max="0.1" :step="0.01" />

        <div class="flex items-center gap-4">
          <PreviewColor title="Waves Color" v-model="color" />
        </div>
      </Customize>

      <PropTable :data="propData" />

      <Dependencies :dependency-list="[]" />
    </template>

    <template #code>
      <CodeExample :code-object="waves" />
    </template>

    <template #cli>
      <CliInstallation :command="waves.cli" />
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
import Waves from '@/content/Backgrounds/Waves/Waves.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import { waves } from '@/constants/code/Backgrounds/wavesCode';

const color = ref('#ffffff');
const waveSpeedX = ref(0.0125);

const propData = [
  {
    name: 'lineColor',
    type: 'string',
    default: 'black',
    description: 'Defines the color of the wave lines drawn on the canvas.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: 'transparent',
    description: 'Sets the background color of the waves container.'
  },
  {
    name: 'waveSpeedX',
    type: 'number',
    default: '0.0125',
    description: 'Horizontal speed factor for the wave animation.'
  },
  {
    name: 'waveSpeedY',
    type: 'number',
    default: '0.005',
    description: 'Vertical speed factor for the wave animation.'
  },
  { name: 'waveAmpX', type: 'number', default: '32', description: 'Horizontal amplitude of each wave.' },
  { name: 'waveAmpY', type: 'number', default: '16', description: 'Vertical amplitude of each wave.' },
  { name: 'xGap', type: 'number', default: '10', description: 'Horizontal gap between individual wave lines.' },
  { name: 'yGap', type: 'number', default: '32', description: 'Vertical gap between points on each wave line.' },
  {
    name: 'friction',
    type: 'number',
    default: '0.925',
    description: 'Controls how quickly the cursor effect slows down.'
  },
  {
    name: 'tension',
    type: 'number',
    default: '0.005',
    description: 'Determines the "springiness" of the cursor effect on points.'
  },
  {
    name: 'maxCursorMove',
    type: 'number',
    default: '100',
    description: 'Limits how far each point can shift due to cursor movement.'
  },
  { name: 'style', type: 'object', default: '{}', description: 'Inline styles applied to the container element.' },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Custom class name(s) applied to the container element.'
  }
];
</script>
