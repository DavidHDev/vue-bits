<template>
  <h1 class="sub-category">Pixel Blast</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="pixelBlast.usage"
    :source="pixelBlastSource"
    component-name="PixelBlast"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <PixelBlast
          :key="rerenderKey"
          :variant="variant"
          :pixel-size="pixelSize"
          :color="color"
          :pattern-scale="patternScale"
          :pattern-density="patternDensity"
          :pixel-size-jitter="pixelSizeJitter"
          :enable-ripples="enableRipples"
          :liquid="liquid"
          :speed="speed"
          :edge-fade="edgeFade"
        />
        <BackgroundContent pill-text="New Background" headline="It's dangerous to go alone! Take this." />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Color" v-model="color" />
        <PreviewSelect title="Variant" v-model="variant" :options="['square', 'circle', 'triangle', 'diamond']" />
        <PreviewSlider title="Pixel Size" v-model="pixelSize" :min="1" :max="5" :step="1" />
        <PreviewSlider title="Pattern Scale" v-model="patternScale" :min="0.25" :max="8" :step="0.25" />
        <PreviewSlider title="Pattern Density" v-model="patternDensity" :min="0" :max="2" :step="0.05" />
        <PreviewSlider title="Pixel Jitter" v-model="pixelSizeJitter" :min="0" :max="2" :step="0.05" />
        <PreviewSlider title="Speed" v-model="speed" :min="0" :max="3" :step="0.05" />
        <PreviewSlider title="Edge Fade" v-model="edgeFade" :min="0" :max="0.5" :step="0.01" />
        <PreviewSwitch title="Ripples" v-model="enableRipples" />
        <PreviewSwitch title="Liquid" v-model="liquid" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="pixelblast" :usage="pixelBlast.usage!" :source="pixelBlastSource" />
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
import { pixelBlast } from '@/constants/code/Backgrounds/pixelBlastCode';
import PixelBlast, { type PixelBlastVariant } from '@/content/Backgrounds/PixelBlast/PixelBlast.vue';
import pixelBlastSource from '@/content/Backgrounds/PixelBlast/PixelBlast.vue?raw';
import { computed, ref } from 'vue';

const { rerenderKey, forceRerender } = useForceRerender();

const DEFAULTS = {
  variant: 'square' as PixelBlastVariant,
  pixelSize: 4,
  patternScale: 2,
  patternDensity: 1,
  pixelSizeJitter: 0,
  enableRipples: true,
  liquid: false,
  speed: 0.5,
  edgeFade: 0.25,
  color: '#A7EF9E'
};

const variant = ref<PixelBlastVariant>(DEFAULTS.variant);
const pixelSize = ref(DEFAULTS.pixelSize);
const patternScale = ref(DEFAULTS.patternScale);
const patternDensity = ref(DEFAULTS.patternDensity);
const pixelSizeJitter = ref(DEFAULTS.pixelSizeJitter);
const enableRipples = ref(DEFAULTS.enableRipples);
const liquid = ref(DEFAULTS.liquid);
const speed = ref(DEFAULTS.speed);
const edgeFade = ref(DEFAULTS.edgeFade);
const color = ref(DEFAULTS.color);

const hasChanges = computed(
  () =>
    variant.value !== DEFAULTS.variant ||
    pixelSize.value !== DEFAULTS.pixelSize ||
    patternScale.value !== DEFAULTS.patternScale ||
    patternDensity.value !== DEFAULTS.patternDensity ||
    pixelSizeJitter.value !== DEFAULTS.pixelSizeJitter ||
    enableRipples.value !== DEFAULTS.enableRipples ||
    liquid.value !== DEFAULTS.liquid ||
    speed.value !== DEFAULTS.speed ||
    edgeFade.value !== DEFAULTS.edgeFade ||
    color.value !== DEFAULTS.color
);

function reset() {
  variant.value = DEFAULTS.variant;
  pixelSize.value = DEFAULTS.pixelSize;
  patternScale.value = DEFAULTS.patternScale;
  patternDensity.value = DEFAULTS.patternDensity;
  pixelSizeJitter.value = DEFAULTS.pixelSizeJitter;
  enableRipples.value = DEFAULTS.enableRipples;
  liquid.value = DEFAULTS.liquid;
  speed.value = DEFAULTS.speed;
  edgeFade.value = DEFAULTS.edgeFade;
  color.value = DEFAULTS.color;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'variant',
    type: "'square'|'circle'|'triangle'|'diamond'",
    default: "'square'",
    description: 'Pixel shape variant.'
  },
  {
    name: 'pixelSize',
    type: 'number',
    default: '4',
    description: 'Base pixel size (auto scaled for DPI).'
  },
  {
    name: 'color',
    type: 'string',
    default: "'#A7EF9E'",
    description: 'Pixel color.'
  },
  {
    name: 'patternScale',
    type: 'number',
    default: '2',
    description: 'Noise/pattern scale.'
  },
  {
    name: 'patternDensity',
    type: 'number',
    default: '1',
    description: 'Pattern density adjustment.'
  },
  {
    name: 'pixelSizeJitter',
    type: 'number',
    default: '0',
    description: 'Random jitter applied to coverage.'
  },
  {
    name: 'enableRipples',
    type: 'boolean',
    default: 'true',
    description: 'Enable click ripple waves.'
  },
  {
    name: 'rippleSpeed',
    type: 'number',
    default: '0.3',
    description: 'Ripple propagation speed.'
  },
  {
    name: 'rippleThickness',
    type: 'number',
    default: '0.1',
    description: 'Ripple ring thickness.'
  },
  {
    name: 'rippleIntensityScale',
    type: 'number',
    default: '1',
    description: 'Ripple intensity multiplier.'
  },
  {
    name: 'liquid',
    type: 'boolean',
    default: 'false',
    description: 'Enable liquid distortion effect.'
  },
  {
    name: 'liquidStrength',
    type: 'number',
    default: '0.1',
    description: 'Liquid distortion strength.'
  },
  {
    name: 'liquidRadius',
    type: 'number',
    default: '1',
    description: 'Liquid touch brush radius scale.'
  },
  {
    name: 'liquidWobbleSpeed',
    type: 'number',
    default: '4.5',
    description: 'Liquid wobble frequency.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'Animation time scale.'
  },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0.25',
    description: 'Edge fade distance (0-1).'
  },
  {
    name: 'noiseAmount',
    type: 'number',
    default: '0',
    description: 'Post noise amount.'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Transparent background.'
  }
];
</script>
