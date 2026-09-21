<template>
  <h1 class="sub-category">Paper Crumple</h1>
  <TabsLayout
    :has-changes="hasChanges"
    :onreset="reset"
    :usage="paperCrumple.usage"
    :source="paperCrumpleSource"
    component-name="PaperCrumple"
    :props-table="props"
  >
    <template #preview>
      <div class="relative p-0 h-125 overflow-hidden demo-container" style="background: transparent">
        <PaperCrumple
          :src="IMAGE"
          alt="A handwritten poem on paper"
          :reset-key="resetKey"
          :width="width"
          :height="height"
          :scene-height="sceneHeight"
          :image-fit="imageFit"
          :release-behavior="releaseBehavior"
          :crumple-amount="crumpleAmount"
          :crumple-duration="crumpleDuration"
          :release-duration="releaseDuration"
          :fold-count="foldCount"
          :fold-sharpness="foldSharpness"
          :wrinkle-depth="wrinkleDepth"
          :crease-strength="creaseStrength"
          :paper-color="paperColor"
          :roughness="roughness"
          :paper-texture="paperTexture"
          :light-intensity="lightIntensity"
          :light-angle="lightAngle"
          :shadow="shadow"
          :shadow-opacity="shadowOpacity"
          :draggable="draggable"
          :drag-rotation="dragRotation"
          :drag-radius="dragRadius"
          :return-to-origin="returnToOrigin"
          :rotation="rotation"
          :seed="seed"
          :detail="detail"
          :disabled="disabled"
        />
      </div>
    </template>

    <template #customize>
      <Customize>
        <PreviewSelect title="On release" :options="RELEASE_OPTIONS" v-model="releaseBehavior" />
        <PreviewSlider title="Crumple amount" :min="0" :max="1" :step="0.05" v-model="crumpleAmount" />
        <PreviewSlider title="Hold duration" :min="0" :max="2" :step="0.05" valueUnit="s" v-model="crumpleDuration" />
        <PreviewSlider
          title="Release duration"
          :min="0"
          :max="2"
          :step="0.05"
          valueUnit="s"
          :isDisabled="releaseBehavior === 'stay'"
          v-model="releaseDuration"
        />
        <PreviewSlider
          title="Crease strength"
          :min="0"
          :max="1"
          :step="0.05"
          :isDisabled="releaseBehavior !== 'creased'"
          v-model="creaseStrength"
        />
        <PreviewSlider title="Fold density" :min="3" :max="16" :step="1" v-model="foldCount" />
        <PreviewSlider title="Fold sharpness" :min="0" :max="1" :step="0.05" v-model="foldSharpness" />
        <PreviewSlider title="Wrinkle depth" :min="0" :max="2" :step="0.05" v-model="wrinkleDepth" />
        <PreviewSlider title="Paper grain" :min="0" :max="1" :step="0.05" v-model="paperTexture" />
        <PreviewSlider title="Roughness" :min="0" :max="1" :step="0.05" v-model="roughness" />
        <PreviewColorPicker title="Paper back" v-model="paperColor" />
        <PreviewSlider title="Light strength" :min="0" :max="6" :step="0.1" v-model="lightIntensity" />
        <PreviewSlider title="Light angle" :min="-180" :max="180" :step="5" valueUnit="°" v-model="lightAngle" />
        <PreviewSwitch title="Shadows" v-model="shadow" />
        <PreviewSlider
          title="Shadow opacity"
          :min="0"
          :max="0.7"
          :step="0.02"
          :isDisabled="!shadow"
          v-model="shadowOpacity"
        />
        <PreviewSwitch title="Draggable" v-model="draggable" />
        <PreviewSlider
          title="Drag tilt"
          :min="0"
          :max="45"
          :step="1"
          valueUnit="°"
          :isDisabled="!draggable"
          v-model="dragRotation"
        />
        <PreviewSlider
          title="Drop radius"
          :min="0"
          :max="300"
          :step="10"
          valueUnit="px"
          :isDisabled="!draggable"
          v-model="dragRadius"
        />
        <PreviewSwitch title="Return to center" :isDisabled="releaseBehavior === 'stay'" v-model="returnToOrigin" />
        <PreviewSelect title="Image fit" :options="FIT_OPTIONS" v-model="imageFit" />
        <PreviewSlider title="Width" :min="80" :max="440" :step="10" valueUnit="px" v-model="width" />
        <PreviewSlider title="Height" :min="80" :max="440" :step="10" valueUnit="px" v-model="height" />
        <PreviewSlider title="Rotation" :min="-25" :max="25" :step="1" valueUnit="°" v-model="rotation" />
        <PreviewSlider title="Fold seed" :min="1" :max="30" :step="1" v-model="seed" />
        <PreviewSlider title="Mesh detail" :min="32" :max="96" :step="8" v-model="detail" />
        <PreviewSwitch title="Disabled" v-model="disabled" />
      </Customize>
    </template>

    <template #propTable>
      <PropTable :data="props" />
    </template>

    <template #code>
      <DemoCodeTab slug="paper-crumple" :usage="paperCrumple.usage!" :source="paperCrumpleSource" />
    </template>
  </TabsLayout>
