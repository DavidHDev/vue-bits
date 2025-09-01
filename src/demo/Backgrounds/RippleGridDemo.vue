<template>
  <TabbedLayout>
    <template #preview>
      <div class="relative p-0 h-[600px] overflow-hidden demo-container">
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

      <Customize>
        <PreviewColor title="Grid Color" v-model="gridColor" />

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

      <PropTable :data="propData" />
      <Dependencies :dependency-list="['ogl']" />
    </template>

    <template #code>
      <CodeExample :code-object="rippleGrid" />
    </template>

    <template #cli>
      <CliInstallation :command="rippleGrid.cli" />
    </template>
  </TabbedLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CliInstallation from '../../components/code/CliInstallation.vue';
import CodeExample from '../../components/code/CodeExample.vue';
import Dependencies from '../../components/code/Dependencies.vue';
import BackgroundContent from '../../components/common/BackgroundContent.vue';
import Customize from '../../components/common/Customize.vue';
import PreviewColor from '../../components/common/PreviewColor.vue';
import PreviewSlider from '../../components/common/PreviewSlider.vue';
import PreviewSwitch from '../../components/common/PreviewSwitch.vue';
import PropTable from '../../components/common/PropTable.vue';
import TabbedLayout from '../../components/common/TabbedLayout.vue';
import { rippleGrid } from '../../constants/code/Backgrounds/rippleGridCode';
import RippleGrid from '../../content/Backgrounds/RippleGrid/RippleGrid.vue';

const enableRainbow = ref(false);
const gridColor = ref('#27FF64');
const rippleIntensity = ref(0.05);
const gridSize = ref(10.0);
const gridThickness = ref(15.0);
const fadeDistance = ref(1.5);
const vignetteStrength = ref(2.0);
const glowIntensity = ref(0.1);
const opacity = ref(1.0);
const gridRotation = ref(0);
const mouseInteraction = ref(true);
const mouseInteractionRadius = ref(0.8);

const propData = [
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
