<template>
  <h1 class="sub-category">Ghost Cursor</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="ghostCursor.usage"
    :source="ghostCursorSource"
    component-name="GhostCursor"
    :props-table="props"
  >
    <template #preview>
      <div class="relative w-full h-[600px] overflow-hidden demo-container">
        <GhostCursor
          :trail-length="trailLength"
          :inertia="inertia"
          :grain-intensity="grainIntensity"
          :bloom-strength="bloomStrength"
          :bloom-radius="bloomRadius"
          :bloom-threshold="bloomThreshold"
          :brightness="brightness"
          :color="color"
          :fade-delay-ms="fadeDelayMs"
          :fade-duration-ms="fadeDurationMs"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewSlider title="Trail Length" :min="5" :max="150" :step="1" v-model="trailLength" />
        <PreviewSlider title="Inertia" :min="0" :max="1" :step="0.05" v-model="inertia" />
        <PreviewSlider title="Brightness" :min="0.5" :max="5" :step="0.1" v-model="brightness" />
        <PreviewSlider title="Grain Intensity" :min="0" :max="0.5" :step="0.01" v-model="grainIntensity" />
        <PreviewSlider title="Bloom Strength" :min="0" :max="1" :step="0.05" v-model="bloomStrength" />
        <PreviewSlider title="Bloom Radius" :min="0" :max="3" :step="0.1" v-model="bloomRadius" />
        <PreviewSlider title="Bloom Threshold" :min="0" :max="1" :step="0.01" v-model="bloomThreshold" />
        <PreviewSlider title="Fade Delay (ms)" :min="0" :max="5000" :step="100" v-model="fadeDelayMs" />
        <PreviewSlider title="Fade Duration (ms)" :min="100" :max="5000" :step="100" v-model="fadeDurationMs" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="ghost-cursor" :usage="ghostCursor.usage!" :source="ghostCursorSource" />
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
import { useForceRerender } from '@/composables/useForceRerender.ts';
import { ghostCursor } from '@/constants/code/Animations/ghostCursorCode';
import GhostCursor from '@/content/Animations/GhostCursor/GhostCursor.vue';
import ghostCursorSource from '@/content/Animations/GhostCursor/GhostCursor.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  trailLength: 50,
  inertia: 0.5,
  grainIntensity: 0.05,
  bloomStrength: 0.1,
  bloomRadius: 1.0,
  bloomThreshold: 0.025,
  brightness: 2,
  color: '#A0FFBC',
  fadeDelayMs: 1000,
  fadeDurationMs: 1500
};

const trailLength = ref(DEFAULTS.trailLength);
const inertia = ref(DEFAULTS.inertia);
const grainIntensity = ref(DEFAULTS.grainIntensity);
const bloomStrength = ref(DEFAULTS.bloomStrength);
const bloomRadius = ref(DEFAULTS.bloomRadius);
const bloomThreshold = ref(DEFAULTS.bloomThreshold);
const brightness = ref(DEFAULTS.brightness);
const color = ref(DEFAULTS.color);
const fadeDelayMs = ref(DEFAULTS.fadeDelayMs);
const fadeDurationMs = ref(DEFAULTS.fadeDurationMs);

const hasChanges = computed(
  () =>
    trailLength.value !== DEFAULTS.trailLength ||
    inertia.value !== DEFAULTS.inertia ||
    grainIntensity.value !== DEFAULTS.grainIntensity ||
    bloomStrength.value !== DEFAULTS.bloomStrength ||
    bloomRadius.value !== DEFAULTS.bloomRadius ||
    bloomThreshold.value !== DEFAULTS.bloomThreshold ||
    brightness.value !== DEFAULTS.brightness ||
    color.value !== DEFAULTS.color ||
    fadeDelayMs.value !== DEFAULTS.fadeDelayMs ||
    fadeDurationMs.value !== DEFAULTS.fadeDurationMs
);

function reset() {
  trailLength.value = DEFAULTS.trailLength;
  inertia.value = DEFAULTS.inertia;
  grainIntensity.value = DEFAULTS.grainIntensity;
  bloomStrength.value = DEFAULTS.bloomStrength;
  bloomRadius.value = DEFAULTS.bloomRadius;
  bloomThreshold.value = DEFAULTS.bloomThreshold;
  brightness.value = DEFAULTS.brightness;
  color.value = DEFAULTS.color;
  fadeDelayMs.value = DEFAULTS.fadeDelayMs;
  fadeDurationMs.value = DEFAULTS.fadeDurationMs;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'className', type: 'string', default: "''", description: 'Additional CSS class names for the container.' },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Inline styles for the container element.'
  },
  {
    name: 'trailLength',
    type: 'number',
    default: '50',
    description: 'Number of points stored for the cursor trail (longer = longer smear).'
  },
  {
    name: 'inertia',
    type: 'number',
    default: '0.5',
    description: 'Velocity retention when the pointer stops. Higher values make the cursor glide longer.'
  },
  {
    name: 'grainIntensity',
    type: 'number',
    default: '0.05',
    description: 'Strength of the film grain post-processing pass.'
  },
  { name: 'bloomStrength', type: 'number', default: '0.1', description: 'UnrealBloom effect strength.' },
  {
    name: 'bloomRadius',
    type: 'number',
    default: '1.0',
    description: 'UnrealBloom radius controlling spread of glow.'
  },
  {
    name: 'bloomThreshold',
    type: 'number',
    default: '0.025',
    description: 'UnrealBloom threshold; lower includes more pixels in bloom.'
  },
  {
    name: 'brightness',
    type: 'number',
    default: '1',
    description: 'Final brightness multiplier applied to the effect color.'
  },
  { name: 'color', type: 'string', default: "'#A0FFBC'", description: 'Base color of the ghost cursor effect.' },
  {
    name: 'mixBlendMode',
    type: 'CSS mix-blend-mode',
    default: "'screen'",
    description: 'Blend mode used when compositing with page content.'
  },
  {
    name: 'edgeIntensity',
    type: 'number',
    default: '0',
    description: 'Darkening near edges of the canvas. 0 = none, 1 = strongest.'
  },
  {
    name: 'maxDevicePixelRatio',
    type: 'number',
    default: '0.5',
    description: 'Upper cap for devicePixelRatio to control render cost on high-DPR displays.'
  },
  {
    name: 'targetPixels',
    type: 'number',
    default: 'auto (~1.3e6 desktop, ~0.9e6 touch)',
    description: 'Pixel budget. Resolution is dynamically scaled to keep total pixel count under this budget.'
  },
  {
    name: 'fadeDelayMs',
    type: 'number',
    default: 'auto (1000 desktop, 500 touch)',
    description: 'Idle delay before the trail starts to fade after pointer leaves/stops.'
  },
  {
    name: 'fadeDurationMs',
    type: 'number',
    default: 'auto (1500 desktop, 1000 touch)',
    description: 'Duration of the trail fade-out once the delay has elapsed.'
  },
  {
    name: 'zIndex',
    type: 'number',
    default: '10',
    description: 'z-index applied to the canvas for layering above/below content.'
  }
];
</script>
