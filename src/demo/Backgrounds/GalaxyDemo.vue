<template>
  <h1 class="sub-category">Galaxy</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="galaxy.usage"
    :source="galaxySource"
    component-name="Galaxy"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-[500px] overflow-hidden demo-container">
        <Galaxy
          :density="density"
          :glow-intensity="glowIntensity"
          :saturation="saturation"
          :hue-shift="hueShift"
          :twinkle-intensity="twinkleIntensity"
          :rotation-speed="rotationSpeed"
          :repulsion-strength="repulsionStrength"
          :auto-center-repulsion="autoCenterRepulsion"
          :star-speed="starSpeed"
          :speed="speed"
          :mouse-repulsion="mouseRepulsion"
          :mouse-interaction="mouseInteraction"
        />
        <BackgroundContent pill-text="New Background" headline="Components you shall have, young padawan." />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSwitch title="Mouse Interaction" v-model="mouseInteraction" />
        <PreviewSwitch title="Mouse Repulsion" v-model="mouseRepulsion" />
        <PreviewSlider :min="0.1" :max="3" :step="0.1" v-model="density" title="Density" />
        <PreviewSlider :min="0" :max="1" :step="0.1" v-model="glowIntensity" title="Glow Intensity" />
        <PreviewSlider :min="0" :max="1" :step="0.1" v-model="saturation" title="Saturation" />
        <PreviewSlider :min="0" :max="360" :step="10" v-model="hueShift" title="Hue Shift" value-unit="°" />
        <PreviewSlider :min="0" :max="1" :step="0.1" v-model="twinkleIntensity" title="Twinkle Intensity" />
        <PreviewSlider :min="0" :max="0.5" :step="0.05" v-model="rotationSpeed" title="Rotation Speed" />
        <PreviewSlider :min="0" :max="10" :step="0.5" v-model="repulsionStrength" title="Repulsion Strength" />
        <PreviewSlider :min="0" :max="20" :step="1" v-model="autoCenterRepulsion" title="Auto Center Repulsion" />
        <PreviewSlider :min="0.1" :max="2" :step="0.1" v-model="starSpeed" title="Star Speed" />
        <PreviewSlider :min="0.1" :max="3" :step="0.1" v-model="speed" title="Animation Speed" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="galaxy" :usage="galaxy.usage!" :source="galaxySource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { useForceRerender } from '@/composables/useForceRerender';
import { galaxy } from '@/constants/code/Backgrounds/galaxyCode';
import Galaxy from '@/content/Backgrounds/Galaxy/Galaxy.vue';
import galaxySource from '@/content/Backgrounds/Galaxy/Galaxy.vue?raw';
import { computed, ref } from 'vue';

const { forceRerender } = useForceRerender();

const DEFAULTS = {
  density: 1,
  glowIntensity: 0.3,
  saturation: 0.0,
  hueShift: 140,
  twinkleIntensity: 0.3,
  rotationSpeed: 0.1,
  repulsionStrength: 2,
  autoCenterRepulsion: 0,
  starSpeed: 0.5,
  speed: 1.0,
  mouseRepulsion: true,
  mouseInteraction: true
};

const density = ref(DEFAULTS.density);
const glowIntensity = ref(DEFAULTS.glowIntensity);
const saturation = ref(DEFAULTS.saturation);
const hueShift = ref(DEFAULTS.hueShift);
const twinkleIntensity = ref(DEFAULTS.twinkleIntensity);
const rotationSpeed = ref(DEFAULTS.rotationSpeed);
const repulsionStrength = ref(DEFAULTS.repulsionStrength);
const autoCenterRepulsion = ref(DEFAULTS.autoCenterRepulsion);
const starSpeed = ref(DEFAULTS.starSpeed);
const speed = ref(DEFAULTS.speed);
const mouseRepulsion = ref(DEFAULTS.mouseRepulsion);
const mouseInteraction = ref(DEFAULTS.mouseInteraction);

