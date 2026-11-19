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
          <Topography :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Terrain that rises to meet your cursor." />
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
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="(value: string | number) => updateProp('direction', value as TopographyDirection)"
          />
          <PreviewSelect
            title="Hover Effect"
            :options="HOVER_OPTIONS"
            :model-value="settings.hoverEffect"
            @update:model-value="(value: string | number) => updateProp('hoverEffect', value as TopographyHoverEffect)"
          />
          <PreviewSelect
            title="Click Effect"
            :options="CLICK_OPTIONS"
            :model-value="settings.clickEffect"
            @update:model-value="(value: string | number) => updateProp('clickEffect', value as TopographyClickEffect)"
          />
          <PreviewSelect
            title="Markers"
            :options="MARKER_OPTIONS"
            :model-value="settings.markers"
            @update:model-value="(value: string | number) => updateProp('markers', value as TopographyMarkers)"
          />
          <PreviewSlider
            title="Lines"
            :min="6"
            :max="60"
            :step="1"
            :model-value="settings.lineCount"
            @update:model-value="(value: number) => updateProp('lineCount', value)"
          />
          <PreviewSlider
            title="Line Width"
            :min="0.5"
            :max="3"
            :step="0.1"
            value-unit="px"
            :model-value="settings.lineWidth"
            @update:model-value="(value: number) => updateProp('lineWidth', value)"
          />
          <PreviewSlider
            title="Elevation"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.elevation"
            @update:model-value="(value: number) => updateProp('elevation', value)"
          />
          <PreviewSlider
            title="Foreground"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.foreground"
            @update:model-value="(value: number) => updateProp('foreground', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.4"
            :max="3"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Detail"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.detail"
            @update:model-value="(value: number) => updateProp('detail', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="15"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="(value: number) => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="1.5"
            :step="0.01"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Morph"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.morph"
            @update:model-value="(value: number) => updateProp('morph', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Depth of Field"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.depthOfField"
            @update:model-value="(value: number) => updateProp('depthOfField', value)"
          />
          <PreviewSlider
            title="Fog"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.fog"
            @update:model-value="(value: number) => updateProp('fog', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.2"
            :max="2"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Glitch"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.glitch"
            @update:model-value="(value: number) => updateProp('glitch', value)"
          />
          <PreviewSlider
            title="Mouse Radius"
            :min="0.3"
            :max="2.5"
            :step="0.05"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.mouseRadius"
            @update:model-value="(value: number) => updateProp('mouseRadius', value)"
          />
          <PreviewSlider
            title="Mouse Strength"
            :min="0"
            :max="1.5"
            :step="0.05"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.mouseStrength"
            @update:model-value="(value: number) => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0"
            :max="1"
            :step="0.01"
            :is-disabled="!settings.mouseInteraction || settings.hoverEffect !== 'lift'"
            :model-value="settings.trail"
            @update:model-value="(value: number) => updateProp('trail', value)"
          />
          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="1"
            :step="0.01"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.parallax"
            @update:model-value="(value: number) => updateProp('parallax', value)"
          />
          <PreviewSwitch
            title="Major Lines"
            :model-value="settings.majorLines"
            @update:model-value="(value: boolean) => updateProp('majorLines', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="topography" component-name="Topography" />
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
import { useColorMode } from '@/composables/useTheme';
import { topography } from '@/constants/code/Backgrounds/topographyCode';
import Topography from '@/content/Backgrounds/Topography/Topography.vue';
import {
  DEFAULT_PROPS,
  PRESET_OPTIONS,
  presetProps,
  type TopographyClickEffect,
  type TopographyDirection,
  type TopographyHoverEffect,
  type TopographyMarkers
} from './presets/Topography';

const DIRECTION_OPTIONS = [
  { value: 'forward', label: 'Forward' },
  { value: 'backward', label: 'Backward' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const HOVER_OPTIONS = [
  { value: 'lift', label: 'Lift' },
  { value: 'trace', label: 'Trace' },
  { value: 'light', label: 'Light' }
];

const MARKER_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'plus', label: 'Plus' },
  { value: 'dots', label: 'Dots' }
];

