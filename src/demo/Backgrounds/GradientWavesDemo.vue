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
          <GradientWaves :key="rerenderKey" v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="Soft rolling gradient waves fading into haze." />
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
            title="Horizon Color"
            :color="settings.horizonColor"
            @change="(value: string) => updateProp('horizonColor', value)"
          />
          <PreviewColorPickerCustom
            title="Wave Color"
            :color="settings.waveColor"
            @change="(value: string) => updateProp('waveColor', value)"
          />
          <PreviewColorPickerCustom
            title="Crest Color"
            :color="settings.crestColor"
            @change="(value: string) => updateProp('crestColor', value)"
          />
          <PreviewSelect
            title="Quality"
            :options="QUALITY_OPTIONS"
            :model-value="settings.quality"
            @update:model-value="value => updateProp('quality', value as Quality)"
          />
          <PreviewSlider
            v-for="slider in SLIDERS"
            :key="slider.name"
            :title="slider.title"
            :min="slider.min"
            :max="slider.max"
            :step="slider.step"
            :value-unit="slider.unit"
            :is-disabled="slider.cursor ? !settings.mouseInteraction : false"
            :model-value="settings[slider.name]"
            @update:model-value="value => updateProp(slider.name, value)"
          />
          <PreviewSwitch
            v-for="toggle in SWITCHES"
            :key="toggle.name"
            :title="toggle.title"
            :model-value="settings[toggle.name]"
            @update:model-value="value => updateProp(toggle.name, value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="gradientWaves" component-name="GradientWaves" />
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
import { gradientWaves } from '@/constants/code/Backgrounds/gradientWavesCode';
import GradientWaves from '@/content/Backgrounds/GradientWaves/GradientWaves.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/GradientWaves';

type Quality = 'low' | 'medium' | 'high';
type SliderName =
  | 'speed'
  | 'amplitude'
  | 'waveScale'
  | 'waveRatio'
  | 'swell'
  | 'turbulence'
  | 'tilt'
  | 'zoom'
  | 'height'
  | 'fogDepth'
  | 'relief'
  | 'lightAngle'
  | 'sheen'
  | 'brightness'
  | 'opacity'
  | 'grain'
  | 'parallaxStrength'
  | 'mouseStrength';
type SwitchName = 'intro' | 'mouseInteraction' | 'swellOnClick' | 'lightMode' | 'paused';

const QUALITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const SLIDERS: {
  name: SliderName;
  title: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  cursor?: boolean;
}[] = [
  { name: 'speed', title: 'Speed', min: 0, max: 1.5, step: 0.01 },
  { name: 'amplitude', title: 'Amplitude', min: 0, max: 5, step: 0.05 },
  { name: 'waveScale', title: 'Wave Scale', min: 0.3, max: 2, step: 0.01 },
  { name: 'waveRatio', title: 'Wave Ratio', min: 0.3, max: 2, step: 0.01 },
  { name: 'swell', title: 'Swell', min: 0, max: 40, step: 0.5 },
  { name: 'turbulence', title: 'Turbulence', min: 0, max: 40, step: 0.5 },
  { name: 'tilt', title: 'Tilt', min: 30, max: 80, step: 1, unit: '°' },
  { name: 'zoom', title: 'Zoom', min: 0.6, max: 1.6, step: 0.01 },
  { name: 'height', title: 'Height', min: 2, max: 10, step: 0.1 },
  { name: 'fogDepth', title: 'Fog Depth', min: 5, max: 40, step: 0.5 },
  { name: 'relief', title: 'Relief', min: 0, max: 1, step: 0.01 },
  { name: 'lightAngle', title: 'Light Angle', min: -180, max: 180, step: 1, unit: '°' },
  { name: 'sheen', title: 'Sheen', min: 0, max: 1, step: 0.01 },
  { name: 'brightness', title: 'Brightness', min: 0.4, max: 1.6, step: 0.01 },
  { name: 'opacity', title: 'Opacity', min: 0, max: 1, step: 0.01 },
  { name: 'grain', title: 'Grain', min: 0, max: 0.5, step: 0.01 },
  { name: 'parallaxStrength', title: 'Parallax', min: 0, max: 1, step: 0.01, cursor: true },
  { name: 'mouseStrength', title: 'Light Follow', min: 0, max: 1, step: 0.01, cursor: true }
];

