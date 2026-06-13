<template>
  <h1 class="sub-category">Iridescence</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="iridescence.usage"
    :source="iridescenceSource"
    component-name="Iridescence"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <Iridescence :key="key" :speed="speed" :color="colors" :mouseReact="mouseReact" />
        <BackgroundContent pillText="New Background" headline="Radiant iridescence with customizable colors" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Base Color" v-model="colorHex" />
        <PreviewSlider :min="0" :max="2" :step="0.1" v-model="speed" title="Speed" />
        <PreviewSwitch v-model="mouseReact" title="Enable Mouse Interaction" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="iridescence" :usage="iridescence.usage!" :source="iridescenceSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { iridescence } from '@/constants/code/Backgrounds/iridescenceCode';
import Iridescence from '@/content/Backgrounds/Iridescence/Iridescence.vue';
import iridescenceSource from '@/content/Backgrounds/Iridescence/Iridescence.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  color: [0.5, 0.8, 0.1] as [number, number, number],
  speed: 1,
  mouseReact: true
};

const colors = ref<[number, number, number]>([...DEFAULTS.color]);
const speed = ref(DEFAULTS.speed);
const mouseReact = ref(DEFAULTS.mouseReact);

function rgbArrayToHex([r, g, b]: [number, number, number]) {
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgbArray(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
}

const colorHex = computed({
  get: () => rgbArrayToHex(colors.value),
  set: (hex: string) => {
    colors.value = hexToRgbArray(hex);
  }
});

const hasChanges = computed(
  () =>
    JSON.stringify(colors.value) !== JSON.stringify(DEFAULTS.color) ||
    speed.value !== DEFAULTS.speed ||
    mouseReact.value !== DEFAULTS.mouseReact
);

function reset() {
  colors.value = [...DEFAULTS.color];
  speed.value = DEFAULTS.speed;
  mouseReact.value = DEFAULTS.mouseReact;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'color',
    type: 'Array<number>',
    default: '[0.3, 0.2, 0.5]',
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
    default: 'false',
    description: 'Enable or disable mouse interaction with the shader.'
  }
];
</script>
