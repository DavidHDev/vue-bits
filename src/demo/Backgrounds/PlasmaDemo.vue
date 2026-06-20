<template>
  <h1 class="sub-category">Plasma</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="plasma.usage"
    :source="plasmaSource"
    component-name="Plasma"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
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
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewSelect title="Direction" v-model="direction" :options="directionOptions" />
        <PreviewSlider :min="0.1" :max="3.0" :step="0.1" v-model="speed" title="Speed" />
        <PreviewSlider :min="0.5" :max="3.0" :step="0.1" v-model="scale" title="Scale" />
        <PreviewSlider :min="0.1" :max="1.0" :step="0.1" v-model="opacity" title="Opacity" />
        <PreviewSwitch title="Mouse Interactive" v-model="mouseInteractive" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="plasma" :usage="plasma.usage!" :source="plasmaSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { plasma } from '@/constants/code/Backgrounds/plasmaCode';
import Plasma from '@/content/Backgrounds/Plasma/Plasma.vue';
import plasmaSource from '@/content/Backgrounds/Plasma/Plasma.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  color: '#9EF2BE',
  speed: 1.0,
  direction: 'forward' as 'forward' | 'reverse' | 'pingpong',
  scale: 1.0,
  opacity: 1.0,
  mouseInteractive: false
};

const color = ref(DEFAULTS.color);
const speed = ref(DEFAULTS.speed);
const direction = ref(DEFAULTS.direction);
const scale = ref(DEFAULTS.scale);
const opacity = ref(DEFAULTS.opacity);
const mouseInteractive = ref(DEFAULTS.mouseInteractive);

const directionOptions = [
  { value: 'forward', label: 'Forward' },
  { value: 'reverse', label: 'Reverse' },
  { value: 'pingpong', label: 'Ping Pong' }
];

const hasChanges = computed(
  () =>
    color.value !== DEFAULTS.color ||
    speed.value !== DEFAULTS.speed ||
    direction.value !== DEFAULTS.direction ||
    scale.value !== DEFAULTS.scale ||
    opacity.value !== DEFAULTS.opacity ||
    mouseInteractive.value !== DEFAULTS.mouseInteractive
);

function reset() {
  color.value = DEFAULTS.color;
  speed.value = DEFAULTS.speed;
  direction.value = DEFAULTS.direction;
  scale.value = DEFAULTS.scale;
  opacity.value = DEFAULTS.opacity;
  mouseInteractive.value = DEFAULTS.mouseInteractive;
  forceRerender();
}

const props: PropRow[] = [
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
