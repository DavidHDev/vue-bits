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
          <LineWaves :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Lines that flow like silk." />
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
            v-for="color in COLORS"
            :key="color.name"
            :title="color.title"
            :color="settings[color.name]"
            @change="(value: string) => updateProp(color.name, value)"
          />
          <PreviewSlider
            v-for="slider in SLIDERS"
            :key="slider.name"
            :title="slider.title"
            :min="slider.min"
            :max="slider.max"
            :step="slider.step"
            :value-unit="slider.unit"
            :model-value="settings[slider.name]"
            @update:model-value="value => updateProp(slider.name, value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.enableMouseInteraction"
            @update:model-value="value => updateProp('enableMouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Ripple"
            :model-value="settings.clickRipple"
            @update:model-value="value => updateProp('clickRipple', value)"
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
        <CodeExample :code-object="lineWaves" component-name="LineWaves" />
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
import { lineWaves } from '@/constants/code/Backgrounds/lineWavesCode';
import LineWaves from '@/content/Backgrounds/LineWaves/LineWaves.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/LineWaves';

type ColorName = 'color1' | 'color2' | 'color3';
type SliderName =
  | 'colorCycleSpeed'
  | 'speed'
  | 'lineCount'
  | 'lineWidth'
  | 'glow'
  | 'brightness'
  | 'highlight'
  | 'highlightWidth'
  | 'warpIntensity'
  | 'warpScale'
  | 'rotation'
  | 'edgeFade'
  | 'mouseInfluence'
  | 'opacity';

const COLORS: { name: ColorName; title: string }[] = [
  { name: 'color1', title: 'Color 1' },
  { name: 'color2', title: 'Color 2' },
  { name: 'color3', title: 'Color 3' }
];

const SLIDERS: { name: SliderName; title: string; min: number; max: number; step: number; unit?: string }[] = [
  { name: 'colorCycleSpeed', title: 'Color Cycle Speed', min: 0, max: 5, step: 0.1 },
  { name: 'speed', title: 'Speed', min: 0, max: 1.5, step: 0.01 },
  { name: 'lineCount', title: 'Line Count', min: 12, max: 160, step: 1 },
  { name: 'lineWidth', title: 'Line Width', min: 0.5, max: 4, step: 0.05, unit: 'px' },
  { name: 'glow', title: 'Glow', min: 0, max: 2, step: 0.05 },
  { name: 'brightness', title: 'Brightness', min: 0.2, max: 2, step: 0.05 },
  { name: 'highlight', title: 'Highlight', min: 0, max: 1, step: 0.01 },
  { name: 'highlightWidth', title: 'Highlight Width', min: 0.4, max: 3, step: 0.05 },
  { name: 'warpIntensity', title: 'Warp Intensity', min: 0, max: 2.5, step: 0.05 },
  { name: 'warpScale', title: 'Warp Scale', min: 0.4, max: 2.5, step: 0.05 },
  { name: 'rotation', title: 'Rotation', min: -180, max: 180, step: 1, unit: '°' },
  { name: 'edgeFade', title: 'Edge Fade', min: 0, max: 1, step: 0.01 },
  { name: 'mouseInfluence', title: 'Mouse Influence', min: 0, max: 3, step: 0.05 },
  { name: 'opacity', title: 'Opacity', min: 0, max: 1, step: 0.01 }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string | number) => {
  const preset = String(value);
  updateProps({ ...presetProps(preset, { defaults: defaultProps.value }), preset });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  { name: 'color1', type: 'string', default: "'#ffffff'", description: 'First color the lines blend through.' },
  { name: 'color2', type: 'string', default: "'#ffffff'", description: 'Second color the lines blend through.' },
  { name: 'color3', type: 'string', default: "'#ffffff'", description: 'Third color the lines blend through.' },
  {
    name: 'colorCycleSpeed',
    type: 'number',
    default: '1',
    description: 'How fast the colors drift across the lines. 0 keeps them in place.'
  },
  { name: 'speed', type: 'number', default: '0.3', description: 'How fast the waves flow. 0 freezes them.' },
  {
    name: 'lineCount',
    type: 'number',
    default: '72',
    description: 'Number of lines across the height of the container.'
  },
  { name: 'lineWidth', type: 'number', default: '1.3', description: 'Thickness of the lines, in px.' },
  { name: 'glow', type: 'number', default: '0.6', description: 'Strength of the soft glow around each line.' },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness of the lines.' },
  {
    name: 'highlight',
    type: 'number',
    default: '1',
    description:
      'Strength of the band of light that drifts through the lines, from 0 to 1. At 0 every line is lit evenly.'
  },
  {
    name: 'highlightWidth',
    type: 'number',
    default: '1',
    description: 'Width of the band of light. Higher values light more lines at once.'
  },
  { name: 'warpIntensity', type: 'number', default: '1', description: 'How strongly the lines bend into waves.' },
  {
    name: 'warpScale',
    type: 'number',
    default: '1',
    description: 'Size of the waves. Higher values give broad, sweeping curves.'
  },
  { name: 'rotation', type: 'number', default: '-33', description: 'Angle of the lines, in degrees.' },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0',
    description: 'Fades the lines out toward the edges of the container, from 0 to 1.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The lines spread apart and light up around the cursor.'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '2',
    description: 'How strongly the lines react to the cursor.'
  },
  {
    name: 'clickRipple',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a smooth wave rolling out through the lines.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'The lines draw in across the container on mount.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the lines as ink for light backgrounds. Colors turn into deeper inks of the same hue.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall opacity, from 0 to 1.' },
  {
    name: 'maxDevicePixelRatio',
    type: 'number',
    default: '2',
    description: 'Highest pixel ratio the canvas renders at.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
