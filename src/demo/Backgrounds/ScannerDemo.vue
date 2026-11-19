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
          <Scanner :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Signals, sweeping quietly across the screen." />
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
            title="Lines"
            :color="settings.color1"
            @change="(value: string) => updateProp('color1', value)"
          />
          <PreviewColorPickerCustom
            title="Lit Lines"
            :color="settings.color2"
            @change="(value: string) => updateProp('color2', value)"
          />
          <PreviewColorPickerCustom
            title="Scan Head"
            :color="settings.color3"
            @change="(value: string) => updateProp('color3', value)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.scanDirection"
            @update:model-value="(value: string | number) => updateProp('scanDirection', value as ScanDirection)"
          />
          <PreviewSelect
            title="Mouse Mode"
            :options="MOUSE_OPTIONS"
            :model-value="settings.mouseMode"
            @update:model-value="(value: string | number) => updateProp('mouseMode', value as 'repel' | 'attract')"
          />
          <PreviewSelect
            title="Click Effect"
            :options="CLICK_OPTIONS"
            :model-value="settings.clickEffect"
            @update:model-value="(value: string | number) => updateProp('clickEffect', value as 'ping' | 'none')"
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
            title="Sweep Speed"
            :min="0"
            :max="1.5"
            :step="0.01"
            :model-value="settings.sweepSpeed"
            @update:model-value="(value: number) => updateProp('sweepSpeed', value)"
          />
          <PreviewSlider
            title="Sweep Width"
            :min="0.4"
            :max="4"
            :step="0.05"
            :model-value="settings.sweepWidth"
            @update:model-value="(value: number) => updateProp('sweepWidth', value)"
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
            title="Scale"
            :min="0.5"
            :max="3"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Frequency"
            :min="0.2"
            :max="4"
            :step="0.05"
            :model-value="settings.frequency"
            @update:model-value="(value: number) => updateProp('frequency', value)"
          />
          <PreviewSlider
            title="Ripple"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.ripple"
            @update:model-value="(value: number) => updateProp('ripple', value)"
          />
          <PreviewSlider
            title="Band Density"
            :min="3"
            :max="40"
            :step="0.5"
            :model-value="settings.bandDensity"
            @update:model-value="(value: number) => updateProp('bandDensity', value)"
          />
          <PreviewSlider
            title="Line Width"
            :min="0.4"
            :max="4"
            :step="0.1"
            value-unit="px"
            :model-value="settings.lineWidth"
            @update:model-value="(value: number) => updateProp('lineWidth', value)"
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
            title="Color Spread"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.colorSpread"
            @update:model-value="(value: number) => updateProp('colorSpread', value)"
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
            title="Vignette"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.vignette"
            @update:model-value="(value: number) => updateProp('vignette', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.2"
            :step="0.01"
            :is-disabled="!settings.grain"
            :model-value="settings.grainIntensity"
            @update:model-value="(value: number) => updateProp('grainIntensity', value)"
          />
          <PreviewSlider
            title="Scanlines"
            :min="0"
            :max="1"
            :step="0.05"
            :is-disabled="!settings.scanline"
            :model-value="settings.scanlineIntensity"
            @update:model-value="(value: number) => updateProp('scanlineIntensity', value)"
          />
          <PreviewSlider
            title="Mouse Radius"
            :min="0.1"
            :max="1.5"
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
          <PreviewSwitch
            title="Reverse"
            :model-value="settings.reverse"
            @update:model-value="(value: boolean) => updateProp('reverse', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Grain"
            :model-value="settings.grain"
            @update:model-value="(value: boolean) => updateProp('grain', value)"
          />
          <PreviewSwitch
            title="Scanline"
            :model-value="settings.scanline"
            @update:model-value="(value: boolean) => updateProp('scanline', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="scanner" component-name="Scanner" />
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
import { scanner } from '@/constants/code/Backgrounds/scannerCode';
import Scanner from '@/content/Backgrounds/Scanner/Scanner.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Scanner';

type ScanDirection = 'vertical' | 'horizontal' | 'diagonal';

