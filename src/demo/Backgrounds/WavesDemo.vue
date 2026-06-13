<template>
  <h1 class="sub-category">Waves</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="waves.usage"
    :source="wavesSource"
    component-name="Waves"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <Waves :wave-speed-x="waveSpeedX" :line-color="color" class="w-full h-full" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Wave Speed X" v-model="waveSpeedX" :min="0" :max="0.1" :step="0.01" />
        <PreviewColorPicker title="Waves Color" v-model="color" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="waves" :usage="waves.usage!" :source="wavesSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { waves } from '@/constants/code/Backgrounds/wavesCode';
import Waves from '@/content/Backgrounds/Waves/Waves.vue';
import wavesSource from '@/content/Backgrounds/Waves/Waves.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  lineColor: '#ffffff',
  waveSpeedX: 0.0125
};

const color = ref(DEFAULTS.lineColor);
const waveSpeedX = ref(DEFAULTS.waveSpeedX);

const hasChanges = computed(() => color.value !== DEFAULTS.lineColor || waveSpeedX.value !== DEFAULTS.waveSpeedX);

function reset() {
  color.value = DEFAULTS.lineColor;
  waveSpeedX.value = DEFAULTS.waveSpeedX;
  forceRerender();
}

const props: PropRow[] = [
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
  {
    name: 'waveAmpX',
    type: 'number',
    default: '32',
    description: 'Horizontal amplitude of each wave.'
  },
  {
    name: 'waveAmpY',
    type: 'number',
    default: '16',
    description: 'Vertical amplitude of each wave.'
  },
  {
    name: 'xGap',
    type: 'number',
    default: '10',
    description: 'Horizontal gap between individual wave lines.'
  },
  {
    name: 'yGap',
    type: 'number',
    default: '32',
    description: 'Vertical gap between points on each wave line.'
  },
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
    description: "Determines the 'springiness' of the cursor effect on points."
  },
  {
    name: 'maxCursorMove',
    type: 'number',
    default: '100',
    description: 'Limits how far each point can shift due to cursor movement.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles applied to the container element.'
  },
  {
    name: 'className',
    type: 'string',
    default: '',
    description: 'Custom class name(s) applied to the container element.'
  }
];
</script>
