<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'color', 'colorTwo']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <MagicRings
            :key="rerenderKey"
            v-bind="settings"
            :color="colors.color"
            :color-two="colors.colorTwo"
            :theme="theme"
          />
          <BackgroundContent headline="Step through the portal" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Motion"
            :options="MOTION_OPTIONS"
            :model-value="settings.motion"
            @update:model-value="value => updateProp('motion', String(value))"
          />
          <PreviewColorPickerCustom
            title="Color"
            :color="colors.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewColorPickerCustom
            title="Color Two"
            :color="colors.colorTwo"
            @change="(value: string) => updateProp('colorTwo', value)"
          />
          <PreviewSlider
            title="Ring Count"
            :min="1"
            :max="12"
            :step="1"
            :model-value="settings.ringCount"
            @update:model-value="value => updateProp('ringCount', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Line Thickness"
            :min="0.5"
            :max="8"
            :step="0.5"
            value-unit="px"
            :model-value="settings.lineThickness"
            @update:model-value="value => updateProp('lineThickness', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Base Radius"
            :min="0.05"
            :max="0.6"
            :step="0.01"
            :model-value="settings.baseRadius"
            @update:model-value="value => updateProp('baseRadius', value)"
          />
          <PreviewSlider
            title="Radius Step"
            :min="0.02"
            :max="0.25"
            :step="0.01"
            :model-value="settings.radiusStep"
            @update:model-value="value => updateProp('radiusStep', value)"
          />
          <PreviewSlider
            title="Expansion"
            :min="0"
            :max="0.4"
            :step="0.01"
            :model-value="settings.expansion"
            @update:model-value="value => updateProp('expansion', value)"
          />
          <PreviewSlider
            title="Taper"
            :min="1"
            :max="3"
            :step="0.05"
            :model-value="settings.taper"
            @update:model-value="value => updateProp('taper', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="0"
            :max="180"
            :step="1"
            value-unit="°"
            :model-value="settings.rotation"
            @update:model-value="value => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Spin"
            :min="-2"
            :max="2"
            :step="0.05"
            :model-value="settings.spin"
            @update:model-value="value => updateProp('spin', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="-75"
            :max="75"
            :step="1"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Dispersion"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.dispersion"
            @update:model-value="value => updateProp('dispersion', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.grain"
            @update:model-value="value => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.opacity"
            @update:model-value="value => updateProp('opacity', value)"
          />
          <PreviewSlider
            title="Hover Scale"
            :min="1"
            :max="1.6"
            :step="0.05"
            :model-value="settings.hoverScale"
            @update:model-value="value => updateProp('hoverScale', value)"
          />
          <PreviewSlider
            title="Hover Intensity"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.hoverIntensity"
            @update:model-value="value => updateProp('hoverIntensity', value)"
          />
          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="0.15"
            :step="0.005"
            :model-value="settings.parallax"
            @update:model-value="value => updateProp('parallax', value)"
          />
          <PreviewSlider
            title="Mouse Influence"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.mouseInfluence"
            @update:model-value="value => updateProp('mouseInfluence', value)"
          />
          <PreviewSwitch
            title="Follow Mouse"
            :model-value="settings.followMouse"
            @update:model-value="value => updateProp('followMouse', value)"
          />
          <PreviewSwitch
            title="Click Burst"
            :model-value="settings.clickBurst"
            @update:model-value="value => updateProp('clickBurst', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="magicRings" component-name="MagicRings" />
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
import { magicRings } from '@/constants/code/Backgrounds/magicRingsCode';
import MagicRings from '@/content/Backgrounds/MagicRings/MagicRings.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/MagicRings';

type Motion = 'pulse' | 'ripple' | 'breathe';

const LIGHT_SWAP: Record<string, string> = {
  '#7cff67': '#1f9d45',
  '#42b883': '#0f766e',
  '#ffffff': '#3d423e',
  '#a3a8a4': '#6c736d',
  '#22d3ee': '#0891b2',
  '#3b82f6': '#2563eb',
  '#e0f2fe': '#4f5550',
  '#fcd34d': '#d97706',
  '#f97316': '#ea580c',
  '#fb923c': '#c2410c'
};

