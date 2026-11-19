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
          <Radar :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Catch every signal on the first sweep." />
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
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.mode"
            @update:model-value="(value: string | number) => updateProp('mode', value as RadarMode)"
          />
          <PreviewSlider
            title="Speed"
            :min="-2"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0.05"
            :max="1"
            :step="0.01"
            :model-value="settings.trail"
            @update:model-value="(value: number) => updateProp('trail', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.3"
            :max="2.5"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Ring Count"
            :min="1"
            :max="16"
            :step="1"
            :model-value="settings.ringCount"
            @update:model-value="(value: number) => updateProp('ringCount', value)"
          />
          <PreviewSlider
            title="Spoke Count"
            :min="0"
            :max="36"
            :step="1"
            :model-value="settings.spokeCount"
            @update:model-value="(value: number) => updateProp('spokeCount', value)"
          />
          <PreviewSlider
            title="Targets"
            :min="0"
            :max="16"
            :step="1"
            :model-value="settings.targets"
            @update:model-value="(value: number) => updateProp('targets', value)"
          />
          <PreviewSlider
            title="Clutter"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.clutter"
            @update:model-value="(value: number) => updateProp('clutter', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
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
            title="Grid Opacity"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.gridOpacity"
            @update:model-value="(value: number) => updateProp('gridOpacity', value)"
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
            title="Tilt"
            :min="0"
            :max="75"
            :step="1"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="(value: number) => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Center X"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.centerX"
            @update:model-value="(value: number) => updateProp('centerX', value)"
          />
          <PreviewSlider
            title="Center Y"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.centerY"
            @update:model-value="(value: number) => updateProp('centerY', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.15"
            :step="0.01"
            :model-value="settings.grain"
            @update:model-value="(value: number) => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.opacity"
            @update:model-value="(value: number) => updateProp('opacity', value)"
          />
          <PreviewSwitch
            title="Ticks"
            :model-value="settings.ticks"
            @update:model-value="(value: boolean) => updateProp('ticks', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
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
        <CodeExample :code-object="radar" component-name="Radar" />
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
import { radar } from '@/constants/code/Backgrounds/radarCode';
import Radar from '@/content/Backgrounds/Radar/Radar.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Radar';

type RadarMode = 'sweep' | 'pulse';

const MODE_OPTIONS = [
  { value: 'sweep', label: 'Sweep' },
  { value: 'pulse', label: 'Pulse' }
];

const propData: PropRow[] = [
  { name: 'color', type: 'string', default: "'#3ef09a'", description: 'Color of the sweep and the contacts.' },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Fills the canvas behind the radar. Leave it transparent to let the page show through.'
  },
  {
    name: 'mode',
    type: "'sweep' | 'pulse'",
    default: "'sweep'",
    description: 'A rotating beam, or sonar rings that expand from the center.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Speed of the sweep. Negative values sweep counterclockwise.'
  },
  {
    name: 'trail',
    type: 'number',
    default: '0.35',
    description: 'How long the afterglow lingers behind the sweep, from 0 to 1.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '0.9',
    description: 'Size of the radar, relative to the shorter side of the view.'
  },
  { name: 'ringCount', type: 'number', default: '6', description: 'Number of range rings.' },
  { name: 'spokeCount', type: 'number', default: '12', description: 'Number of faint bearing lines. 0 hides them.' },
  { name: 'ticks', type: 'boolean', default: 'true', description: 'Shows the bearing scale around the edge.' },
  {
    name: 'targets',
    type: 'number',
    default: '6',
    description: 'Number of moving contacts the sweep picks up, up to 16.'
  },
  {
    name: 'clutter',
    type: 'number',
    default: '0.35',
    description: 'Amount of speckled returns the sweep lights up, from 0 to 1.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '1',
    description: 'Strength of the soft light around the beam and contacts.'
  },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness.' },
  {
    name: 'gridOpacity',
    type: 'number',
    default: '1',
    description: 'Opacity of the rings, ticks and lines, from 0 to 2.'
  },
  { name: 'lineWidth', type: 'number', default: '1', description: 'Width of the grid lines in px.' },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description: 'Tilts the radar back in perspective like a floor, in degrees.'
  },
  {
    name: 'centerX',
    type: 'number',
    default: '0.5',
    description: 'Horizontal position of the radar center, from 0 to 1.'
  },
  {
    name: 'centerY',
    type: 'number',
    default: '0.5',
    description: 'Vertical position of the radar center, from 0 at the top to 1 at the bottom.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Lights up the grid near the cursor, and the sweep picks the cursor up as a contact.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Draws the rings in and starts the sweep on mount.' },
  { name: 'grain', type: 'number', default: '0.03', description: 'Strength of the film grain.' },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the radar as ink for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({
    ...presetProps(value, { light: theme.value === 'light', defaults: defaultProps.value }),
    preset: value
  });
};
</script>
