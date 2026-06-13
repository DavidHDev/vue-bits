<template>
  <h1 class="sub-category">Ribbons</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="ribbons.usage"
    :source="ribbonsSource"
    component-name="Ribbons"
    :props-table="props"
  >
    <template #preview>
      <div class="h-[500px] overflow-hidden demo-container">
        <div class="hover-text">Hover Me.</div>
        <Ribbons
          :base-thickness="baseThickness"
          :colors="colors"
          :speed-multiplier="speedMultiplier"
          :max-age="maxAge"
          :enable-fade="enableFade"
          :enable-shader-effect="enableShaderEffect"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSlider title="Ribbon Count" :min="1" :max="10" :step="1" v-model="ribbonCount" />
        <PreviewSlider title="Thickness" v-model="baseThickness" :min="1" :max="60" :step="1" />
        <PreviewSlider title="Speed" v-model="speedMultiplier" :min="0.3" :max="0.7" :step="0.01" />
        <PreviewSlider title="Max Age" v-model="maxAge" :min="300" :max="1000" :step="100" />
        <PreviewSwitch title="Enable Fade" v-model="enableFade" />
        <PreviewSwitch title="Enable Waves" v-model="enableShaderEffect" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="ribbons" :usage="ribbons.usage!" :source="ribbonsSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { ribbons } from '@/constants/code/Animations/ribbonsCode';
import Ribbons from '@/content/Animations/Ribbons/Ribbons.vue';
import ribbonsSource from '@/content/Animations/Ribbons/Ribbons.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  baseThickness: 30,
  colors: ['#27FF64'] as string[],
  speedMultiplier: 0.5,
  maxAge: 500,
  enableFade: false,
  enableShaderEffect: false
};

const baseThickness = ref(DEFAULTS.baseThickness);
const colors = ref([...DEFAULTS.colors]);
const speedMultiplier = ref(DEFAULTS.speedMultiplier);
const maxAge = ref(DEFAULTS.maxAge);
const enableFade = ref(DEFAULTS.enableFade);
const enableShaderEffect = ref(DEFAULTS.enableShaderEffect);

const updateColors = (val: number) => {
  if (val > colors.value.length) {
    const newColors = [...colors.value];
    while (newColors.length < val) {
      newColors.push(
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')}`
      );
    }
    colors.value = newColors;
  } else if (val < colors.value.length) {
    colors.value = colors.value.slice(0, val);
  }
};

const ribbonCount = computed({
  get: () => colors.value.length,
  set: updateColors
});

const hasChanges = computed(
  () =>
    baseThickness.value !== DEFAULTS.baseThickness ||
    JSON.stringify(colors.value) !== JSON.stringify(DEFAULTS.colors) ||
    speedMultiplier.value !== DEFAULTS.speedMultiplier ||
    maxAge.value !== DEFAULTS.maxAge ||
    enableFade.value !== DEFAULTS.enableFade ||
    enableShaderEffect.value !== DEFAULTS.enableShaderEffect
);

function reset() {
  baseThickness.value = DEFAULTS.baseThickness;
  colors.value = [...DEFAULTS.colors];
  speedMultiplier.value = DEFAULTS.speedMultiplier;
  maxAge.value = DEFAULTS.maxAge;
  enableFade.value = DEFAULTS.enableFade;
  enableShaderEffect.value = DEFAULTS.enableShaderEffect;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#27FF64']",
    description: 'An array of color strings to be used for the ribbons.'
  },
  {
    name: 'baseSpring',
    type: 'number',
    default: '0.03',
    description: 'Base spring factor for the physics controlling ribbon motion.'
  },
  {
    name: 'baseFriction',
    type: 'number',
    default: '0.9',
    description: 'Base friction factor that dampens the ribbon motion.'
  },
  {
    name: 'baseThickness',
    type: 'number',
    default: '30',
    description: 'The base thickness of the ribbons.'
  },
  {
    name: 'offsetFactor',
    type: 'number',
    default: '0.02',
    description: 'A factor to horizontally offset the starting positions of the ribbons.'
  },
  {
    name: 'maxAge',
    type: 'number',
    default: '500',
    description: 'Delay in milliseconds controlling how long the ribbon trails extend.'
  },
  {
    name: 'pointCount',
    type: 'number',
    default: '50',
    description: 'The number of points that make up each ribbon.'
  },
  {
    name: 'speedMultiplier',
    type: 'number',
    default: '0.5',
    description: 'Multiplier that adjusts how fast trailing points interpolate towards the head.'
  },
  {
    name: 'enableFade',
    type: 'boolean',
    default: 'true',
    description: 'If true, a fade effect is applied along the length of the ribbon.'
  },
  {
    name: 'enableShaderEffect',
    type: 'boolean',
    default: 'true',
    description: 'If true, an additional sine-wave shader effect is applied to the ribbons.'
  },
  {
    name: 'effectAmplitude',
    type: 'number',
    default: '2',
    description: 'The amplitude of the shader displacement effect.'
  },
  {
    name: 'backgroundColor',
    type: 'number[]',
    default: '[0, 0, 0, 0]',
    description: 'An RGBA array specifying the clear color for the renderer.'
  }
];
</script>

<style scoped>
.hover-text {
  position: absolute;
  font-size: clamp(2rem, 6vw, 6rem);
  font-weight: 900;
  color: #222;
  pointer-events: none;
}
</style>
