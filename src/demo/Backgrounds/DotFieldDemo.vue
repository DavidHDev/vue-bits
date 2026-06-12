<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[600px] overflow-hidden demo-container relative p-0">
        <DotField
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

        <BackgroundContent pill-text="New Background" headline="An interactive field of glowing dots" />
      </div>

      <Customize>
        <div class="flex gap-4">
          <PreviewColor title="Gradient From" v-model="gradientFrom" />
          <PreviewColor title="Gradient To" v-model="gradientTo" />
          <PreviewColor title="Glow Color" v-model="glowColor" />
        </div>

        <PreviewSlider title="Dot Radius" v-model="dotRadius" :min="0.5" :max="5" :step="0.5" />
        <PreviewSlider title="Dot Spacing" v-model="dotSpacing" :min="5" :max="30" :step="1" />
        <PreviewSlider title="Cursor Radius" v-model="cursorRadius" :min="100" :max="1000" :step="50" />
        <PreviewSlider title="Cursor Force" v-model="cursorForce" :min="0" :max="1" :step="0.01" />

        <PreviewSwitch title="Bulge Only" v-model="bulgeOnly" />

        <PreviewSlider title="Bulge Strength" v-model="bulgeStrength" :min="0" :max="150" :step="1" />
        <PreviewSlider title="Glow Radius" v-model="glowRadius" :min="50" :max="400" :step="10" />
        <PreviewSlider title="Wave Amplitude" v-model="waveAmplitude" :min="0" :max="20" :step="1" />

        <PreviewSwitch title="Sparkle" v-model="sparkle" />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="dotField" />
    </template>

    <template #cli>
      <CliInstallation :command="dotField.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import PropTable from '@/components/common/PropTable.vue';
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewColor from '@/components/common/PreviewColor.vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import DotField from '../../content/Backgrounds/DotField/DotField.vue';
import { dotField } from '@/constants/code/Backgrounds/dotFieldCode';

const dotRadius = ref(1.5);
const dotSpacing = ref(14);
const cursorRadius = ref(500);
const cursorForce = ref(0.1);
const bulgeOnly = ref(true);
const bulgeStrength = ref(67);
const glowRadius = ref(160);
const sparkle = ref(false);
const waveAmplitude = ref(0);
const gradientFrom = ref('#27FF64');
const gradientTo = ref('#A8FFB6');
const glowColor = ref('#0A4A2A');

const propData = [
  {
    name: 'dotRadius',
    type: 'number',
    default: '1.5',
    description: 'Radius of each individual dot in the grid.'
  },
  {
    name: 'dotSpacing',
    type: 'number',
    default: '14',
    description: 'Spacing between dots in the grid.'
  },
  {
    name: 'cursorRadius',
    type: 'number',
    default: '500',
    description: 'Radius of the cursor interaction area.'
  },
  {
    name: 'cursorForce',
    type: 'number',
    default: '0.1',
    description: 'Force applied to dots when not in bulge mode.'
  },
  {
    name: 'bulgeOnly',
    type: 'boolean',
    default: 'true',
    description: 'When true, dots bulge away from cursor. When false, dots are pushed with physics.'
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
    description: 'When enabled, ~3% of dots randomly sparkle at a larger size.'
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
    default: "'rgba(168, 85, 247, 0.35)'",
    description: 'Start color of the diagonal gradient applied to dots.'
  },
  {
    name: 'gradientTo',
    type: 'string',
    default: "'rgba(180, 151, 207, 0.25)'",
    description: 'End color of the diagonal gradient applied to dots.'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: "'#120F17'",
    description: 'Color of the radial glow effect that follows the cursor.'
  }
];
</script>
