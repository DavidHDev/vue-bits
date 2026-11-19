<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <AcidSquares :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Glossy squares that ripple under colored light." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="settings.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Accent"
            :color="settings.accentColor"
            @change="(value: string) => updateProp('accentColor', value)"
          />
          <PreviewColorPickerCustom
            title="Secondary"
            :color="settings.secondaryColor"
            @change="(value: string) => updateProp('secondaryColor', value)"
          />
          <PreviewSlider
            title="Tile Size"
            :min="0.3"
            :max="2.5"
            :step="0.05"
            :model-value="settings.tileSize"
            @update:model-value="value => updateProp('tileSize', value)"
          />
          <PreviewSlider
            title="Gap"
            :min="0"
            :max="0.4"
            :step="0.01"
            :model-value="settings.gap"
            @update:model-value="value => updateProp('gap', value)"
          />
          <PreviewSlider
            title="Roundness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.roundness"
            @update:model-value="value => updateProp('roundness', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.softness"
            @update:model-value="value => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Bulge"
            :min="0"
            :max="1.5"
            :step="0.01"
            :model-value="settings.bulge"
            @update:model-value="value => updateProp('bulge', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="-90"
            :max="90"
            :step="1"
            :model-value="settings.rotation"
            @update:model-value="value => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Gloss"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.gloss"
            @update:model-value="value => updateProp('gloss', value)"
          />
          <PreviewSlider
            title="Waves"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.waves"
            @update:model-value="value => updateProp('waves', value)"
          />
          <PreviewSlider
            title="Wave Scale"
            :min="0.4"
            :max="2.5"
            :step="0.05"
            :model-value="settings.waveScale"
            @update:model-value="value => updateProp('waveScale', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSelect
            title="Ripple Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="(value: string | number) => updateProp('shape', value as AcidSquaresShape)"
          />
          <PreviewSlider
            title="Pulse"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.pulse"
            @update:model-value="value => updateProp('pulse', value)"
          />
          <PreviewSlider
            title="Pulse Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.pulseSpeed"
            @update:model-value="value => updateProp('pulseSpeed', value)"
          />
          <PreviewSlider
            title="Pulse Spacing"
            :min="0.4"
            :max="3"
            :step="0.05"
            :model-value="settings.pulseSpacing"
            @update:model-value="value => updateProp('pulseSpacing', value)"
          />
          <PreviewSlider
            title="Pulse Width"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.pulseWidth"
            @update:model-value="value => updateProp('pulseWidth', value)"
          />
          <PreviewSelect
            title="Pulse Origin"
            :options="ORIGIN_OPTIONS"
            :model-value="settings.pulseOrigin"
            @update:model-value="(value: string | number) => updateProp('pulseOrigin', value as AcidSquaresPulseOrigin)"
          />
          <PreviewSelect
            title="Lighting"
            :options="LIGHTING_OPTIONS"
            :model-value="settings.lighting"
            @update:model-value="(value: string | number) => updateProp('lighting', value as AcidSquaresLighting)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="value => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Zoom"
            :min="0.5"
            :max="2.5"
            :step="0.05"
            :model-value="settings.zoom"
            @update:model-value="value => updateProp('zoom', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="3"
            :max="20"
            :step="0.5"
            :model-value="settings.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.4"
            :step="0.01"
            :model-value="settings.grain"
            @update:model-value="value => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.opacity"
            @update:model-value="value => updateProp('opacity', value)"
          />
          <PreviewSelect
            title="Hover Effect"
            :options="HOVER_OPTIONS"
            :model-value="settings.hoverEffect"
            @update:model-value="(value: string | number) => updateProp('hoverEffect', value as AcidSquaresHoverEffect)"
          />
          <PreviewSlider
            title="Hover Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.mouseStrength"
            @update:model-value="value => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Hover Radius"
            :min="0.1"
            :max="1"
            :step="0.01"
            :model-value="settings.mouseRadius"
            @update:model-value="value => updateProp('mouseRadius', value)"
          />
          <PreviewSelect
            title="Detail"
            :options="DETAIL_OPTIONS"
            :model-value="settings.detail"
            @update:model-value="(value: string | number) => updateProp('detail', value as AcidSquaresDetail)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Pulse On Click"
            :model-value="settings.pulseOnClick"
            @update:model-value="value => updateProp('pulseOnClick', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="value => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="acidSquares" component-name="AcidSquares" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { useColorModeValue } from '@/composables/useTheme';
import { acidSquares } from '@/constants/code/Backgrounds/acidSquaresCode';
import AcidSquares from '@/content/Backgrounds/AcidSquares/AcidSquares.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/AcidSquares';

