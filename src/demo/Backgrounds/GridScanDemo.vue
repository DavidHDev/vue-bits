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
          <GridScan :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Hold on, scanning for Angular users." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorPickerCustom
            title="Lines Color"
            :color="settings.linesColor"
            @change="(value: string) => updateProp('linesColor', value)"
          />
          <PreviewColorPickerCustom
            title="Scan Color"
            :color="settings.scanColor"
            @change="(value: string) => updateProp('scanColor', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Line Style"
            :options="STYLE_OPTIONS"
            :model-value="settings.lineStyle"
            @update:model-value="(value: string | number) => updateProp('lineStyle', value as LineStyle)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.scanDirection"
            @update:model-value="(value: string | number) => updateProp('scanDirection', value as ScanDirection)"
          />
          <PreviewSelect
            title="Click Effect"
            :options="CLICK_OPTIONS"
            :model-value="settings.clickEffect"
            @update:model-value="(value: string | number) => updateProp('clickEffect', value as ClickEffect)"
          />
          <PreviewSlider
            title="Cells"
            :min="3"
            :max="20"
            :step="1"
            :model-value="settings.cells"
            @update:model-value="(value: number) => updateProp('cells', value)"
          />
          <PreviewSlider
            title="Line Thickness"
            :min="0.5"
            :max="3"
            :step="0.1"
            value-unit="px"
            :model-value="settings.lineThickness"
            @update:model-value="(value: number) => updateProp('lineThickness', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="1"
            :max="10"
            :step="0.1"
            :model-value="settings.depth"
            @update:model-value="(value: number) => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Depth Fade"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.depthFade"
            @update:model-value="(value: number) => updateProp('depthFade', value)"
          />
          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.parallax"
            @update:model-value="(value: number) => updateProp('parallax', value)"
          />
          <PreviewSlider
            title="Shading"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.shading"
            @update:model-value="(value: number) => updateProp('shading', value)"
          />
          <PreviewSlider
            title="Reflection"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.reflection"
            @update:model-value="(value: number) => updateProp('reflection', value)"
          />
          <PreviewSlider
            title="Scan Duration"
            :min="0.5"
            :max="6"
            :step="0.1"
            value-unit="s"
            :model-value="settings.scanDuration"
            @update:model-value="(value: number) => updateProp('scanDuration', value)"
          />
          <PreviewSlider
            title="Scan Delay"
            :min="0"
            :max="6"
            :step="0.1"
            value-unit="s"
            :is-disabled="!settings.autoScan"
            :model-value="settings.scanDelay"
            @update:model-value="(value: number) => updateProp('scanDelay', value)"
          />
          <PreviewSlider
            title="Scan Width"
            :min="0.2"
            :max="5"
            :step="0.1"
            :model-value="settings.scanWidth"
            @update:model-value="(value: number) => updateProp('scanWidth', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.trail"
            @update:model-value="(value: number) => updateProp('trail', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1.5"
            :step="0.01"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSwitch
            title="Points"
            :model-value="settings.points"
            @update:model-value="(value: boolean) => updateProp('points', value)"
          />
          <PreviewSwitch
            title="Auto Scan"
            :model-value="settings.autoScan"
            @update:model-value="(value: boolean) => updateProp('autoScan', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="(value: boolean) => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Webcam"
            :model-value="settings.enableWebcam"
            @update:model-value="(value: boolean) => updateProp('enableWebcam', value)"
          />
          <PreviewSwitch
            title="Camera Preview"
            :is-disabled="!settings.enableWebcam"
            :model-value="settings.showPreview"
            @update:model-value="(value: boolean) => updateProp('showPreview', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="(value: boolean) => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="(value: boolean) => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="gridScan" component-name="GridScan" />
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
import { gridScan } from '@/constants/code/Backgrounds/gridScanCode';
import GridScan, {
  type GridScanClickEffect as ClickEffect,
  type GridScanDirection as ScanDirection,
  type GridScanLineStyle as LineStyle
} from '@/content/Backgrounds/GridScan/GridScan.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/GridScan';

const STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' }
];

