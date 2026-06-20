<template>
  <h1 class="sub-category">Lightning</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="lightning.usage"
    :source="lightningSource"
    component-name="Lightning"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <Lightning
          :key="rerenderKey"
          :hue="hue"
          :x-offset="xOffset"
          :speed="speed"
          :intensity="intensity"
          :size="size"
        />
        <BackgroundContent pillText="New Background" headline="The power of nature's fury, with Vue Bits!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Hue" v-model="hue" :min="0" :max="360" :step="1" />
        <PreviewSlider title="X Offset" v-model="xOffset" :min="-2" :max="2" :step="0.1" />
        <PreviewSlider title="Speed" v-model="speed" :min="0.5" :max="2" :step="0.1" />
        <PreviewSlider title="Intensity" v-model="intensity" :min="0.1" :max="2" :step="0.1" />
        <PreviewSlider title="Size" v-model="size" :min="0.1" :max="3" :step="0.1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="lightning" :usage="lightning.usage!" :source="lightningSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { lightning } from '@/constants/code/Backgrounds/lightningCode';
import Lightning from '@/content/Backgrounds/Lightning/Lightning.vue';
import lightningSource from '@/content/Backgrounds/Lightning/Lightning.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  hue: 120,
  xOffset: 0,
  speed: 1,
  intensity: 1,
  size: 1
};

const hue = ref(DEFAULTS.hue);
const xOffset = ref(DEFAULTS.xOffset);
const speed = ref(DEFAULTS.speed);
const intensity = ref(DEFAULTS.intensity);
const size = ref(DEFAULTS.size);

const hasChanges = computed(
  () =>
    hue.value !== DEFAULTS.hue ||
    xOffset.value !== DEFAULTS.xOffset ||
    speed.value !== DEFAULTS.speed ||
    intensity.value !== DEFAULTS.intensity ||
    size.value !== DEFAULTS.size
);

function reset() {
  hue.value = DEFAULTS.hue;
  xOffset.value = DEFAULTS.xOffset;
  speed.value = DEFAULTS.speed;
  intensity.value = DEFAULTS.intensity;
  size.value = DEFAULTS.size;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'hue', type: 'number', default: '230', description: 'Hue of the lightning in degrees (0 to 360).' },
  {
    name: 'xOffset',
    type: 'number',
    default: '0',
    description: 'Horizontal offset of the lightning in normalized units.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Animation speed multiplier for the lightning.' },
  { name: 'intensity', type: 'number', default: '1', description: 'Brightness multiplier for the lightning.' },
  { name: 'size', type: 'number', default: '1', description: 'Scale factor for the bolt size.' }
];
</script>