</template>

<script setup lang="ts">
import Customize from '@/components/common/Customize.vue';
import DemoCodeTab from '@/components/common/DemoCodeTab.vue';
import PreviewColorPicker from '@/components/common/PreviewColorPicker.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import { paperCrumple } from '@/constants/code/Micro/paperCrumpleCode';
import PaperCrumple, { type PaperCrumpleRelease } from '@/content/Micro/PaperCrumple/PaperCrumple.vue';
import paperCrumpleSource from '@/content/Micro/PaperCrumple/PaperCrumple.vue?raw';
import { computed, ref } from 'vue';

const IMAGE = '/assets/images/paper-crumple.jpg';

const DEFAULTS = {
  width: 400,
  height: 400,
  sceneHeight: 360,
  imageFit: 'contain' as 'cover' | 'contain',
  releaseBehavior: 'restore' as PaperCrumpleRelease,
  crumpleAmount: 0.85,
  crumpleDuration: 0.55,
  releaseDuration: 0.4,
  foldCount: 6,
  foldSharpness: 0.6,
  wrinkleDepth: 0.65,
  creaseStrength: 0.18,
  paperColor: '#f4f0e8',
  roughness: 0.92,
  paperTexture: 0.08,
  lightIntensity: 1.8,
  lightAngle: -35,
  shadow: true,
  shadowOpacity: 0.16,
  draggable: true,
  dragRotation: 10,
  dragRadius: 180,
  returnToOrigin: true,
  rotation: 0,
  seed: 7,
  detail: 64,
  disabled: false
};

const RELEASE_OPTIONS = [
  { value: 'stay', label: 'Stay crumpled' },
  { value: 'restore', label: 'Restore flat' },
  { value: 'creased', label: 'Leave creases' }
];
const FIT_OPTIONS = [
  { value: 'cover', label: 'cover' },
  { value: 'contain', label: 'contain' }
];

const width = ref(DEFAULTS.width);
const height = ref(DEFAULTS.height);
const sceneHeight = ref(DEFAULTS.sceneHeight);
const imageFit = ref(DEFAULTS.imageFit);
const releaseBehavior = ref(DEFAULTS.releaseBehavior);
const crumpleAmount = ref(DEFAULTS.crumpleAmount);
const crumpleDuration = ref(DEFAULTS.crumpleDuration);
const releaseDuration = ref(DEFAULTS.releaseDuration);
const foldCount = ref(DEFAULTS.foldCount);
const foldSharpness = ref(DEFAULTS.foldSharpness);
const wrinkleDepth = ref(DEFAULTS.wrinkleDepth);
const creaseStrength = ref(DEFAULTS.creaseStrength);
const paperColor = ref(DEFAULTS.paperColor);
const roughness = ref(DEFAULTS.roughness);
const paperTexture = ref(DEFAULTS.paperTexture);
const lightIntensity = ref(DEFAULTS.lightIntensity);
const lightAngle = ref(DEFAULTS.lightAngle);
const shadow = ref(DEFAULTS.shadow);
const shadowOpacity = ref(DEFAULTS.shadowOpacity);
const draggable = ref(DEFAULTS.draggable);
const dragRotation = ref(DEFAULTS.dragRotation);
const dragRadius = ref(DEFAULTS.dragRadius);
const returnToOrigin = ref(DEFAULTS.returnToOrigin);
const rotation = ref(DEFAULTS.rotation);
const seed = ref(DEFAULTS.seed);
const detail = ref(DEFAULTS.detail);
const disabled = ref(DEFAULTS.disabled);
const resetKey = ref(0);

const state = {
  width,
  height,
  sceneHeight,
  imageFit,
  releaseBehavior,
  crumpleAmount,
  crumpleDuration,
  releaseDuration,
  foldCount,
  foldSharpness,
  wrinkleDepth,
  creaseStrength,
  paperColor,
  roughness,
  paperTexture,
  lightIntensity,
  lightAngle,
  shadow,
  shadowOpacity,
  draggable,
  dragRotation,
  dragRadius,
  returnToOrigin,
  rotation,
  seed,
  detail,
  disabled
};
const keys = Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[];
const hasChanges = computed(() => keys.some(k => state[k].value !== DEFAULTS[k]));
function reset() {
  keys.forEach(k => ((state[k] as { value: unknown }).value = DEFAULTS[k]));
  resetKey.value++;
}

