<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <CursorGrid :key="rerenderKey" v-bind="settings" :color="tone" :grid-color="lines" :light-mode="isLight" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="tone"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Grid Color"
            :color="lines"
            @change="(value: string) => updateProp('gridColor', value)"
          />
          <PreviewSelect
            title="Highlight"
            :options="HIGHLIGHT_OPTIONS"
            :model-value="settings.highlight"
            @update:model-value="value => updateProp('highlight', value as Highlight)"
          />
          <PreviewSelect
            title="Grid Style"
            :options="STYLE_OPTIONS"
            :model-value="settings.gridStyle"
            @update:model-value="value => updateProp('gridStyle', value as GridStyle)"
          />
          <PreviewSelect
            title="Falloff"
            :options="FALLOFF_OPTIONS"
            :model-value="settings.falloff"
            :is-disabled="settings.highlight === 'cell'"
            @update:model-value="value => updateProp('falloff', value as Falloff)"
          />
          <PreviewSlider
            title="Cell Size"
            :min="20"
            :max="160"
            :step="2"
            value-unit="px"
            :model-value="settings.cellSize"
            @update:model-value="value => updateProp('cellSize', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="40"
            :max="400"
            :step="10"
            value-unit="px"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Hold Time"
            :min="0"
            :max="2000"
            :step="50"
            value-unit="ms"
            :model-value="settings.holdTime"
            @update:model-value="value => updateProp('holdTime', value)"
          />
          <PreviewSlider
            title="Fade Duration"
            :min="100"
            :max="3000"
            :step="50"
            value-unit="ms"
            :model-value="settings.fadeDuration"
            @update:model-value="value => updateProp('fadeDuration', value)"
          />
          <PreviewSlider
            title="Line Width"
            :min="0.5"
            :max="4"
            :step="0.1"
            value-unit="px"
            :model-value="settings.lineWidth"
            @update:model-value="value => updateProp('lineWidth', value)"
          />
          <PreviewSlider
            title="Max Opacity"
            :min="0.1"
            :max="1"
            :step="0.05"
            :model-value="settings.maxOpacity"
            @update:model-value="value => updateProp('maxOpacity', value)"
          />
          <PreviewSlider
            title="Fill Opacity"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.fillOpacity"
            @update:model-value="value => updateProp('fillOpacity', value)"
          />
          <PreviewSlider
            title="Grid Opacity"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.gridOpacity"
            @update:model-value="value => updateProp('gridOpacity', value)"
          />
          <PreviewSlider
            title="Spotlight"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.spotlight"
            @update:model-value="value => updateProp('spotlight', value)"
          />
          <PreviewSlider
            title="Cell Gap"
            :min="0"
            :max="16"
            :step="1"
            value-unit="px"
            :model-value="settings.cellGap"
            @update:model-value="value => updateProp('cellGap', value)"
          />
          <PreviewSlider
            title="Cell Corners"
            :min="0"
            :max="24"
            :step="1"
            value-unit="px"
            :model-value="settings.cellRadius"
            @update:model-value="value => updateProp('cellRadius', value)"
          />
          <PreviewSlider
            title="Pulse Speed"
            :min="100"
            :max="2000"
            :step="50"
            value-unit="px/s"
            :is-disabled="!settings.clickPulse"
            :model-value="settings.pulseSpeed"
            @update:model-value="value => updateProp('pulseSpeed', value)"
          />
          <PreviewSlider
            title="Ambient"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.ambient"
            @update:model-value="value => updateProp('ambient', value)"
          />
          <PreviewSlider
            title="Edge Fade"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.edgeFade"
            @update:model-value="value => updateProp('edgeFade', value)"
          />
          <PreviewSwitch
            title="Click Pulse"
            :model-value="settings.clickPulse"
            @update:model-value="value => updateProp('clickPulse', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="cursorGrid" component-name="CursorGrid" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
import { cursorGrid } from '@/constants/code/Animations/cursorGridCode';
import CursorGrid from '@/content/Animations/CursorGrid/CursorGrid.vue';

type Highlight = 'area' | 'cell';
type GridStyle = 'lines' | 'dashed' | 'dots' | 'crosses';
type Falloff = 'smooth' | 'linear' | 'sharp';

const LOOK = {
  color: '#ffffff',
  gridColor: '#ffffff',
  highlight: 'area' as Highlight,
  gridStyle: 'lines' as GridStyle,
  falloff: 'smooth' as Falloff,
  cellSize: 60,
  radius: 140,
  holdTime: 400,
  fadeDuration: 800,
  lineWidth: 1,
  maxOpacity: 1,
  fillOpacity: 0.06,
  gridOpacity: 0.08,
  spotlight: 0.6,
  cellGap: 0,
  cellRadius: 0,
  pulseSpeed: 600,
  ambient: 0,
  edgeFade: 0.2
};

const DEFAULT_PROPS = {
  preset: 'minimal',
  ...LOOK,
  clickPulse: true,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  minimal: {},
  cell: { highlight: 'cell', fadeDuration: 1400, fillOpacity: 0.08 },
  tiles: {
    color: '#7dd3fc',
    highlight: 'cell',
    cellGap: 4,
    cellRadius: 10,
    fillOpacity: 0.14,
    gridOpacity: 0.05,
    fadeDuration: 1200
  },
  marks: { color: '#fbbf24', gridStyle: 'crosses', gridOpacity: 0.28, fillOpacity: 0.08, spotlight: 0.8 },
  dots: { gridStyle: 'dots', cellSize: 36, radius: 120, gridOpacity: 0.3, fillOpacity: 0.1 },
  dashed: { color: '#34d399', gridStyle: 'dashed', gridOpacity: 0.14, ambient: 0.5, fadeDuration: 1600 },
  classic: {
    color: '#7cff67',
    cellSize: 70,
    lineWidth: 1.2,
    fillOpacity: 0,
    gridOpacity: 0,
    spotlight: 0,
    edgeFade: 0
  }
};

