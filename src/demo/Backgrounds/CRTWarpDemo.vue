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
          <CRTWarp :key="rerenderKey" v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="Make every pixel pulse" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Phosphor Color"
            :color="settings.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Background"
            :color="settings.backgroundColor"
            @change="(value: string) => updateProp('backgroundColor', value)"
          />
          <PreviewSelect
            title="Mask"
            :options="MASK_OPTIONS"
            :model-value="settings.mask"
            @update:model-value="value => updateProp('mask', value as CRTWarpMask)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Variation"
            :min="0"
            :max="24"
            :step="1"
            :model-value="settings.variation"
            @update:model-value="value => updateProp('variation', value)"
          />
          <PreviewSlider
            title="Wave Amount"
            :min="0.05"
            :max="1"
            :step="0.01"
            :model-value="settings.waveAmplitude"
            @update:model-value="value => updateProp('waveAmplitude', value)"
          />
          <PreviewSlider
            title="Wave Density"
            :min="0.5"
            :max="6"
            :step="0.1"
            :model-value="settings.waveFrequency"
            @update:model-value="value => updateProp('waveFrequency', value)"
          />
          <PreviewSlider
            title="Levels"
            :min="2"
            :max="8"
            :step="1"
            :model-value="settings.levels"
            @update:model-value="value => updateProp('levels', value)"
          />
          <PreviewSlider
            title="Columns"
            :min="24"
            :max="200"
            :step="1"
            :model-value="settings.columns"
            @update:model-value="value => updateProp('columns', value)"
          />
          <PreviewSlider
            title="Persistence"
            :min="0"
            :max="0.95"
            :step="0.01"
            :model-value="settings.persistence"
            @update:model-value="value => updateProp('persistence', value)"
          />
          <PreviewSlider
            title="Curvature"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.curvature"
            @update:model-value="value => updateProp('curvature', value)"
          />
          <PreviewSlider
            title="Corners"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.corners"
            @update:model-value="value => updateProp('corners', value)"
          />
          <PreviewSlider
            title="Scanlines"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.scanlineStrength"
            @update:model-value="value => updateProp('scanlineStrength', value)"
          />
          <PreviewSlider
            title="Scanline Density"
            :min="80"
            :max="480"
            :step="5"
            :model-value="settings.scanlineFrequency"
            @update:model-value="value => updateProp('scanlineFrequency', value)"
          />
          <PreviewSlider
            title="Mask Strength"
            :min="0"
            :max="1"
            :step="0.01"
            :is-disabled="settings.mask === 'none'"
            :model-value="settings.maskStrength"
            @update:model-value="value => updateProp('maskStrength', value)"
          />
          <PreviewSlider
            title="Bloom"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.bloom"
            @update:model-value="value => updateProp('bloom', value)"
          />
          <PreviewSlider
            title="Bloom Radius"
            :min="0.2"
            :max="3"
            :step="0.05"
            :model-value="settings.bloomRadius"
            @update:model-value="value => updateProp('bloomRadius', value)"
          />
          <PreviewSlider
            title="RGB Shift"
            :min="0"
            :max="0.015"
            :step="0.0005"
            :model-value="settings.rgbShift"
            @update:model-value="value => updateProp('rgbShift', value)"
          />
          <PreviewSlider
            title="Noise"
            :min="0"
            :max="0.3"
            :step="0.01"
            :model-value="settings.noise"
            @update:model-value="value => updateProp('noise', value)"
          />
          <PreviewSlider
            title="Flicker"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.flicker"
            @update:model-value="value => updateProp('flicker', value)"
          />
          <PreviewSlider
            title="Interference"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.interference"
            @update:model-value="value => updateProp('interference', value)"
          />
          <PreviewSlider
            title="Vignette"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.vignette"
            @update:model-value="value => updateProp('vignette', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.4"
            :max="2"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="value => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Magnet Strength"
            :min="0"
            :max="1.5"
            :step="0.05"
            :is-disabled="!settings.mouseReact"
            :model-value="settings.mouseStrength"
            @update:model-value="value => updateProp('mouseStrength', value)"
          />
          <PreviewSelect
            title="Render Quality"
            :options="QUALITY_OPTIONS"
            :model-value="settings.dpr"
            @update:model-value="value => updateProp('dpr', value as number)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Magnet"
            :model-value="settings.mouseReact"
            @update:model-value="value => updateProp('mouseReact', value)"
          />
          <PreviewSwitch
            title="Channel Flip"
            :model-value="settings.changeOnClick"
            @update:model-value="value => updateProp('changeOnClick', value)"
          />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="value => updateProp('lightMode', value)"
          />
          <PreviewSwitch
            title="Pause"
            :model-value="settings.paused"
            @update:model-value="value => updateProp('paused', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="cRTWarp" component-name="CRTWarp" />
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
import { cRTWarp } from '@/constants/code/Backgrounds/cRTWarpCode';
import CRTWarp from '@/content/Backgrounds/CRTWarp/CRTWarp.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps, type CRTWarpMask } from './presets/CRTWarp';

