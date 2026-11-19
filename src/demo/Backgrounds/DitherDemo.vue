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
          <Dither :key="rerenderKey" v-bind="settings" :palette="paletteActive ? settings.palette : undefined" />
          <BackgroundContent headline="Retro dithered waves to enhance your UI" />
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
            title="Wave Color"
            :color="settings.waveColor"
            @change="(value: string) => updateProp('waveColor', value)"
          />
          <PreviewColorPickerCustom
            title="Background"
            :color="settings.backgroundColor"
            @change="(value: string) => updateProp('backgroundColor', value)"
          />
          <PreviewSelect
            title="Palette"
            :options="PALETTE_OPTIONS"
            :model-value="paletteName(settings.palette)"
            @update:model-value="(value: string | number) => updateProp('palette', PALETTES[String(value)] ?? [])"
          />
          <PreviewSelect
            title="Dither Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.ditherMode"
            @update:model-value="(value: string | number) => updateProp('ditherMode', value as DitherMode)"
          />
          <PreviewSlider
            title="Pixel Size"
            :min="1"
            :max="8"
            :step="1"
            value-unit="px"
            :model-value="settings.pixelSize"
            @update:model-value="(value: number) => updateProp('pixelSize', value)"
          />
          <PreviewSlider
            title="Colors"
            :min="2"
            :max="16"
            :step="1"
            :is-disabled="paletteActive"
            :model-value="settings.colorNum"
            @update:model-value="(value: number) => updateProp('colorNum', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Wave Speed"
            :min="0"
            :max="0.2"
            :step="0.005"
            :is-disabled="settings.disableAnimation"
            :model-value="settings.waveSpeed"
            @update:model-value="(value: number) => updateProp('waveSpeed', value)"
          />
          <PreviewSlider
            title="Wave Frequency"
            :min="1"
            :max="8"
            :step="0.1"
            :model-value="settings.waveFrequency"
            @update:model-value="(value: number) => updateProp('waveFrequency', value)"
          />
          <PreviewSlider
            title="Wave Amplitude"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.waveAmplitude"
            @update:model-value="(value: number) => updateProp('waveAmplitude', value)"
          />
          <PreviewSlider
            title="Contrast"
            :min="0.5"
            :max="2.5"
            :step="0.05"
            :model-value="settings.contrast"
            @update:model-value="(value: number) => updateProp('contrast', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="-0.5"
            :max="0.5"
            :step="0.01"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSelect
            title="Mouse Effect"
            :options="EFFECT_OPTIONS"
            :model-value="settings.mouseEffect"
            @update:model-value="(value: string | number) => updateProp('mouseEffect', value as DitherMouseEffect)"
          />
          <PreviewSlider
            title="Mouse Radius"
            :min="0.05"
            :max="1"
            :step="0.01"
            :is-disabled="!settings.enableMouseInteraction"
            :model-value="settings.mouseRadius"
            @update:model-value="(value: number) => updateProp('mouseRadius', value)"
          />
          <PreviewSlider
            title="Mouse Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :is-disabled="!settings.enableMouseInteraction"
            :model-value="settings.mouseStrength"
            @update:model-value="(value: number) => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0"
            :max="1"
            :step="0.05"
            :is-disabled="!settings.enableMouseInteraction"
            :model-value="settings.trail"
            @update:model-value="(value: number) => updateProp('trail', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.enableMouseInteraction"
            @update:model-value="(value: boolean) => updateProp('enableMouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Ripple"
            :model-value="settings.clickRipple"
            @update:model-value="(value: boolean) => updateProp('clickRipple', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="(value: boolean) => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Disable Animation"
            :model-value="settings.disableAnimation"
            @update:model-value="(value: boolean) => updateProp('disableAnimation', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="dither" component-name="Dither" />
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
import { dither } from '@/constants/code/Backgrounds/ditherCode';
import Dither from '@/content/Backgrounds/Dither/Dither.vue';
import { DEFAULT_PROPS, PALETTES, PRESET_OPTIONS, presetProps } from './presets/Dither';