const DIRECTION_OPTIONS = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'diagonal', label: 'Diagonal' }
];

const MOUSE_OPTIONS = [
  { value: 'repel', label: 'Repel' },
  { value: 'attract', label: 'Attract' }
];

const CLICK_OPTIONS = [
  { value: 'ping', label: 'Ping' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  { name: 'color1', type: 'string', default: "'#42b883'", description: 'Color of the resting lines.' },
  {
    name: 'color2',
    type: 'string',
    default: "'#7cff67'",
    description: 'Color the lines take as the scan lights them.'
  },
  { name: 'color3', type: 'string', default: "'#FFFFFF'", description: 'Color of the hot scan head itself.' },
  { name: 'speed', type: 'number', default: '0.5', description: 'How fast the wave moves through the lines.' },
  { name: 'sweepSpeed', type: 'number', default: '0.25', description: 'How fast the scan travels across.' },
  {
    name: 'sweepWidth',
    type: 'number',
    default: '1.6',
    description: 'Distance between one scan and the next. Larger values leave longer dark gaps.'
  },
  {
    name: 'trail',
    type: 'number',
    default: '0.5',
    description: 'Length of the afterglow the scan leaves behind, from 0 to 1.'
  },
  { name: 'reverse', type: 'boolean', default: 'false', description: 'Runs the scan in the opposite direction.' },
  { name: 'scale', type: 'number', default: '1.5', description: 'Zooms the whole pattern in or out.' },
  { name: 'frequency', type: 'number', default: '2', description: 'How many waves fit across the field.' },
  {
    name: 'ripple',
    type: 'number',
    default: '0.22',
    description: 'How tall the waves are. 0 keeps the lines straight.'
  },
  { name: 'bandDensity', type: 'number', default: '11', description: 'How many lines fill the field.' },
  {
    name: 'lineWidth',
    type: 'number',
    default: '1.2',
    description: 'Width of the resting lines, in px. Lit lines get thicker.'
  },
  { name: 'glow', type: 'number', default: '0.6', description: 'Soft glow around the lit lines.' },
  {
    name: 'scanDirection',
    type: "'vertical' | 'horizontal' | 'diagonal'",
    default: "'vertical'",
    description: 'Direction the scan travels in. The lines run across it.'
  },
  {
    name: 'colorSpread',
    type: 'number',
    default: '0.7',
    description: 'Fine color fringes on the edges of lit lines, from 0 to 1.'
  },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness of the lines.' },
  {
    name: 'vignette',
    type: 'number',
    default: '0.3',
    description: 'Fades the lines out toward the edges, from 0 to 1.'
  },
  {
    name: 'scanline',
    type: 'boolean',
    default: 'true',
    description: 'Turns on the CRT look: fine horizontal scanlines across the field.'
  },
  {
    name: 'scanlineIntensity',
    type: 'number',
    default: '0.5',
    description: 'How dark the scanlines are, from 0 to 1.'
  },
  { name: 'grain', type: 'boolean', default: 'true', description: 'Adds a little film grain.' },
  { name: 'grainIntensity', type: 'number', default: '0.04', description: 'Strength of the grain.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall opacity of the effect.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The lines bend around the cursor and light up near it.'
  },
  {
    name: 'mouseMode',
    type: "'repel' | 'attract'",
    default: "'repel'",
    description: 'Lines part around the cursor, or pinch in toward it.'
  },
  { name: 'mouseRadius', type: 'number', default: '0.5', description: 'Size of the area around the cursor.' },
  { name: 'mouseStrength', type: 'number', default: '0.7', description: 'How strongly the cursor bends the lines.' },
  {
    name: 'clickEffect',
    type: "'ping' | 'none'",
    default: "'ping'",
    description: 'Clicking sends a ring of light rippling out through the lines.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'The lines power on with a first scan on mount.' },
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

const { rerenderKey, forceRerender } = useForceRerender();
const { colorMode } = useColorMode();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({
    ...presetProps(value, { light: colorMode.value === 'light', defaults: defaultProps.value }),
    preset: value
  });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
