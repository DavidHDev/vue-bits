<template>
  <h1 class="sub-category">Dot Grid</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="dotGrid.usage"
    :source="dotGridSource"
    component-name="DotGrid"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <DotGrid
          :key="rerenderKey"
          :dot-size="dotSize"
          :gap="gap"
          :base-color="baseColor"
          :active-color="activeColor"
          :proximity="proximity"
          :shock-radius="shockRadius"
          :shock-strength="shockStrength"
          :resistance="resistance"
          :return-duration="returnDuration"
        />
        <BackgroundContent pillText="New Background" headline="Organized chaos with every cursor movement!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Base Color" v-model="baseColor" />
        <PreviewColorPicker title="Active Color" v-model="activeColor" />
        <PreviewSlider title="Dot Size" v-model="dotSize" :min="2" :max="50" :step="1" />
        <PreviewSlider title="Gap" v-model="gap" :min="5" :max="100" :step="1" />
        <PreviewSlider title="Proximity" v-model="proximity" :min="50" :max="500" :step="10" />
        <PreviewSlider title="Shock Radius" v-model="shockRadius" :min="50" :max="500" :step="10" />
        <PreviewSlider title="Shock Strength" v-model="shockStrength" :min="1" :max="20" :step="1" />
        <PreviewSlider title="Resistance (Inertia)" v-model="resistance" :min="100" :max="2000" :step="50" />
        <PreviewSlider title="Return Duration (Inertia)" v-model="returnDuration" :min="0.1" :max="5" :step="0.1" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="dot-grid" :usage="dotGrid.usage!" :source="dotGridSource" />
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
import { dotGrid } from '@/constants/code/Backgrounds/dotGridCode';
import DotGrid from '@/content/Backgrounds/DotGrid/DotGrid.vue';
import dotGridSource from '@/content/Backgrounds/DotGrid/DotGrid.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  dotSize: 5,
  gap: 15,
  baseColor: '#333333',
  activeColor: '#27FF64',
  proximity: 120,
  shockRadius: 250,
  shockStrength: 5,
  resistance: 750,
  returnDuration: 1.5
};

const dotSize = ref(DEFAULTS.dotSize);
const gap = ref(DEFAULTS.gap);
const baseColor = ref(DEFAULTS.baseColor);
const activeColor = ref(DEFAULTS.activeColor);
const proximity = ref(DEFAULTS.proximity);
const shockRadius = ref(DEFAULTS.shockRadius);
const shockStrength = ref(DEFAULTS.shockStrength);
const resistance = ref(DEFAULTS.resistance);
const returnDuration = ref(DEFAULTS.returnDuration);

const hasChanges = computed(
  () =>
    dotSize.value !== DEFAULTS.dotSize ||
    gap.value !== DEFAULTS.gap ||
    baseColor.value !== DEFAULTS.baseColor ||
    activeColor.value !== DEFAULTS.activeColor ||
    proximity.value !== DEFAULTS.proximity ||
    shockRadius.value !== DEFAULTS.shockRadius ||
    shockStrength.value !== DEFAULTS.shockStrength ||
    resistance.value !== DEFAULTS.resistance ||
    returnDuration.value !== DEFAULTS.returnDuration
);

function reset() {
  dotSize.value = DEFAULTS.dotSize;
  gap.value = DEFAULTS.gap;
  baseColor.value = DEFAULTS.baseColor;
  activeColor.value = DEFAULTS.activeColor;
  proximity.value = DEFAULTS.proximity;
  shockRadius.value = DEFAULTS.shockRadius;
  shockStrength.value = DEFAULTS.shockStrength;
  resistance.value = DEFAULTS.resistance;
  returnDuration.value = DEFAULTS.returnDuration;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'dotSize', type: 'number', default: '16', description: 'Size of each dot in pixels.' },
  { name: 'gap', type: 'number', default: '32', description: 'Gap between each dot in pixels.' },
  { name: 'baseColor', type: 'string', default: "'#27FF64'", description: 'Base color of the dots.' },
  {
    name: 'activeColor',
    type: 'string',
    default: "'#27FF64'",
    description: 'Color of dots when hovered or activated.'
  },
  {
    name: 'proximity',
    type: 'number',
    default: '150',
    description: 'Radius around the mouse pointer within which dots react.'
  },
  {
    name: 'speedTrigger',
    type: 'number',
    default: '100',
    description: 'Mouse speed threshold to trigger inertia effect.'
  },
  { name: 'shockRadius', type: 'number', default: '250', description: 'Radius of the shockwave effect on click.' },
  { name: 'shockStrength', type: 'number', default: '5', description: 'Strength of the shockwave effect on click.' },
  { name: 'maxSpeed', type: 'number', default: '5000', description: 'Maximum speed for inertia calculation.' },
  { name: 'resistance', type: 'number', default: '750', description: 'Resistance for the inertia effect.' },
  {
    name: 'returnDuration',
    type: 'number',
    default: '1.5',
    description: 'Duration for dots to return to their original position after inertia.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes for the component.' },
  { name: 'style', type: 'CSSProperties', default: '{}', description: 'Inline styles for the component.' }
];
</script>