const SWITCHES: { name: SwitchName; title: string }[] = [
  { name: 'intro', title: 'Intro' },
  { name: 'mouseInteraction', title: 'Cursor' },
  { name: 'swellOnClick', title: 'Swell on Click' },
  { name: 'lightMode', title: 'Light Mode' },
  { name: 'paused', title: 'Pause' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { isLight } = useColorMode();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return { ...rest, quality: rest.quality as Quality };
});

const applyPreset = (value: string | number) => {
  updateProps({ ...presetProps(String(value), { light: isLight.value }), preset: String(value) });
};

const propData: PropRow[] = [
  {
    name: 'horizonColor',
    type: 'string',
    default: "'#42b883'",
    description: 'Haze the waves fade into toward the horizon, and the tint of their shadows.'
  },
  { name: 'waveColor', type: 'string', default: "'#a0ffbc'", description: 'Main color of the wave bodies.' },
  {
    name: 'crestColor',
    type: 'string',
    default: "'#FFFFFF'",
    description: 'Color of the crests and the light they catch.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Fills the canvas behind the waves. Transparent lets the page show through.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the waves as soft colored ink for light pages.'
  },
  { name: 'speed', type: 'number', default: '0.4', description: 'How fast the waves roll in.' },
  { name: 'amplitude', type: 'number', default: '2.5', description: 'Height of the waves.' },
  {
    name: 'waveScale',
    type: 'number',
    default: '0.6',
    description: 'How many waves fit in view. Higher is choppier.'
  },
  {
    name: 'waveRatio',
    type: 'number',
    default: '0.9',
    description: 'Balance between the long rolling waves and the shorter cross waves.'
  },
  { name: 'swell', type: 'number', default: '35', description: 'How much the long waves bend and meander.' },
  { name: 'turbulence', type: 'number', default: '20', description: 'How much the cross waves wander.' },
  {
    name: 'tilt',
    type: 'number',
    default: '64',
    description: 'Camera angle in degrees, from looking down to facing the horizon.'
  },
  { name: 'zoom', type: 'number', default: '1', description: 'Field of view. Higher zooms in.' },
  { name: 'height', type: 'number', default: '5.5', description: 'Water level. Higher brings the waves closer.' },
  { name: 'fogDepth', type: 'number', default: '15', description: 'How far you can see before the waves fade out.' },
  {
    name: 'relief',
    type: 'number',
    default: '1',
    description: 'Depth of the light and shadow on the waves. 0 gives flat gradient waves.'
  },
  {
    name: 'lightAngle',
    type: 'number',
    default: '120',
    description: 'Direction the light comes from, in degrees. 0 lights the waves from behind you, 180 from the horizon.'
  },
  { name: 'sheen', type: 'number', default: '0', description: 'Strength of a soft highlight on the crests.' },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  { name: 'grain', type: 'number', default: '0.2', description: 'Film grain on the waves, up to 0.5. 0 turns it off.' },
  {
    name: 'quality',
    type: "'low' | 'medium' | 'high'",
    default: "'medium'",
    description: 'Rendering precision. Lower is faster on weak devices.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Starts from calm water and lets the waves rise from the horizon toward you.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The light follows the cursor across the waves and the view turns gently toward it.'
  },
  {
    name: 'parallaxStrength',
    type: 'number',
    default: '0.5',
    description: 'How far the view turns toward the cursor.'
  },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '0.6',
    description: 'How far the light turns to follow the cursor.'
  },
  {
    name: 'swellOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a swell rolling in from that point.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the waves.' },
  { name: 'dpr', type: 'number', default: '2', description: 'Maximum device pixel ratio of the canvas.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
