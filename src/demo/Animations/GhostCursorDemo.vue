<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'color']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0; cursor: crosshair">
          <GhostCursor :key="rerenderKey" :theme="theme" :color="shown" v-bind="settings" />
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
            :color="shown"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewSlider
            title="Size"
            :min="30"
            :max="180"
            :step="1"
            value-unit="px"
            :model-value="settings.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Trail Length"
            :min="5"
            :max="150"
            :step="1"
            :model-value="settings.trailLength"
            @update:model-value="value => updateProp('trailLength', value)"
          />
          <PreviewSlider
            title="Inertia"
            :min="0"
            :max="0.95"
            :step="0.01"
            :model-value="settings.inertia"
            @update:model-value="value => updateProp('inertia', value)"
          />
          <PreviewSlider
            title="Turbulence"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.turbulence"
            @update:model-value="value => updateProp('turbulence', value)"
          />
          <PreviewSlider
            title="Drift"
            :min="-1"
            :max="1.5"
            :step="0.05"
            :model-value="settings.drift"
            @update:model-value="value => updateProp('drift', value)"
          />
          <PreviewSlider
            title="Detail"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.detail"
            @update:model-value="value => updateProp('detail', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.2"
            :max="2.5"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="value => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.bloomStrength"
            @update:model-value="value => updateProp('bloomStrength', value)"
          />
          <PreviewSlider
            title="Glow Size"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.bloomRadius"
            @update:model-value="value => updateProp('bloomRadius', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.4"
            :step="0.01"
            :model-value="settings.grainIntensity"
            @update:model-value="value => updateProp('grainIntensity', value)"
          />
          <PreviewSlider
            title="Edge Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.edgeIntensity"
            @update:model-value="value => updateProp('edgeIntensity', value)"
          />
          <PreviewSlider
            title="Fade Delay"
            :min="0"
            :max="3000"
            :step="100"
            value-unit="ms"
            :model-value="settings.fadeDelayMs"
            @update:model-value="value => updateProp('fadeDelayMs', value)"
          />
          <PreviewSlider
            title="Fade Duration"
            :min="100"
            :max="4000"
            :step="100"
            value-unit="ms"
            :model-value="settings.fadeDurationMs"
            @update:model-value="value => updateProp('fadeDurationMs', value)"
          />
          <PreviewSwitch
            title="Click Puff"
            :model-value="settings.clickPuff"
            @update:model-value="value => updateProp('clickPuff', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="ghostCursor" component-name="GhostCursor" />
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
import { ghostCursor } from '@/constants/code/Animations/ghostCursorCode';
import GhostCursor from '@/content/Animations/GhostCursor/GhostCursor.vue';
import { LOOK, PRESET_OPTIONS, presetProps } from './presets/GhostCursor';

const DEFAULT_PROPS = {
  preset: 'phantom',
  ...LOOK,
  edgeIntensity: 0,
  fadeDelayMs: 1000,
  fadeDurationMs: 1500,
  clickPuff: true,
  intro: true
};

const LIGHT_SWAP: Record<string, string> = {
  '#a0ffbc': '#1f9d45',
  '#7aa2ff': '#3b5bdb',
  '#ff8a3d': '#ea580c',
  '#e5e5e5': '#525252',
  '#6ee7b7': '#059669'
};

const DARK_SWAP: Record<string, string> = Object.fromEntries(
  Object.entries(LIGHT_SWAP).map(([dark, light]) => [light, dark])
);

const propData: PropRow[] = [
  { name: 'color', type: 'string', default: "'#A0FFBC'", description: 'Color of the smoke. Dense parts glow lighter.' },
  { name: 'size', type: 'number', default: '80', description: 'Size of the ghost, in px.' },
  {
    name: 'trailLength',
    type: 'number',
    default: '50',
    description: 'How long the smoke lingers behind the cursor, from 1 to 200.'
  },
  {
    name: 'inertia',
    type: 'number',
    default: '0.5',
    description: 'How far the ghost floats behind the cursor and glides on when the cursor leaves, from 0 to 0.99.'
  },
  {
    name: 'turbulence',
    type: 'number',
    default: '0.5',
    description: 'How much the smoke swirls and curls as it drifts, from 0 to 2.'
  },
  {
    name: 'drift',
    type: 'number',
    default: '0.3',
    description: 'How fast the smoke rises. Negative values let it sink.'
  },
  {
    name: 'detail',
    type: 'number',
    default: '1',
    description: 'How wispy the smoke is, from 0 for a soft glow to 1 for billowing wisps.'
  },
  { name: 'brightness', type: 'number', default: '1', description: 'Brightness of the smoke.' },
  { name: 'bloomStrength', type: 'number', default: '0.6', description: 'Strength of the soft glow around the smoke.' },
  { name: 'bloomRadius', type: 'number', default: '1', description: 'How far the glow spreads, from 0 to 3.' },
  {
    name: 'bloomThreshold',
    type: 'number',
    default: '0.025',
    description: 'How bright smoke has to be before it glows. Higher values keep the glow on the core.'
  },
  { name: 'grainIntensity', type: 'number', default: '0.05', description: 'Film grain over the smoke, from 0 to 1.' },
  {
    name: 'edgeIntensity',
    type: 'number',
    default: '0',
    description: 'Fades the smoke out toward the edges of the area, from 0 to 1.'
  },
  { name: 'clickPuff', type: 'boolean', default: 'true', description: 'Clicking releases a puff of smoke.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The ghost floats across once when it first appears, before the cursor arrives.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Glowing smoke for dark pages, or soft ink smoke for light ones.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: "'screen' (dark), 'normal' (light)",
    description: 'CSS blend mode for the canvas.'
  },
  {
    name: 'fadeDelayMs',
    type: 'number',
    default: '1000 (500 on touch)',
    description: 'Time after the cursor stops before the ghost starts to fade, in ms.'
  },
  {
    name: 'fadeDurationMs',
    type: 'number',
    default: '1500 (1000 on touch)',
    description: 'How long the fade takes, in ms.'
  },
  {
    name: 'maxDevicePixelRatio',
    type: 'number',
    default: '2',
    description: 'Highest pixel ratio the canvas renders at.'
  },
  {
    name: 'targetPixels',
    type: 'number',
    default: '600000 (300000 on touch)',
    description: 'Pixel budget for the smoke. Large areas render it at a lower resolution to stay fast.'
  },
  { name: 'zIndex', type: 'number', default: '10', description: 'Stacking order of the effect over your content.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, color: _color, ...rest } = props.value;
  return rest;
});

const shown = computed(() => {
  const picked = `#${String(props.value.color || LOOK.color)
    .replace(/^#/, '')
    .toLowerCase()}`;
  const swap = theme.value === 'light' ? LIGHT_SWAP : DARK_SWAP;
  return swap[picked] ?? picked;
});

const computedProps = computed(() => ({
  color: shown.value,
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const applyPreset = (input: string | number) => {
  const value = String(input);
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