const DARK_SWAP: Record<string, string> = Object.fromEntries(
  Object.entries(LIGHT_SWAP).map(([dark, light]) => [light, dark])
);

const MOTION_OPTIONS = [
  { value: 'pulse', label: 'Pulse' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'breathe', label: 'Breathe' }
];

const swapColor = (value: string, swap: Record<string, string>) => {
  const key = `#${String(value).replace(/^#/, '').toLowerCase()}`;
  return swap[key] ?? key;
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const {
    preset: _preset,
    color: _color,
    colorTwo: _colorTwo,
    theme: _theme,
    ...rest
  } = props.value as typeof props.value & {
    theme?: string;
  };
  void _preset;
  void _color;
  void _colorTwo;
  void _theme;
  return { ...rest, motion: rest.motion as Motion };
});

const colors = computed(() => {
  const swap = theme.value === 'light' ? LIGHT_SWAP : DARK_SWAP;
  return { color: swapColor(props.value.color, swap), colorTwo: swapColor(props.value.colorTwo, swap) };
});

const computedProps = computed(() => ({
  ...colors.value,
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  { name: 'color', type: 'string', default: "'#7cff67'", description: 'Color of the innermost ring.' },
  {
    name: 'colorTwo',
    type: 'string',
    default: "'#42b883'",
    description: 'Color of the outermost ring. The rings in between blend from one to the other.'
  },
  { name: 'ringCount', type: 'number', default: '6', description: 'Number of rings, from 1 to 12.' },
  {
    name: 'motion',
    type: "'pulse' | 'ripple' | 'breathe'",
    default: "'pulse'",
    description:
      'How the rings move: a wave that lights them one by one, rings flowing outward from the center, or all rings gently breathing.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Animation speed. 0 freezes the rings.' },
  {
    name: 'lineThickness',
    type: 'number',
    default: '2',
    description: 'Thickness of the rings in px. Rings are thickest at the sides and taper toward the top and bottom.'
  },
  { name: 'glow', type: 'number', default: '1', description: 'Size and strength of the glow around the rings.' },
  {
    name: 'baseRadius',
    type: 'number',
    default: '0.35',
    description: 'Radius of the innermost ring, as a share of the smaller side of the container.'
  },
  { name: 'radiusStep', type: 'number', default: '0.1', description: 'Space between neighboring rings.' },
  {
    name: 'expansion',
    type: 'number',
    default: '0.1',
    description: 'How far each ring drifts outward while it glows.'
  },
  {
    name: 'taper',
    type: 'number',
    default: '1.5',
    description: 'How quickly outer rings shorten into side arcs. 1 keeps every ring the same length.'
  },
  { name: 'rotation', type: 'number', default: '0', description: 'Rotates the whole pattern, in degrees.' },
  {
    name: 'spin',
    type: 'number',
    default: '0',
    description:
      'Spins the arcs around the center, neighbors turning in opposite directions. Negative values reverse it.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description: 'Leans the rings back in 3D, in degrees, like a portal seen at an angle.'
  },
  {
    name: 'dispersion',
    type: 'number',
    default: '0',
    description: 'Splits each ring into rainbow fringes like light through a prism, from 0 to 1.'
  },
  { name: 'grain', type: 'number', default: '0', description: 'Film grain over the glow, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall opacity, from 0 to 1.' },
  { name: 'followMouse', type: 'boolean', default: 'false', description: 'The rings drift toward the cursor.' },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '0.2',
    description: 'How far the rings drift when followMouse is on.'
  },
  { name: 'hoverScale', type: 'number', default: '1.2', description: 'How much the rings swell on hover.' },
  {
    name: 'hoverIntensity',
    type: 'number',
    default: '1',
    description: 'How much the rings brighten and thicken near the cursor.'
  },
  {
    name: 'parallax',
    type: 'number',
    default: '0.05',
    description: 'How much the rings shift and lean with the cursor, outer rings the most, for a sense of depth.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a bright ring racing outward that lights up the rings as it passes.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The rings open from the sides one by one when they mount.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Glowing light for dark pages, or crisp ink with a soft halo for light ones.'
  },
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