type AcidSquaresShape = 'square' | 'round';
type AcidSquaresPulseOrigin = 'center' | 'random';
type AcidSquaresLighting = 'split' | 'backlit' | 'overhead';
type AcidSquaresHoverEffect = 'press' | 'lift' | 'none';
type AcidSquaresDetail = 'low' | 'medium' | 'high';

const SHAPE_OPTIONS = [
  { value: 'square', label: 'Square' },
  { value: 'round', label: 'Round' }
];

const ORIGIN_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'random', label: 'Random' }
];

const LIGHTING_OPTIONS = [
  { value: 'split', label: 'Split' },
  { value: 'backlit', label: 'Backlit' },
  { value: 'overhead', label: 'Overhead' }
];

const HOVER_OPTIONS = [
  { value: 'press', label: 'Press' },
  { value: 'lift', label: 'Lift' },
  { value: 'none', label: 'None' }
];

const DETAIL_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const light = useColorModeValue(true, false);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: light.value, defaults: defaultProps.value }), preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#111111'",
    description: 'Base color of the squares. Set it to your page background, the gaps show the page through.'
  },
  {
    name: 'accentColor',
    type: 'string',
    default: "'#42b883'",
    description: 'Color of the first light that drifts across the squares.'
  },
  { name: 'secondaryColor', type: 'string', default: "'#3b6bff'", description: 'Color of the second light.' },
  { name: 'tileSize', type: 'number', default: '1', description: 'Size of the squares.' },
  { name: 'gap', type: 'number', default: '0.12', description: 'Width of the gaps between the squares.' },
  {
    name: 'roundness',
    type: 'number',
    default: '0.25',
    description: 'Corner radius, from sharp squares at 0 to circles at 1.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0.5',
    description: 'How softly the edges of each square round off into the gaps.'
  },
  {
    name: 'bulge',
    type: 'number',
    default: '0.3',
    description: 'How much each square domes up like a cushion. 0 keeps the tops flat.'
  },
  { name: 'rotation', type: 'number', default: '35', description: 'Rotation of the grid, in degrees.' },
  {
    name: 'gloss',
    type: 'number',
    default: '0.6',
    description: 'From soft satin at 0 to glossy at 1, with tighter highlights along the edges.'
  },
  { name: 'waves', type: 'number', default: '1', description: 'Height of the slow swells. 0 lays the surface flat.' },
  { name: 'waveScale', type: 'number', default: '1', description: 'Size of the swells. Higher makes them broader.' },
  { name: 'speed', type: 'number', default: '0.6', description: 'Speed of the swells and the drifting lights.' },
  {
    name: 'shape',
    type: "'square' | 'round'",
    default: "'square'",
    description: 'Shape of the ripples that travel across the surface.'
  },
  { name: 'pulse', type: 'number', default: '1', description: 'Height of the ripples. 0 turns them off.' },
  { name: 'pulseSpeed', type: 'number', default: '0.45', description: 'How fast the ripples travel.' },
  { name: 'pulseSpacing', type: 'number', default: '1', description: 'Time between ripples.' },
  { name: 'pulseWidth', type: 'number', default: '1', description: 'Width of each ripple.' },
  {
    name: 'pulseOrigin',
    type: "'center' | 'random'",
    default: "'center'",
    description: 'Start every ripple from the center, or from random spots on the surface.'
  },
  {
    name: 'lighting',
    type: "'split' | 'backlit' | 'overhead'",
    default: "'split'",
    description: 'Placement of the two lights: from either side, low behind the surface, or from above.'
  },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness.' },
  {
    name: 'tilt',
    type: 'number',
    default: '0.7',
    description: 'View angle, from straight down at 0 to low across the surface at 1.'
  },
  { name: 'zoom', type: 'number', default: '1', description: 'Zoom. Higher brings the squares closer.' },
  {
    name: 'depth',
    type: 'number',
    default: '10',
    description: 'How far the surface reaches before it fades into the page.'
  },
  { name: 'grain', type: 'number', default: '0.12', description: 'Strength of the film grain.' },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Switches the squares on from the center outward when the effect first appears.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Lets the cursor shape the surface and the view follow it slightly.'
  },
  {
    name: 'hoverEffect',
    type: "'press' | 'lift' | 'none'",
    default: "'press'",
    description: 'Whether the cursor presses the surface down or lifts it up.'
  },
  { name: 'mouseStrength', type: 'number', default: '1', description: 'Depth of the cursor press or lift.' },
  { name: 'mouseRadius', type: 'number', default: '0.35', description: 'Size of the area the cursor shapes.' },
  {
    name: 'pulseOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Sends a ripple out from wherever you click.'
  },
  {
    name: 'detail',
    type: "'low' | 'medium' | 'high'",
    default: "'medium'",
    description: 'Smoothness of the surface. Lower it for weaker devices.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws pale squares with soft tints for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];
</script>