type DitherMode = 'bayer' | 'bayer4' | 'bayer2' | 'halftone' | 'lines' | 'crosshatch' | 'noise' | 'none';
type DitherMouseEffect = 'erase' | 'reveal' | 'ripple';

const PALETTE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'gameboy', label: 'Game Boy' },
  { value: 'amber', label: 'Amber' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'ice', label: 'Ice' },
  { value: 'blueprint', label: 'Blueprint' }
];

const MODE_OPTIONS = [
  { value: 'bayer', label: 'Bayer 8×8' },
  { value: 'bayer4', label: 'Bayer 4×4' },
  { value: 'bayer2', label: 'Bayer 2×2' },
  { value: 'halftone', label: 'Halftone' },
  { value: 'lines', label: 'Lines' },
  { value: 'crosshatch', label: 'Crosshatch' },
  { value: 'noise', label: 'Noise' },
  { value: 'none', label: 'None' }
];

const EFFECT_OPTIONS = [
  { value: 'erase', label: 'Erase' },
  { value: 'reveal', label: 'Reveal' },
  { value: 'ripple', label: 'Ripple' }
];

const propData: PropRow[] = [
  {
    name: 'waveColor',
    type: 'string | [number, number, number]',
    default: '[0.5, 0.5, 0.5]',
    description: 'Color of the waves. Accepts any CSS color, or a linear RGB array from 0 to 1.'
  },
  {
    name: 'backgroundColor',
    type: 'string | [number, number, number]',
    default: '[0, 0, 0]',
    description: "Color behind the waves. Use 'transparent' to dither the waves over your own background."
  },
  {
    name: 'ditherMode',
    type: "'bayer' | 'bayer4' | 'bayer2' | 'halftone' | 'lines' | 'crosshatch' | 'noise' | 'none'",
    default: "'bayer'",
    description: 'Pattern used to dither the shades.'
  },
  {
    name: 'palette',
    type: 'string[]',
    default: '-',
    description:
      'Two to eight colors from dark to light. Replaces the wave and background colors with an indexed palette.'
  },
  { name: 'colorNum', type: 'number', default: '4', description: 'Number of shades per color channel.' },
  { name: 'pixelSize', type: 'number', default: '2', description: 'Size of each dither pixel, in px.' },
  { name: 'scale', type: 'number', default: '1', description: 'Size of the wave pattern.' },
  { name: 'waveSpeed', type: 'number', default: '0.05', description: 'Speed of the wave animation.' },
  { name: 'waveFrequency', type: 'number', default: '3', description: 'How much finer each layer of detail gets.' },
  {
    name: 'waveAmplitude',
    type: 'number',
    default: '0.3',
    description: 'How strongly the finer layers of detail show.'
  },
  { name: 'contrast', type: 'number', default: '1', description: 'Contrast of the waves before dithering.' },
  { name: 'brightness', type: 'number', default: '0', description: 'Brightens or darkens the waves.' },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Lets the cursor interact with the waves.'
  },
  {
    name: 'mouseEffect',
    type: "'erase' | 'reveal' | 'ripple'",
    default: "'erase'",
    description: 'Erase darkens the waves under the cursor, reveal lights them up and ripple bends them.'
  },
  { name: 'mouseRadius', type: 'number', default: '1', description: 'Radius of the cursor effect.' },
  { name: 'mouseStrength', type: 'number', default: '1', description: 'Strength of the cursor effect.' },
  {
    name: 'trail',
    type: 'number',
    default: '0.5',
    description: 'How long the cursor leaves a fading trail, from 0 to 1.'
  },
  { name: 'clickRipple', type: 'boolean', default: 'true', description: 'Clicking sends a ring through the waves.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Resolves from chunky pixels to full detail on mount.'
  },
  { name: 'disableAnimation', type: 'boolean', default: 'false', description: 'Freezes the wave animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const paletteName = (palette?: string[]) =>
  Object.keys(PALETTES).find(name => PALETTES[name].join(',') === (palette ?? []).join(',')) ?? 'none';

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const { isLight } = useColorMode();

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const paletteActive = computed(() => (settings.value.palette?.length ?? 0) > 1);

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: isLight.value, defaults: defaultProps.value }), preset: value });
};
</script>
