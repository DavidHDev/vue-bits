<template>
  <h1 class="sub-category">Aurora</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="aurora.usage"
    :source="auroraSource"
    component-name="Aurora"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <Aurora :color-stops="colorStops" :blend="blend" :speed="speed" class="w-full" />
        <BackgroundContent pillText="New Background" headline="Bring the Arctic to you, with one line of code" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewColorPicker title="Color 3" v-model="color3" />
        <PreviewSlider title="Blend" v-model="blend" :min="0" :max="1" :step="0.01" />
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="2" :step="0.1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="aurora" :usage="aurora.usage!" :source="auroraSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { aurora } from '@/constants/code/Backgrounds/auroraCode';
import Aurora from '@/content/Backgrounds/Aurora/Aurora.vue';
import auroraSource from '@/content/Backgrounds/Aurora/Aurora.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color1: '#171D22',
  color2: '#7cff67',
  color3: '#171D22',
  speed: 1,
  blend: 0.5
};

const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const color3 = ref(DEFAULTS.color3);
const blend = ref(DEFAULTS.blend);
const speed = ref(DEFAULTS.speed);

const colorStops = computed(() => [color1.value, color2.value, color3.value]);

const hasChanges = computed(
  () =>
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    color3.value !== DEFAULTS.color3 ||
    blend.value !== DEFAULTS.blend ||
    speed.value !== DEFAULTS.speed
);

function reset() {
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  color3.value = DEFAULTS.color3;
  blend.value = DEFAULTS.blend;
  speed.value = DEFAULTS.speed;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'colorStops',
    type: '[string, string, string]',
    default: '["#171D22", "#7cff67", "#171D22"]',
    description: 'An array of three hex colors defining the aurora gradient.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1.0',
    description: 'Controls the animation speed. Higher values make the aurora move faster.'
  },
  {
    name: 'blend',
    type: 'number',
    default: '0.5',
    description: 'Controls the blending of the aurora effect with the background.'
  },
  {
    name: 'amplitude',
    type: 'number',
    default: '1.0',
    description: 'Controls the height intensity of the aurora effect.'
  }
];
</script>