const CLICK_OPTIONS = [
  { value: 'pulse', label: 'Pulse' },
  { value: 'peak', label: 'Peak' },
  { value: 'none', label: 'None' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { isLight } = useColorMode();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: isLight.value, defaults: defaultProps.value }), preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#4f7cff'",
    description: 'Color of the contour lines. The brightest lines glow toward white.'
  },
  {
    name: 'lineCount',
    type: 'number',
    default: '22',
    description: 'How many contour lines stack up the tallest mountain.'
  },
  {
    name: 'lineWidth',
    type: 'number',
    default: '1.2',
    description: 'Width of the lines in px. Nearer lines draw a little thicker.'
  },
  {
    name: 'majorLines',
    type: 'boolean',
    default: 'true',
    description: 'Draws every fifth line bolder and brighter, like the index lines on a map.'
  },
  {
    name: 'elevation',
    type: 'number',
    default: '1',
    description: 'How tall the mountains rise. 0 lays the map flat.'
  },
  {
    name: 'foreground',
    type: 'number',
    default: '0.2',
    description:
      'How much height the land keeps as it reaches the camera. Low values settle it flat so the view stays clear.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Size of the landforms. Larger values give broader mountains.'
  },
  {
    name: 'detail',
    type: 'number',
    default: '0.35',
    description: 'Fine wobble in the lines and small rings on the plains, from 0 to 1.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '32',
    description: 'Camera angle in degrees, from a low view across the land to 90 for straight down.'
  },
  { name: 'speed', type: 'number', default: '0.25', description: 'How fast the camera glides over the land.' },
  {
    name: 'direction',
    type: "'forward' | 'backward' | 'left' | 'right'",
    default: "'forward'",
    description: 'Which way the camera travels.'
  },
  {
    name: 'morph',
    type: 'number',
    default: '0.2',
    description: 'How quickly the landforms reshape over time. 0 keeps the terrain still.'
  },
  { name: 'glow', type: 'number', default: '0.6', description: 'Soft bloom around the lit lines.' },
  {
    name: 'depthOfField',
    type: 'number',
    default: '0.4',
    description: 'Softens lines away from the focus point, which follows the cursor.'
  },
  {
    name: 'fog',
    type: 'number',
    default: '0.35',
    description: 'How quickly the land fades into the distance. 1 leaves only the foreground.'
  },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness of the lines.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall opacity of the effect.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Lets the cursor light and shape the terrain, and tilts the camera toward it.'
  },
  {
    name: 'hoverEffect',
    type: "'lift' | 'trace' | 'light'",
    default: "'lift'",
    description: 'Lift raises the land under the cursor, trace lights the contour at its height, light only lights it.'
  },
  { name: 'mouseRadius', type: 'number', default: '1', description: 'Size of the area the cursor affects.' },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '0.6',
    description: 'How high the land lifts and how brightly it lights.'
  },
  {
    name: 'trail',
    type: 'number',
    default: '0.3',
    description: 'How long the lifted land takes to settle back, from 0 to 1.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '0.5',
    description: 'How far the camera leans toward the cursor, from 0 to 1.'
  },
  {
    name: 'clickEffect',
    type: "'pulse' | 'peak' | 'none'",
    default: "'pulse'",
    description: 'Pulse sends a ring of light rolling out over the land, peak raises a new mountain.'
  },
  {
    name: 'markers',
    type: "'none' | 'plus' | 'dots'",
    default: "'none'",
    description:
      'Survey markers on a grid across the land. A few blink, and the ones near the cursor get a target frame.'
  },
  {
    name: 'glitch',
    type: 'number',
    default: '0',
    description: 'How often brief data glitches slice through the lines, from 0 to 1. Clicks set one off too.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The map fades in flat and rises into mountains on mount.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the lines as crisp ink for light backgrounds instead of glowing light.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
