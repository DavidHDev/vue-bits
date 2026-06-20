<template>
  <h1 class="sub-category">Letter Glitch</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="letterGlitch.usage"
    :source="letterGlitchSource"
    component-name="LetterGlitch"
    :props-table="props"
  >
    <template #preview>
      <div class="relative h-[500px] overflow-hidden demo-container">
        <LetterGlitch
          :key="rerenderKey"
          :glitch-colors="colors"
          :glitch-speed="speed"
          :center-vignette="showCenterVignette"
          :outer-vignette="showOuterVignette"
          :smooth="smooth"
        />
        <BackgroundContent pillText="New Background" headline="Am I finally a real hacker now, mom?" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color 1" v-model="color1" />
        <PreviewColorPicker title="Color 2" v-model="color2" />
        <PreviewColorPicker title="Color 3" v-model="color3" />
        <PreviewSlider title="Glitch Speed" v-model="speed" :min="0" :max="100" :step="5" />
        <PreviewSwitch title="Smooth Animation" v-model="smooth" />
        <PreviewSwitch title="Show Center Vignette" v-model="showCenterVignette" />
        <PreviewSwitch title="Show Outer Vignette" v-model="showOuterVignette" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="letter-glitch" :usage="letterGlitch.usage!" :source="letterGlitchSource" />
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
import { letterGlitch } from '@/constants/code/Backgrounds/letterGlitchCode';
import LetterGlitch from '@/content/Backgrounds/LetterGlitch/LetterGlitch.vue';
import letterGlitchSource from '@/content/Backgrounds/LetterGlitch/LetterGlitch.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  smooth: true,
  speed: 10,
  color1: '#2b4539',
  color2: '#61dca3',
  color3: '#61b3dc',
  showCenterVignette: true,
  showOuterVignette: false
};

const smooth = ref(DEFAULTS.smooth);
const speed = ref(DEFAULTS.speed);
const color1 = ref(DEFAULTS.color1);
const color2 = ref(DEFAULTS.color2);
const color3 = ref(DEFAULTS.color3);
const showCenterVignette = ref(DEFAULTS.showCenterVignette);
const showOuterVignette = ref(DEFAULTS.showOuterVignette);

const colors = computed(() => [color1.value, color2.value, color3.value]);

const hasChanges = computed(
  () =>
    smooth.value !== DEFAULTS.smooth ||
    speed.value !== DEFAULTS.speed ||
    color1.value !== DEFAULTS.color1 ||
    color2.value !== DEFAULTS.color2 ||
    color3.value !== DEFAULTS.color3 ||
    showCenterVignette.value !== DEFAULTS.showCenterVignette ||
    showOuterVignette.value !== DEFAULTS.showOuterVignette
);

function reset() {
  smooth.value = DEFAULTS.smooth;
  speed.value = DEFAULTS.speed;
  color1.value = DEFAULTS.color1;
  color2.value = DEFAULTS.color2;
  color3.value = DEFAULTS.color3;
  showCenterVignette.value = DEFAULTS.showCenterVignette;
  showOuterVignette.value = DEFAULTS.showOuterVignette;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'glitchColors',
    type: 'string[]',
    default: "['#2b4539', '#61dca3', '#61b3dc']",
    description: 'Controls the colors of the letters rendered in the canvas.'
  },
  {
    name: 'glitchSpeed',
    type: 'number',
    default: '50',
    description: 'Controls the speed at which letters scramble in the animation.'
  },
  {
    name: 'centerVignette',
    type: 'boolean',
    default: 'false',
    description: 'When true, renders a radial gradient in the center of the container'
  },
  {
    name: 'outerVignette',
    type: 'boolean',
    default: 'true',
    description: 'When true, renders an inner radial gradient around the edges of the container.'
  },
  {
    name: 'smooth',
    type: 'boolean',
    default: 'true',
    description: 'When true, smoothens the animation of the letters for a more subtle feel.'
  }
];
</script>