const MASK_OPTIONS = [
  { value: 'aperture', label: 'Aperture Grille' },
  { value: 'shadow', label: 'Shadow Mask' },
  { value: 'slot', label: 'Slot Mask' },
  { value: 'none', label: 'None' }
];

const QUALITY_OPTIONS = [
  { value: 1, label: 'Performance' },
  { value: 1.5, label: 'Balanced' },
  { value: 2, label: 'Sharp' }
];

const propData: PropRow[] = [
  { name: 'color', type: 'string', default: "'#7cff67'", description: 'Phosphor color of the picture.' },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'#111111'",
    description: "Color of the dark tube behind the picture. Use 'transparent' to let the page show through."
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Prints the picture as ink on a light background instead of glowing phosphor.'
  },
  {
    name: 'mask',
    type: "'aperture' | 'shadow' | 'slot' | 'none'",
    default: "'aperture'",
    description: 'The phosphor pattern of the tube: vertical stripes, dot triads, slots, or a plain mono tube.'
  },
  { name: 'speed', type: 'number', default: '0.5', description: 'How fast the plasma flows.' },
  {
    name: 'variation',
    type: 'number',
    default: '0',
    description: 'Picks a different plasma pattern. Each whole number is a new one.'
  },
  { name: 'waveAmplitude', type: 'number', default: '0.3', description: 'How tightly the plasma folds into bands.' },
  { name: 'waveFrequency', type: 'number', default: '2.5', description: 'How many blobs fit on screen.' },
  { name: 'levels', type: 'number', default: '3', description: 'Number of brightness steps in the picture.' },
  {
    name: 'columns',
    type: 'number',
    default: '80',
    description: 'Width of the low resolution picture in blocks. Fewer columns make chunkier blocks.'
  },
  {
    name: 'persistence',
    type: 'number',
    default: '0.4',
    description: 'How long the phosphor keeps glowing after the picture moves on, leaving soft trails.'
  },
  { name: 'curvature', type: 'number', default: '0.25', description: 'Bulge of the curved glass.' },
  {
    name: 'corners',
    type: 'number',
    default: '0',
    description: 'Rounds the corners of the tube and shows its edge. 0 keeps the picture edge to edge.'
  },
  {
    name: 'scanlineStrength',
    type: 'number',
    default: '0.6',
    description: 'Depth of the dark gaps between scanlines. Bright lines widen and fill the gaps.'
  },
  {
    name: 'scanlineFrequency',
    type: 'number',
    default: '200',
    description: 'Number of scanlines from top to bottom.'
  },
  { name: 'maskStrength', type: 'number', default: '0.3', description: 'Visibility of the phosphor mask.' },
  { name: 'bloom', type: 'number', default: '1.5', description: 'Glow that spills from bright areas.' },
  { name: 'bloomRadius', type: 'number', default: '1', description: 'How far the glow spreads.' },
  {
    name: 'rgbShift',
    type: 'number',
    default: '0.003',
    description: 'Misalignment of the red and blue beams, which fringes edges with color.'
  },
  { name: 'noise', type: 'number', default: '0.1', description: 'Grain in the lit picture.' },
  { name: 'flicker', type: 'number', default: '0.15', description: 'Brightness flicker of the tube.' },
  {
    name: 'interference',
    type: 'number',
    default: '0.2',
    description: 'A slow hum bar rolling down the screen and jitter along the lines.'
  },
  { name: 'vignette', type: 'number', default: '0.3', description: 'Darkening toward the edges of the tube.' },
  {
    name: 'brightness',
    type: 'number',
    default: '1',
    description: 'Overall brightness, or ink strength in light mode.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description:
      'Warms the tube up when it first comes into view: the plasma grows out of the dark and pulls into focus.'
  },
  {
    name: 'mouseReact',
    type: 'boolean',
    default: 'true',
    description: 'The cursor acts like a magnet held to the glass, twisting the picture with color fringes.'
  },
  { name: 'mouseStrength', type: 'number', default: '0.5', description: 'Strength of the magnet.' },
  {
    name: 'changeOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Clicking changes the channel: the picture rolls through static and comes back with a new pattern.'
  },
  { name: 'dpr', type: 'number', default: '2', description: 'Maximum device pixel ratio of the canvas.' },
  { name: 'fps', type: 'number', default: '60', description: 'Maximum frame rate.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the plasma.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
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
</script>
