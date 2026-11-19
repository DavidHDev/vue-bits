<template>
  <ComponentPropsProvider
    :props="themedProps"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative h-[420px] overflow-hidden md:h-[520px]" style="padding: 0">
          <ShapeGrid :key="rerenderKey" v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="A living grid that lights up wherever you go" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="themedProps.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="(value: string | number) => updateProp('shape', value as ShapeGridShape)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="(value: string | number) => updateProp('direction', value as ShapeGridDirection)"
          />
          <PreviewColorPickerCustom
            title="Line Color"
            :color="settings.lineColor"
            @change="(value: string) => updateProp('lineColor', value)"
          />
          <PreviewColorPickerCustom
            title="Hover Border"
            :color="settings.hoverColor"
            @change="(value: string) => updateProp('hoverColor', value)"
          />
          <PreviewColorPickerCustom
            title="Hover Fill"
            :color="settings.hoverFillColor"
            @change="(value: string) => updateProp('hoverFillColor', value)"
          />
          <PreviewSwitch
            title="Rainbow"
            :model-value="settings.rainbow"
            @update:model-value="(value: boolean) => updateProp('rainbow', value)"
          />
          <PreviewSlider
            title="Cell Size"
            :min="14"
            :max="100"
            :step="1"
            value-unit="px"
            :model-value="settings.cellSize"
            @update:model-value="(value: number) => updateProp('cellSize', value)"
          />
          <PreviewSlider
            title="Line Width"
            :min="0.5"
            :max="3"
            :step="0.25"
            value-unit="px"
            :model-value="settings.lineWidth"
            @update:model-value="(value: number) => updateProp('lineWidth', value)"
          />
          <PreviewSlider
            title="Fill Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fillOpacity"
            @update:model-value="(value: number) => updateProp('fillOpacity', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Tilt X"
            :min="-60"
            :max="60"
            :step="1"
            value-unit="°"
            :model-value="settings.tiltX"
            @update:model-value="(value: number) => updateProp('tiltX', value)"
          />
          <PreviewSlider
            title="Tilt Y"
            :min="-60"
            :max="60"
            :step="1"
            value-unit="°"
            :model-value="settings.tiltY"
            @update:model-value="(value: number) => updateProp('tiltY', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="5"
            :step="0.1"
            :model-value="settings.radius"
            @update:model-value="(value: number) => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0.1"
            :max="3"
            :step="0.05"
            value-unit="s"
            :model-value="settings.trail"
            @update:model-value="(value: number) => updateProp('trail', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Twinkle"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.twinkle"
            @update:model-value="(value: number) => updateProp('twinkle', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
          />
          <PreviewSwitch
            title="Click Cascade"
            :model-value="settings.clickCascade"
            @update:model-value="(value: boolean) => updateProp('clickCascade', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="shapeGrid" component-name="ShapeGrid" />
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
import { useThemedProps } from '@/composables/useThemedProps';
import { shapeGrid } from '@/constants/code/Backgrounds/shapeGridCode';
import ShapeGrid from '@/content/Backgrounds/ShapeGrid/ShapeGrid.vue';
import {
  DEFAULT_PROPS,
  PRESETS,
  PRESET_OPTIONS,
  presetProps,
  type ShapeGridDirection,
  type ShapeGridShape
} from './presets/ShapeGrid';

const SHAPE_OPTIONS = [
  { value: 'square', label: 'Square' },
  { value: 'tile', label: 'Tile' },
  { value: 'hexagon', label: 'Hexagon' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'circle', label: 'Circle' },
  { value: 'cross', label: 'Cross' },
  { value: 'dot', label: 'Dot' }
];

const DIRECTION_OPTIONS = [
  { value: 'diagonal', label: 'Diagonal' },
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  {
    name: 'shape',
    type: "'square' | 'tile' | 'hexagon' | 'triangle' | 'diamond' | 'circle' | 'cross' | 'dot'",
    default: "'square'",
    description: 'Shape of the cells. Cross and dot draw markers where the grid lines would meet.'
  },
  { name: 'cellSize', type: 'number', default: '40', description: 'Size of each cell, in px.' },
  { name: 'lineWidth', type: 'number', default: '1', description: 'Thickness of the grid lines, in px.' },
  {
    name: 'direction',
    type: "'diagonal' | 'up' | 'down' | 'left' | 'right' | 'none'",
    default: "'diagonal'",
    description: 'Which way the grid drifts. None holds it still.'
  },
  { name: 'speed', type: 'number', default: '0.5', description: 'How fast the grid drifts.' },
  { name: 'lineColor', type: 'string', default: "'#272a27'", description: 'Color of the grid lines.' },
  {
    name: 'hoverColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color the cell borders light up in under the cursor.'
  },
  {
    name: 'hoverFillColor',
    type: 'string',
    default: 'hoverColor',
    description: 'Color that fills the inside of lit cells. Follows hoverColor when not set.'
  },
  {
    name: 'fillOpacity',
    type: 'number',
    default: '0.15',
    description: 'How solid the inside of lit cells gets, from 0 for outlines only to 1 for solid cells.'
  },
  {
    name: 'rainbow',
    type: 'boolean',
    default: 'false',
    description: 'Lights cells in shifting rainbow colors instead of the hover color.'
  },
  {
    name: 'tiltX',
    type: 'number',
    default: '0',
    description: 'Tilts the grid back in perspective, in degrees. Positive values push the top away.'
  },
  {
    name: 'tiltY',
    type: 'number',
    default: '0',
    description: 'Turns the grid sideways in perspective, in degrees. Positive values push the right side away.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '1.5',
    description: 'Size of the light around the cursor, in cells. 0 lights only the cell under it.'
  },
  {
    name: 'trail',
    type: 'number',
    default: '0.6',
    description: 'How long lit cells take to fade after the cursor moves on, in seconds.'
  },
  { name: 'glow', type: 'number', default: '0.35', description: 'Soft glow around lit cells, from 0 to 1.' },
  {
    name: 'twinkle',
    type: 'number',
    default: '0',
    description: 'Lets random cells light up on their own now and then, from 0 to 1.'
  },
  { name: 'fade', type: 'number', default: '1', description: 'Fades the grid out toward the edges, from 0 to 1.' },
  {
    name: 'clickCascade',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ring of lit cells rolling out across the grid.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Draws the grid in from the middle when it first appears.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole grid.' },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Color behind the grid. By default the canvas is transparent.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the drift and the lights.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const current = computed(() => PRESETS[props.value.preset] ?? PRESETS.classic);
const darkColors = computed(() => ({
  lineColor: current.value.look.lineColor,
  hoverColor: current.value.look.hoverColor,
  hoverFillColor: current.value.look.hoverFillColor
}));
const lightColors = computed(() => current.value.light);
const themedProps = useThemedProps<typeof DEFAULT_PROPS>(props, darkColors, lightColors);
const settings = computed(() => {
  const { preset: _preset, ...rest } = themedProps.value;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