const DIRECTION_OPTIONS = [
  { value: 'forward', label: 'Forward' },
  { value: 'backward', label: 'Backward' },
  { value: 'pingpong', label: 'Ping Pong' }
];

const CLICK_OPTIONS = [
  { value: 'ping', label: 'Ping' },
  { value: 'scan', label: 'Scan' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  {
    name: 'linesColor',
    type: 'string',
    default: "'#4a4f4b'",
    description: 'Color of the grid lines. Light mode defaults to a pale gray.'
  },
  {
    name: 'scanColor',
    type: 'string',
    default: "'#7dd3fc'",
    description: 'Color of the scan, its trail, the points and the click ping. Light mode defaults to a deeper blue.'
  },
  { name: 'cells', type: 'number', default: '8', description: 'Number of grid cells from the floor to the ceiling.' },
  { name: 'lineThickness', type: 'number', default: '1', description: 'Thickness of the grid lines in pixels.' },
  {
    name: 'lineStyle',
    type: "'solid' | 'dashed' | 'dotted'",
    default: "'solid'",
    description: 'Style of the grid lines.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '3',
    description: 'How deep the room goes, relative to its height. High values turn it into a long corridor.'
  },
  {
    name: 'depthFade',
    type: 'number',
    default: '0.6',
    description: 'How much the room fades into the distance, from 0 (evenly bright) to 1 (gone by the back wall).'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '1',
    description:
      'How far the view shifts as the cursor moves, as if you were moving your head in front of a window. 0 keeps it still.'
  },
  {
    name: 'shading',
    type: 'number',
    default: '0.7',
    description: 'Soft light and corner shadows on the walls, from 0 (pure wireframe) to 1.'
  },
  {
    name: 'reflection',
    type: 'number',
    default: '0.35',
    description: 'How much the glossy floor reflects the scan and pings, from 0 to 1.'
  },
  {
    name: 'points',
    type: 'boolean',
    default: 'true',
    description: 'Scatters points over the walls that sparkle as the scan passes, like a LiDAR capture.'
  },
  {
    name: 'scanDirection',
    type: "'forward' | 'backward' | 'pingpong'",
    default: "'forward'",
    description: 'Whether the scan travels into the room, out of it, or alternates.'
  },
  { name: 'scanDuration', type: 'number', default: '2.4', description: 'Seconds each scan takes to cross the room.' },
  { name: 'scanDelay', type: 'number', default: '1.6', description: 'Seconds between scans.' },
  { name: 'scanWidth', type: 'number', default: '1', description: 'Thickness of the scan line, from 0.2 to 5.' },
  {
    name: 'trail',
    type: 'number',
    default: '0.5',
    description: 'How long the walls keep glowing behind the scan, from 0 to 1.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0.6',
    description: 'Bloom around the scan line and points, from 0 to 1.5.'
  },
  {
    name: 'autoScan',
    type: 'boolean',
    default: 'true',
    description: 'Runs scans on a loop. Turn it off to scan only on click.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Moves the view with the cursor and lights up the walls under it.'
  },
  {
    name: 'clickEffect',
    type: "'ping' | 'scan' | 'none'",
    default: "'ping'",
    description:
      'What a click does. Ping sends a ring of light across the walls from that spot, scan starts a new scan.'
  },
  {
    name: 'enableWebcam',
    type: 'boolean',
    default: 'false',
    description:
      'Moves the view with your head through the webcam. The face tracker is loaded from a CDN the first time it turns on.'
  },
  {
    name: 'showPreview',
    type: 'boolean',
    default: 'false',
    description: 'Shows a small camera preview with the tracking status while the webcam is on.'
  },
  {
    name: 'modelsPath',
    type: 'string',
    default: 'CDN URL',
    description: 'Where the face tracking model is loaded from. Point it at your own copy to self-host.'
  },
  {
    name: 'enableGyro',
    type: 'boolean',
    default: 'false',
    description: 'Moves the view as a phone or tablet tilts. iOS asks for permission on the first tap.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Reveals the room with a first scan on mount.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Renders a bright room with dark shading for light backgrounds.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
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
</script>
