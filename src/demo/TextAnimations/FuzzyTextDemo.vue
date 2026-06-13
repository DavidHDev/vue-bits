<template>
  <h1 class="sub-category">Fuzzy Text</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="fuzzyText.usage"
    :source="fuzzyTextSource"
    component-name="FuzzyText"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[400px] overflow-hidden demo-container">
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
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Base Intensity" v-model="baseIntensity" :min="0" :max="1" :step="0.01" />
        <PreviewSlider title="Hover Intensity" v-model="hoverIntensity" :min="0" :max="2" :step="0.01" />
        <PreviewSlider title="Fuzz Range" v-model="fuzzRange" :min="5" :max="100" :step="1" />
        <PreviewSlider title="FPS" v-model="fps" :min="10" :max="120" :step="5" />
        <PreviewSlider title="Transition Duration" v-model="transitionDuration" :min="0" :max="60" :step="1" />
        <PreviewSlider title="Letter Spacing" v-model="letterSpacing" :min="-10" :max="50" :step="1" />
        <PreviewSelect title="Direction" v-model="direction" :options="['horizontal', 'vertical', 'both']" />
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
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="fuzzy-text" :usage="fuzzyText.usage!" :source="fuzzyTextSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { fuzzyText } from '@/constants/code/TextAnimations/fuzzyTextCode';
import FuzzyText from '@/content/TextAnimations/FuzzyText/FuzzyText.vue';
import fuzzyTextSource from '@/content/TextAnimations/FuzzyText/FuzzyText.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  baseIntensity: 0.2,
  hoverIntensity: 0.5,
  enableHover: true,
  fuzzRange: 30,
  fps: 60,
  direction: 'horizontal' as 'horizontal' | 'vertical' | 'both',
  transitionDuration: 0,
  clickEffect: false,
  glitchMode: false,
  glitchInterval: 2000,
  glitchDuration: 200,
  letterSpacing: 0
};

const baseIntensity = ref(DEFAULTS.baseIntensity);
const hoverIntensity = ref(DEFAULTS.hoverIntensity);
const enableHover = ref(DEFAULTS.enableHover);
const fuzzRange = ref(DEFAULTS.fuzzRange);
const fps = ref(DEFAULTS.fps);
const direction = ref<'horizontal' | 'vertical' | 'both'>(DEFAULTS.direction);
const transitionDuration = ref(DEFAULTS.transitionDuration);
const clickEffect = ref(DEFAULTS.clickEffect);
const glitchMode = ref(DEFAULTS.glitchMode);
const glitchInterval = ref(DEFAULTS.glitchInterval);
const glitchDuration = ref(DEFAULTS.glitchDuration);
const letterSpacing = ref(DEFAULTS.letterSpacing);

const hasChanges = computed(
  () =>
    baseIntensity.value !== DEFAULTS.baseIntensity ||
    hoverIntensity.value !== DEFAULTS.hoverIntensity ||
    enableHover.value !== DEFAULTS.enableHover ||
    fuzzRange.value !== DEFAULTS.fuzzRange ||
    fps.value !== DEFAULTS.fps ||
    direction.value !== DEFAULTS.direction ||
    transitionDuration.value !== DEFAULTS.transitionDuration ||
    clickEffect.value !== DEFAULTS.clickEffect ||
    glitchMode.value !== DEFAULTS.glitchMode ||
    glitchInterval.value !== DEFAULTS.glitchInterval ||
    glitchDuration.value !== DEFAULTS.glitchDuration ||
    letterSpacing.value !== DEFAULTS.letterSpacing
);

function reset() {
  baseIntensity.value = DEFAULTS.baseIntensity;
  hoverIntensity.value = DEFAULTS.hoverIntensity;
  enableHover.value = DEFAULTS.enableHover;
  fuzzRange.value = DEFAULTS.fuzzRange;
  fps.value = DEFAULTS.fps;
  direction.value = DEFAULTS.direction;
  transitionDuration.value = DEFAULTS.transitionDuration;
  clickEffect.value = DEFAULTS.clickEffect;
  glitchMode.value = DEFAULTS.glitchMode;
  glitchInterval.value = DEFAULTS.glitchInterval;
  glitchDuration.value = DEFAULTS.glitchDuration;
  letterSpacing.value = DEFAULTS.letterSpacing;
  forceRerender();
}

const props: PropRow[] = [
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
