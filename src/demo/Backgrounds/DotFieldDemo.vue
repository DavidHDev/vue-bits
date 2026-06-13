<template>
  <h1 class="sub-category">Dot Field</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="dotField.usage"
    :source="dotFieldSource"
    componentName="DotField"
    :props-table="props"
  >
    <template #preview>
      <div class="relative bg-[#14110e] rounded-2xl w-full h-[500px] overflow-hidden demo-container">
        <DotField
          :key="key"
          :dot-radius="dotRadius"
          :dot-spacing="dotSpacing"
          :cursor-radius="cursorRadius"
          :cursor-force="cursorForce"
          :bulge-only="bulgeOnly"
          :bulge-strength="bulgeStrength"
          :glow-radius="glowRadius"
          :sparkle="sparkle"
          :wave-amplitude="waveAmplitude"
          :gradient-from="gradientFrom"
          :gradient-to="gradientTo"
          :glow-color="glowColor"
        />
        <BackgroundContent pillText="New Background" headline="Organized chaos with every cursor movement!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Dot Radius" :min="0.5" :max="5" :step="0.5" v-model="dotRadius" />
        <PreviewSlider title="Dot Spacing" :min="5" :max="30" :step="1" v-model="dotSpacing" />
        <PreviewSlider title="Cursor Radius" :min="100" :max="1000" :step="50" v-model="cursorRadius" />
        <PreviewSlider title="Cursor Force" :min="0" :max="1" :step="0.01" v-model="cursorForce" />
        <PreviewSwitch title="Bulge Only" v-model="bulgeOnly" />
        <PreviewSlider title="Bulge Strength" :min="0" :max="150" :step="1" v-model="bulgeStrength" />
        <PreviewSlider title="Glow Radius" :min="50" :max="400" :step="10" v-model="glowRadius" />
        <PreviewSlider title="Wave Amplitude" :min="0" :max="20" :step="1" v-model="waveAmplitude" />
        <PreviewSwitch title="Sparkle" v-model="sparkle" />
        <PreviewColorPicker title="Gradient From" v-model="gradientFrom" />
        <PreviewColorPicker title="Gradient To" v-model="gradientTo" />
        <PreviewColorPicker title="Glow Color" v-model="glowColor" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="dot-field" :usage="dotField.usage!" :source="dotFieldSource" />
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
import { dotField } from '@/constants/code/Backgrounds/dotFieldCode';
import DotField from '@/content/Backgrounds/DotField/DotField.vue';
import dotFieldSource from '@/content/Backgrounds/DotField/DotField.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey: key, forceRerender } = useForceRerender();

const DEFAULTS = {
  dotRadius: 1.5,
  dotSpacing: 14,
  cursorRadius: 500,
  cursorForce: 0.1,
  bulgeOnly: true,
  bulgeStrength: 67,
  glowRadius: 160,
  sparkle: false,
  waveAmplitude: 0,
  gradientFrom: '#7cff67',
  gradientTo: '#A0FFBC',
  glowColor: '#120F17'
};

const dotRadius = ref(DEFAULTS.dotRadius);
const dotSpacing = ref(DEFAULTS.dotSpacing);
const cursorRadius = ref(DEFAULTS.cursorRadius);
const cursorForce = ref(DEFAULTS.cursorForce);
const bulgeOnly = ref(DEFAULTS.bulgeOnly);
const bulgeStrength = ref(DEFAULTS.bulgeStrength);
const glowRadius = ref(DEFAULTS.glowRadius);
const sparkle = ref(DEFAULTS.sparkle);
const waveAmplitude = ref(DEFAULTS.waveAmplitude);
const gradientFrom = ref(DEFAULTS.gradientFrom);
const gradientTo = ref(DEFAULTS.gradientTo);
const glowColor = ref(DEFAULTS.glowColor);
const showContent = ref(true);

const hasChanges = computed(
  () =>
    dotRadius.value !== DEFAULTS.dotRadius ||
    dotSpacing.value !== DEFAULTS.dotSpacing ||
    cursorRadius.value !== DEFAULTS.cursorRadius ||
    cursorForce.value !== DEFAULTS.cursorForce ||
    bulgeOnly.value !== DEFAULTS.bulgeOnly ||
    bulgeStrength.value !== DEFAULTS.bulgeStrength ||
    glowRadius.value !== DEFAULTS.glowRadius ||
    sparkle.value !== DEFAULTS.sparkle ||
    waveAmplitude.value !== DEFAULTS.waveAmplitude ||
    gradientFrom.value !== DEFAULTS.gradientFrom ||
    gradientTo.value !== DEFAULTS.gradientTo ||
    glowColor.value !== DEFAULTS.glowColor
);

function reset() {
  dotRadius.value = DEFAULTS.dotRadius;
  dotSpacing.value = DEFAULTS.dotSpacing;
  cursorRadius.value = DEFAULTS.cursorRadius;
  cursorForce.value = DEFAULTS.cursorForce;
  bulgeOnly.value = DEFAULTS.bulgeOnly;
  bulgeStrength.value = DEFAULTS.bulgeStrength;
  glowRadius.value = DEFAULTS.glowRadius;
  sparkle.value = DEFAULTS.sparkle;
  waveAmplitude.value = DEFAULTS.waveAmplitude;
  gradientFrom.value = DEFAULTS.gradientFrom;
  gradientTo.value = DEFAULTS.gradientTo;
  glowColor.value = DEFAULTS.glowColor;
  showContent.value = true;
  forceRerender();
}

const props: PropRow[] = [
  { name: 'dotRadius', type: 'number', default: '1.5', description: 'Radius of each individual dot in the grid.' },
  { name: 'dotSpacing', type: 'number', default: '14', description: 'Spacing between dots in the grid.' },
  { name: 'cursorRadius', type: 'number', default: '500', description: 'Radius of the cursor interaction area.' },
  { name: 'cursorForce', type: 'number', default: '0.1', description: 'Force applied to dots when not in bulge mode.' },
  {
    name: 'bulgeOnly',
    type: 'boolean',
    default: 'true',
    description: 'When true, dots bulge around the cursor. When false, dots are pushed with physics.'
  },
  {
    name: 'bulgeStrength',
    type: 'number',
    default: '67',
    description: 'Strength of the bulge effect around the cursor.'
  },
  {
    name: 'glowRadius',
    type: 'number',
    default: '160',
    description: 'Radius of the SVG glow effect that follows the cursor.'
  },
  {
    name: 'sparkle',
    type: 'boolean',
    default: 'false',
    description: 'When enabled, a small fraction of dots sparkle at a larger size.'
  },
  {
    name: 'waveAmplitude',
    type: 'number',
    default: '0',
    description: 'Amplitude of the wave displacement animation applied to dots.'
  },
  {
    name: 'gradientFrom',
    type: 'string',
    default: '"#7cff67"',
    description: 'Start color of the diagonal gradient applied to dots.'
  },
  {
    name: 'gradientTo',
    type: 'string',
    default: '"#A0FFBC"',
    description: 'End color of the diagonal gradient applied to dots.'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: '"#120F17"',
    description: 'Color of the radial glow effect that follows the cursor.'
  },
  { name: 'class', type: 'string', default: '""', description: 'Extra classes for the root wrapper.' }
];
</script>