const hasChanges = computed(
  () =>
    density.value !== DEFAULTS.density ||
    glowIntensity.value !== DEFAULTS.glowIntensity ||
    saturation.value !== DEFAULTS.saturation ||
    hueShift.value !== DEFAULTS.hueShift ||
    twinkleIntensity.value !== DEFAULTS.twinkleIntensity ||
    rotationSpeed.value !== DEFAULTS.rotationSpeed ||
    repulsionStrength.value !== DEFAULTS.repulsionStrength ||
    autoCenterRepulsion.value !== DEFAULTS.autoCenterRepulsion ||
    starSpeed.value !== DEFAULTS.starSpeed ||
    speed.value !== DEFAULTS.speed ||
    mouseRepulsion.value !== DEFAULTS.mouseRepulsion ||
    mouseInteraction.value !== DEFAULTS.mouseInteraction
);

function reset() {
  density.value = DEFAULTS.density;
  glowIntensity.value = DEFAULTS.glowIntensity;
  saturation.value = DEFAULTS.saturation;
  hueShift.value = DEFAULTS.hueShift;
  twinkleIntensity.value = DEFAULTS.twinkleIntensity;
  rotationSpeed.value = DEFAULTS.rotationSpeed;
  repulsionStrength.value = DEFAULTS.repulsionStrength;
  autoCenterRepulsion.value = DEFAULTS.autoCenterRepulsion;
  starSpeed.value = DEFAULTS.starSpeed;
  speed.value = DEFAULTS.speed;
  mouseRepulsion.value = DEFAULTS.mouseRepulsion;
  mouseInteraction.value = DEFAULTS.mouseInteraction;
  forceRerender();
}

const props: PropRow[] = [
  {
    name: 'focal',
    type: '[number, number]',
    default: '[0.5, 0.5]',
    description: 'Sets the focal point of the galaxy effect as [x, y] coordinates from 0 to 1'
  },
  {
    name: 'rotation',
    type: '[number, number]',
    default: '[1.0, 0.0]',
    description: 'Controls the rotation matrix of the galaxy as [x, y] rotation values'
  },
  {
    name: 'starSpeed',
    type: 'number',
    default: '0.5',
    description: 'Controls the speed of star movement and animation'
  },
  {
    name: 'density',
    type: 'number',
    default: '1',
    description: 'Controls the density of stars in the galaxy'
  },
  {
    name: 'hueShift',
    type: 'number',
    default: '140',
    description: 'Shifts the hue of all stars by the specified degrees (0-360)'
  },
  {
    name: 'disableAnimation',
    type: 'boolean',
    default: 'false',
    description: 'When true, stops all time-based animations'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1.0',
    description: 'Global speed multiplier for all animations'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Enables or disables mouse interaction with the galaxy'
  },
  {
    name: 'glowIntensity',
    type: 'number',
    default: '0.3',
    description: 'Controls the intensity of the star glow effect'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '0.0',
    description: 'Controls color saturation of stars (0 = grayscale, 1 = full color)'
  },
  {
    name: 'mouseRepulsion',
    type: 'boolean',
    default: 'true',
    description: 'When true, stars are repelled by the mouse cursor'
  },
  {
    name: 'twinkleIntensity',
    type: 'number',
    default: '0.3',
    description: 'Controls how much stars twinkle (0 = no twinkle, 1 = maximum twinkle)'
  },
  {
    name: 'rotationSpeed',
    type: 'number',
    default: '0.1',
    description: 'Speed of automatic galaxy rotation'
  },
  {
    name: 'repulsionStrength',
    type: 'number',
    default: '2',
    description: 'Strength of mouse repulsion effect when mouseRepulsion is enabled'
  },
  {
    name: 'autoCenterRepulsion',
    type: 'number',
    default: '0',
    description: 'Creates repulsion from center of canvas. Overrides mouse repulsion when > 0'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Makes the black background transparent, showing only stars'
  }
];
</script>