const props: PropRow[] = [
  {
    name: 'src',
    type: 'string',
    default: '-',
    description: 'Required image URL. PNG transparency is preserved. Remote image servers must allow CORS.'
  },
  {
    name: 'alt',
    type: 'string',
    default: '"Crumplable image"',
    description: 'Image description used by the fallback and the accessible hold control.'
  },
  {
    name: 'backSrc',
    type: 'string',
    default: '""',
    description: 'Optional image printed on the reverse. Otherwise the back uses paperColor.'
  },
  {
    name: 'width',
    type: 'number',
    default: '320',
    description: 'Unfolded paper width in pixels. Scales down to fit the stage with a 24px inset.'
  },
  {
    name: 'height',
    type: 'number',
    default: '400',
    description: 'Unfolded paper height in pixels. Determines the sheet aspect ratio.'
  },
  {
    name: 'sceneHeight',
    type: 'number',
    default: '560',
    description: 'Height of the full-width stage in pixels, including space to drag.'
  },
  {
    name: 'imageFit',
    type: '"cover" | "contain"',
    default: '"cover"',
    description: 'Cover crops the texture; contain keeps the entire image and leaves unused space transparent.'
  },
  {
    name: 'releaseBehavior',
    type: '"stay" | "restore" | "creased"',
    default: '"restore"',
    description: 'Freeze the current crumple, unfold completely, or unfold with lasting crease relief.'
  },
  {
    name: 'crumpleAmount',
    type: 'number',
    default: '0.85',
    description: 'Maximum fold amount while held, from 0 (flat) to 1 (fully crumpled).'
  },
  {
    name: 'crumpleDuration',
    type: 'number',
    default: '0.55',
    description: 'Approximate settling time in seconds while holding. 0 makes the change immediate.'
  },
  {
    name: 'releaseDuration',
    type: 'number',
    default: '0.4',
    description: 'Approximate unfolding time in seconds. Another press can interrupt it.'
  },
  {
    name: 'foldCount',
    type: 'number',
    default: '6',
    description:
      'Number of crease guides in the paper solver, from 3 to 16. Each seed produces a different arrangement.'
  },
  {
    name: 'foldSharpness',
    type: 'number',
    default: '0.6',
    description: 'Blend from rounded wrinkles (0) to angular creases (1).'
  },
  {
    name: 'wrinkleDepth',
    type: 'number',
    default: '0.65',
    description: 'Compression depth, from 0 to 2. Higher values produce a tighter wad and stronger residual folds.'
  },
  {
    name: 'creaseStrength',
    type: 'number',
    default: '0.18',
    description: 'Residual relief from 0 to 1 for the creased release mode. Longer holds leave stronger creases.'
  },
  {
    name: 'paperColor',
    type: 'string',
    default: '"#f4f0e8"',
    description: 'Color of the unprinted back of the sheet.'
  },
  {
    name: 'roughness',
    type: 'number',
    default: '0.92',
    description: 'Material roughness, from smooth (0) to matte (1).'
  },
  {
    name: 'paperTexture',
    type: 'number',
    default: '0.08',
    description: 'Fine paper-grain bump strength, from 0 to 1.'
  },
  {
    name: 'lightIntensity',
    type: 'number',
    default: '1.8',
    description: 'Strength of the directional light that reveals folds.'
  },
  {
    name: 'lightAngle',
    type: 'number',
    default: '-35',
    description: 'Direction of the key light in degrees. 0 shines from above.'
  },
  {
    name: 'shadow',
    type: 'boolean',
    default: 'true',
    description: 'Enable self-shadowing and a soft drop shadow behind the paper.'
  },
  {
    name: 'shadowOpacity',
    type: 'number',
    default: '0.08',
    description: 'Opacity of the cast and drop shadows, from 0 to 1.'
  },
  {
    name: 'draggable',
    type: 'boolean',
    default: 'true',
    description: 'Move the sheet while held. The grabbed material point follows the pointer.'
  },
  {
    name: 'dragRotation',
    type: 'number',
    default: '10',
    description: 'Maximum tilt in degrees while dragging. 0 disables tilt.'
  },
  {
    name: 'dragRadius',
    type: 'number',
    default: '180',
    description: 'Maximum resting offset on each axis, in pixels. The stage also bounds the resting position.'
  },
  {
    name: 'returnToOrigin',
    type: 'boolean',
    default: 'true',
    description: 'Restore and creased modes return to the center. Stay mode leaves the paper where it was dropped.'
  },
  { name: 'rotation', type: 'number', default: '0', description: 'Initial sheet rotation in degrees.' },
  {
    name: 'seed',
    type: 'number',
    default: '7',
    description: 'Seed for a repeatable arrangement of folds and paper grain.'
  },
  {
    name: 'detail',
    type: 'number',
    default: '64',
    description: 'Simulation detail, clamped to 32–96. Higher values add smaller folds and take longer to prepare.'
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable pointer and keyboard input and finish any active hold.'
  },
  {
    name: 'resetKey',
    type: 'number | string',
    default: '0',
    description: 'Change this value to reset the position, crumple and accumulated creases immediately.'
  },
  {
    name: '@stateChange',
    type: '(state: PaperCrumpleState) => void',
    default: '-',
    description: 'Reports holding, then the selected release state: flat, crumpled or creased.'
  },
  {
    name: '@error',
    type: '(error: Error) => void',
    default: '-',
    description: 'Called if WebGL initialization or image loading fails. The original image remains as a fallback.'
  },
  { name: 'className', type: 'string', default: '""', description: 'Additional classes for the stage.' }
];
</script>