const LIGHT_SWAP: Record<string, string> = {
  '#ffffff': '#18181b',
  '#7dd3fc': '#0284c7',
  '#fbbf24': '#d97706',
  '#34d399': '#059669',
  '#7cff67': '#1f9d45'
};

const DARK_SWAP: Record<string, string> = Object.fromEntries(
  Object.entries(LIGHT_SWAP).map(([dark, light]) => [light, dark])
);

const PRESET_OPTIONS = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'cell', label: 'Cell' },
  { value: 'tiles', label: 'Tiles' },
  { value: 'marks', label: 'Marks' },
  { value: 'dots', label: 'Dots' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'classic', label: 'Classic' }
];

const HIGHLIGHT_OPTIONS = [
  { value: 'area', label: 'Area' },
  { value: 'cell', label: 'Cell' }
];

const STYLE_OPTIONS = [
  { value: 'lines', label: 'Lines' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dots', label: 'Dots' },
  { value: 'crosses', label: 'Crosses' }
];

const FALLOFF_OPTIONS = [
  { value: 'smooth', label: 'Smooth' },
  { value: 'linear', label: 'Linear' },
  { value: 'sharp', label: 'Sharp' }
];

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of lit cells and pulses. Defaults to near black in light mode.'
  },
  {
    name: 'gridColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the grid lines. Defaults to near black in light mode.'
  },
  { name: 'cellSize', type: 'number', default: '60', description: 'Size of each grid cell, in px.' },
  {
    name: 'highlight',
    type: "'area' | 'cell'",
    default: "'area'",
    description: 'Light every cell within the radius around the cursor, or only the cell under it.'
  },
  {
    name: 'gridStyle',
    type: "'lines' | 'dashed' | 'dots' | 'crosses'",
    default: "'lines'",
    description: 'How the grid is drawn: solid lines, dashed lines, dots or plus marks where the lines meet.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '140',
    description: 'Reach of the cursor, in px, for both the lit area and the spotlight.'
  },
  {
    name: 'falloff',
    type: "'smooth' | 'linear' | 'sharp'",
    default: "'smooth'",
    description: 'How quickly cells dim toward the edge of the radius.'
  },
  { name: 'holdTime', type: 'number', default: '400', description: 'How long a cell stays lit before fading, in ms.' },
  {
    name: 'fadeDuration',
    type: 'number',
    default: '800',
    description: 'How long a lit cell takes to fade out, in ms.'
  },
  { name: 'lineWidth', type: 'number', default: '1', description: 'Width of the grid lines, in px.' },
  { name: 'maxOpacity', type: 'number', default: '1', description: 'Brightness of a fully lit cell outline.' },
  { name: 'fillOpacity', type: 'number', default: '0.06', description: 'Soft fill inside lit cells.' },
  {
    name: 'gridOpacity',
    type: 'number',
    default: '0.08',
    description: 'Opacity of the grid lines at rest. 0 shows only lit cells.'
  },
  {
    name: 'spotlight',
    type: 'number',
    default: '0.6',
    description: 'How much the grid lines brighten around the cursor, from 0 to 1.'
  },
  {
    name: 'cellGap',
    type: 'number',
    default: '0',
    description: 'Inset of lit cells, in px. Above 0, lit cells become separate tiles.'
  },
  { name: 'cellRadius', type: 'number', default: '0', description: 'Corner radius of lit tiles, in px.' },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ring of lit cells out from the click.'
  },
  { name: 'pulseSpeed', type: 'number', default: '600', description: 'Speed of the click ring, in px per second.' },
  {
    name: 'ambient',
    type: 'number',
    default: '0',
    description: 'Lets random cells glow softly on their own, from 0 to 1.'
  },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0.2',
    description: 'Fades the grid out toward the edges, from 0 to 0.5.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Draws the grid out from the center with a pulse on mount.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Uses near black lines and cells by default, for light pages.'
  },
  {
    name: 'default slot',
    type: 'slot',
    default: '-',
    description: 'Content drawn above the grid. The grid keeps reacting to the cursor underneath it.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');
const isLight = computed(() => theme.value === 'light');

const settings = computed(() => {
  const { preset: _preset, color: _color, gridColor: _gridColor, ...rest } = props.value;
  return rest;
});

const swap = computed(() => (isLight.value ? LIGHT_SWAP : DARK_SWAP));
const tone = computed(() => swap.value[props.value.color.toLowerCase()] ?? props.value.color);
const lines = computed(() => swap.value[props.value.gridColor.toLowerCase()] ?? props.value.gridColor);

const computedProps = computed(() => ({
  color: tone.value,
  gridColor: lines.value,
  ...(isLight.value ? { lightMode: true } : {})
}));

const applyPreset = (value: string | number) => {
  const key = String(value);
  updateProps({ ...LOOK, ...PRESETS[key], preset: key });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
