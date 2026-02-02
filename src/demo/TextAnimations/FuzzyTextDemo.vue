<template>
  <TabbedLayout>
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <div class="flex flex-col justify-center items-center h-full">
          <FuzzyText
            :base-intensity="baseIntensity"
            :hover-intensity="hoverIntensity"
            :enable-hover="enableHover"
            :fuzz-range="fuzzRange"
            :fps="fps"
            :direction="direction"
            :transition-duration="transitionDuration"
            :click-effect="clickEffect"
            :glitch-mode="glitchMode"
            :glitch-interval="glitchInterval"
            :glitch-duration="glitchDuration"
            :letter-spacing="letterSpacing"
            :font-size="140"
          >
            404
          </FuzzyText>
          <div class="my-1" />
          <FuzzyText
            :base-intensity="baseIntensity"
            :hover-intensity="hoverIntensity"
            :enable-hover="enableHover"
            :fuzz-range="fuzzRange"
            :fps="fps"
            :direction="direction"
            :transition-duration="transitionDuration"
            :click-effect="clickEffect"
            :glitch-mode="glitchMode"
            :glitch-interval="glitchInterval"
            :glitch-duration="glitchDuration"
            :letter-spacing="letterSpacing"
            :font-size="70"
            font-family="Gochi Hand"
          >
            not found
          </FuzzyText>
        </div>
      </div>

      <Customize>
        <PreviewSlider title="Base Intensity" v-model="baseIntensity" :min="0" :max="1" :step="0.01" />
        <PreviewSlider title="Hover Intensity" v-model="hoverIntensity" :min="0" :max="2" :step="0.01" />
        <PreviewSlider title="Fuzz Range" v-model="fuzzRange" :min="5" :max="100" :step="1" />
        <PreviewSlider title="FPS" v-model="fps" :min="10" :max="120" :step="5" />
        <PreviewSlider title="Transition Duration" v-model="transitionDuration" :min="0" :max="60" :step="1" />
        <PreviewSlider title="Letter Spacing" v-model="letterSpacing" :min="-10" :max="50" :step="1" />
        <PreviewSelect title="Direction" v-model="direction" :options="directionOptions" />
        <PreviewSwitch title="Enable Hover" v-model="enableHover" />
        <PreviewSwitch title="Click Effect" v-model="clickEffect" />
        <PreviewSwitch title="Glitch Mode" v-model="glitchMode" />
        <PreviewSlider
          title="Glitch Interval"
          v-model="glitchInterval"
          :min="500"
          :max="5000"
          :step="100"
          :disabled="!glitchMode"
        />
        <PreviewSlider
          title="Glitch Duration"
          v-model="glitchDuration"
          :min="50"
          :max="1000"
          :step="50"
          :disabled="!glitchMode"
        />
      </Customize>

      <PropTable :data="propData" />
    </template>

    <template #code>
      <CodeExample :code-object="fuzzyText" />
    </template>

    <template #cli>
      <CliInstallation :command="fuzzyText.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import CliInstallation from '@/components/code/CliInstallation.vue';
import CodeExample from '@/components/code/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable from '@/components/common/PropTable.vue';
import TabbedLayout from '@/components/common/TabbedLayout.vue';
import { fuzzyText } from '@/constants/code/TextAnimations/fuzzyTextCode';
import FuzzyText from '@/content/TextAnimations/FuzzyText/FuzzyText.vue';
import { ref } from 'vue';

const baseIntensity = ref(0.2);
const hoverIntensity = ref(0.5);
const enableHover = ref(true);
const fuzzRange = ref(30);
const fps = ref(60);
const direction = ref<'horizontal' | 'vertical' | 'both'>('horizontal');
const transitionDuration = ref(0);
const clickEffect = ref(false);
const glitchMode = ref(false);
const glitchInterval = ref(2000);
const glitchDuration = ref(200);
const letterSpacing = ref(0);

const directionOptions = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'both', label: 'Both' }
];

const propData = [
  {
    name: 'slot',
    type: 'string',
    default: '',
    description: 'The text content to display inside the fuzzy text component.'
  },
  {
    name: 'fontSize',
    type: 'number | string',
    default: `"clamp(2rem, 8vw, 8rem)"`,
    description:
      'Specifies the font size of the text. Accepts any valid CSS font-size value or a number (interpreted as pixels).'
  },
  {
    name: 'fontWeight',
    type: 'string | number',
    default: '900',
    description: 'Specifies the font weight of the text.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: `"inherit"`,
    description: "Specifies the font family of the text. 'inherit' uses the computed style from the parent."
  },
  {
    name: 'color',
    type: 'string',
    default: '#fff',
    description: 'Specifies the text color.'
  },
  {
    name: 'enableHover',
    type: 'boolean',
    default: 'true',
    description: 'Enables the hover effect for the fuzzy text.'
  },
  {
    name: 'baseIntensity',
    type: 'number',
    default: '0.18',
    description: 'The fuzz intensity when the text is not hovered.'
  },
  {
    name: 'hoverIntensity',
    type: 'number',
    default: '0.5',
    description: 'The fuzz intensity when the text is hovered.'
  },
  {
    name: 'fuzzRange',
    type: 'number',
    default: '30',
    description: 'Maximum pixel displacement for the fuzzy effect.'
  },
  {
    name: 'fps',
    type: 'number',
    default: '60',
    description: 'Frame rate cap for the animation. Lower values reduce CPU usage.'
  },
  {
    name: 'direction',
    type: `'horizontal' | 'vertical' | 'both'`,
    default: `'horizontal'`,
    description: 'The axis/axes for the fuzzy displacement effect.'
  },
  {
    name: 'transitionDuration',
    type: 'number',
    default: '0',
    description: 'Number of frames to ease between intensity states for smooth transitions.'
  },
  {
    name: 'clickEffect',
    type: 'boolean',
    default: 'false',
    description: 'Enables a momentary burst of maximum intensity on click.'
  },
  {
    name: 'glitchMode',
    type: 'boolean',
    default: 'false',
    description: 'Enables periodic random intensity spikes for a glitch effect.'
  },
  {
    name: 'glitchInterval',
    type: 'number',
    default: '2000',
    description: 'Milliseconds between glitch bursts when glitchMode is enabled.'
  },
  {
    name: 'glitchDuration',
    type: 'number',
    default: '200',
    description: 'Milliseconds duration of each glitch burst.'
  },
  {
    name: 'gradient',
    type: 'string[] | null',
    default: 'null',
    description: 'Array of colors to create a gradient text effect (e.g. ["#ff0000", "#00ff00"]).'
  },
  {
    name: 'letterSpacing',
    type: 'number',
    default: '0',
    description: 'Extra pixels between characters.'
  },
  {
    name: 'className',
    type: 'string',
    default: `''`,
    description: 'CSS class for the canvas element.'
  }
];
</script>
