<template>
  <h1 class="sub-category">Ripple Grid</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="rippleGrid.usage"
    :source="rippleGridSource"
    component-name="RippleGrid"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <RippleGrid
          :enable-rainbow="enableRainbow"
          :grid-color="gridColor"
          :ripple-intensity="rippleIntensity"
          :grid-size="gridSize"
          :grid-thickness="gridThickness"
          :fade-distance="fadeDistance"
          :vignette-strength="vignetteStrength"
          :glow-intensity="glowIntensity"
          :opacity="opacity"
          :grid-rotation="gridRotation"
          :mouse-interaction="mouseInteraction"
          :mouse-interaction-radius="mouseInteractionRadius"
        />
        <BackgroundContent pillText="New Background" headline="Retro yet futuristic, this is Ripple Grid!" />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewColorPicker title="Grid Color" v-model="gridColor" />
        <PreviewSlider title="Ripple Intensity" :min="0" :max="0.3" :step="0.01" v-model="rippleIntensity" />
        <PreviewSlider title="Grid Size" :min="5" :max="30" :step="1" v-model="gridSize" />
        <PreviewSlider title="Grid Thickness" :min="5" :max="30" :step="1" v-model="gridThickness" />
        <PreviewSlider title="Fade Distance" :min="0.5" :max="3" :step="0.1" v-model="fadeDistance" />
        <PreviewSlider title="Vignette Strength" :min="0.5" :max="5" :step="0.1" v-model="vignetteStrength" />
        <PreviewSlider title="Glow Intensity" :min="0" :max="1" :step="0.05" v-model="glowIntensity" />
        <PreviewSlider title="Opacity" :min="0" :max="1" :step="0.05" v-model="opacity" />
        <PreviewSlider title="Grid Rotation" :min="0" :max="360" :step="1" v-model="gridRotation" value-unit="°" />
        <PreviewSlider
          title="Mouse Interaction Radius"
          :min="0.2"
          :max="2"
          :step="0.1"
          v-model="mouseInteractionRadius"
        />
        <PreviewSwitch title="Mouse Interaction" v-model="mouseInteraction" />
        <PreviewSwitch title="Enable Rainbow" v-model="enableRainbow" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="ripple-grid" :usage="rippleGrid.usage!" :source="rippleGridSource" />
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
import { rippleGrid } from '@/constants/code/Backgrounds/rippleGridCode';
import RippleGrid from '@/content/Backgrounds/RippleGrid/RippleGrid.vue';
import rippleGridSource from '@/content/Backgrounds/RippleGrid/RippleGrid.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  enableRainbow: false,
  gridColor: '#27FF64',
  rippleIntensity: 0.05,
  gridSize: 10.0,
  gridThickness: 15.0,
  fadeDistance: 1.5,
  vignetteStrength: 2.0,
  glowIntensity: 0.1,
  opacity: 1.0,
  gridRotation: 0,
  mouseInteraction: true,
  mouseInteractionRadius: 0.8
};

const enableRainbow = ref(DEFAULTS.enableRainbow);
const gridColor = ref(DEFAULTS.gridColor);
const rippleIntensity = ref(DEFAULTS.rippleIntensity);
const gridSize = ref(DEFAULTS.gridSize);
const gridThickness = ref(DEFAULTS.gridThickness);
const fadeDistance = ref(DEFAULTS.fadeDistance);
const vignetteStrength = ref(DEFAULTS.vignetteStrength);
const glowIntensity = ref(DEFAULTS.glowIntensity);
const opacity = ref(DEFAULTS.opacity);
const gridRotation = ref(DEFAULTS.gridRotation);
const mouseInteraction = ref(DEFAULTS.mouseInteraction);
const mouseInteractionRadius = ref(DEFAULTS.mouseInteractionRadius);

const hasChanges = computed(
  () =>
    gridColor.value !== DEFAULTS.gridColor ||
    rippleIntensity.value !== DEFAULTS.rippleIntensity ||
    gridSize.value !== DEFAULTS.gridSize ||
    gridThickness.value !== DEFAULTS.gridThickness ||
    fadeDistance.value !== DEFAULTS.fadeDistance ||
    vignetteStrength.value !== DEFAULTS.vignetteStrength ||
    glowIntensity.value !== DEFAULTS.glowIntensity ||
    opacity.value !== DEFAULTS.opacity ||
    gridRotation.value !== DEFAULTS.gridRotation ||
    mouseInteraction.value !== DEFAULTS.mouseInteraction ||
    mouseInteractionRadius.value !== DEFAULTS.mouseInteractionRadius
);

function reset() {
  gridColor.value = DEFAULTS.gridColor;
  rippleIntensity.value = DEFAULTS.rippleIntensity;
  gridSize.value = DEFAULTS.gridSize;
  gridThickness.value = DEFAULTS.gridThickness;
  fadeDistance.value = DEFAULTS.fadeDistance;
  vignetteStrength.value = DEFAULTS.vignetteStrength;
  glowIntensity.value = DEFAULTS.glowIntensity;
  opacity.value = DEFAULTS.opacity;
  gridRotation.value = DEFAULTS.gridRotation;
  mouseInteraction.value = DEFAULTS.mouseInteraction;
  mouseInteractionRadius.value = DEFAULTS.mouseInteractionRadius;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'enableRainbow',
    type: 'boolean',
    default: 'false',
    description: 'Enables rainbow color cycling animation for the grid.'
  },
  {
    name: 'gridColor',
    type: 'string',
    default: "'#27FF64'",
    description: 'Color of the grid when rainbow mode is disabled.'
  },
  {
    name: 'rippleIntensity',
    type: 'number',
    default: '0.05',
    description: 'Controls the intensity of the ripple effect from the center.'
  },
  {
    name: 'gridSize',
    type: 'number',
    default: '10.0',
    description: 'Controls the density/size of the grid pattern.'
  },
  {
    name: 'gridThickness',
    type: 'number',
    default: '15.0',
    description: 'Controls the thickness of the grid lines.'
  },
  {
    name: 'fadeDistance',
    type: 'number',
    default: '1.5',
    description: 'Controls how far the fade effect extends from the center.'
  },
  {
    name: 'vignetteStrength',
    type: 'number',
    default: '2.0',
    description: 'Controls the intensity of the vignette (edge darkening) effect.'
  },
  {
    name: 'glowIntensity',
    type: 'number',
    default: '0.1',
    description: 'Adds a glow effect to the grid lines.'
  },
  {
    name: 'opacity',
    type: 'number',
    default: '1.0',
    description: 'Overall opacity of the entire effect.'
  },
  {
    name: 'gridRotation',
    type: 'number',
    default: '0',
    description: 'Rotate the entire grid pattern by degrees.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'false',
    description: 'Enable mouse/touch interaction to create ripples.'
  },
  {
    name: 'mouseInteractionRadius',
    type: 'number',
    default: '0.8',
    description: 'Controls the radius of the mouse interaction effect.'
  }
];
</script>
