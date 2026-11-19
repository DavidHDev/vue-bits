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
          <Strands :key="rerenderKey" v-bind="settings" :light-mode="theme === 'light'" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :max="8"
            :model-value="settings.colors"
            @update:model-value="value => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSlider
            title="Count"
            :min="1"
            :max="3"
            :step="1"
            :model-value="settings.count"
            @update:model-value="value => updateProp('count', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Amplitude"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.amplitude"
            @update:model-value="value => updateProp('amplitude', value)"
          />
          <PreviewSlider
            title="Waviness"
            :min="0.4"
            :max="2.5"
            :step="0.05"
            :model-value="settings.waviness"
            @update:model-value="value => updateProp('waviness', value)"
          />
          <PreviewSlider
            title="Energy"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.energy"
            @update:model-value="value => updateProp('energy', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0.3"
            :max="2.5"
            :step="0.05"
            :model-value="settings.thickness"
            @update:model-value="value => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.spread"
            @update:model-value="value => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Taper"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.taper"
            @update:model-value="value => updateProp('taper', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.2"
            :max="2"
            :step="0.05"
            :model-value="settings.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Saturation"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.saturation"
            @update:model-value="value => updateProp('saturation', value)"
          />
          <PreviewSlider
            title="Hue Shift"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.hueShift"
            @update:model-value="value => updateProp('hueShift', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.5"
            :max="1.6"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Glass Size"
            :min="0.5"
            :max="1.15"
            :step="0.01"
            :model-value="settings.glassSize"
            :is-disabled="!settings.glass"
            @update:model-value="value => updateProp('glassSize', value)"
          />
          <PreviewSlider
            title="Refraction"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.refraction"
            :is-disabled="!settings.glass"
            @update:model-value="value => updateProp('refraction', value)"
          />
          <PreviewSlider
            title="Rim"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.rim"
            :is-disabled="!settings.glass"
            @update:model-value="value => updateProp('rim', value)"
          />
          <PreviewSlider
            title="Dispersion"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.dispersion"
            :is-disabled="!settings.glass"
            @update:model-value="value => updateProp('dispersion', value)"
          />
          <PreviewSwitch
            title="Glass"
            :model-value="settings.glass"
            @update:model-value="value => updateProp('glass', value)"
          />
          <PreviewSwitch
            title="Listening"
            :model-value="settings.listening"
            @update:model-value="value => updateProp('listening', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="value => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Click Pulse"
            :model-value="settings.clickPulse"
            @update:model-value="value => updateProp('clickPulse', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="strands" component-name="Strands" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorList from '@/components/common/PreviewColorList.vue';
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
import { strands } from '@/constants/code/Animations/strandsCode';
import Strands from '@/content/Animations/Strands/Strands.vue';

const SPECTRUM = ['#d95b56', '#ba5046', '#ffa24c', '#ffe0b3', '#93f1ff', '#3569fa', '#193d9b'];

const LOOK = {
  colors: SPECTRUM,
  count: 3,
  speed: 1,
  amplitude: 1,
  waviness: 1,
  energy: 0.65,
  thickness: 1,
  spread: 1,
  glow: 1,
  taper: 1,
  intensity: 1,
  saturation: 1,
  hueShift: 0,
  scale: 1,
  glass: true,
  glassSize: 1,
  refraction: 1,
  rim: 1,
  dispersion: 1,
  listening: false
};

const DEFAULT_PROPS = {
  preset: 'siri',
  ...LOOK,
  interactive: true,
  clickPulse: true,
  intro: true
};

type DemoProps = typeof DEFAULT_PROPS;

const PRESETS: Record<string, Partial<DemoProps>> = {
  siri: {},
  listening: { listening: true },
  calm: { energy: 0 },
  ribbon: { glass: false },
  aurora: { colors: ['#00e08a', '#3dffb0', '#00c2a8', '#c8fff0', '#7fe3ff', '#2f6bff', '#1f3fbf'] },
  ember: { colors: ['#ff2a1f', '#ff5a2e', '#ff7a1a', '#ffe2a8', '#ffb37a', '#ff3d2e', '#c42a6a'] }
};

const PRESET_OPTIONS = [
  { value: 'siri', label: 'Siri' },
  { value: 'listening', label: 'Listening' },
  { value: 'calm', label: 'Calm' },
  { value: 'ribbon', label: 'Ribbon' },
  { value: 'aurora', label: 'Aurora' },
  { value: 'ember', label: 'Ember' }
];

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: 'Siri palette',
    description:
      'Colors of the strands, in order: the red top edge of the bulge, orange, amber, the warm white core, cyan, blue and deep blue. Fewer colors are spread across these roles.'
  },
  {
    name: 'count',
    type: 'number',
    default: '3',
    description: 'How many strands show inside the bulge of light, from 1 to 3.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'How fast the light turns. 0 holds it still.' },
  {
    name: 'amplitude',
    type: 'number',
    default: '1',
    description: 'How tall the arch rises and how deeply the ribbon curves.'
  },
  { name: 'waviness', type: 'number', default: '1', description: 'How tightly the ribbon twists along its length.' },
  {
    name: 'energy',
    type: 'number',
    default: '0.65',
    description:
      'How lively the light is on its own, from 0 to 1. 0 rests as a calm white line, 1 keeps the ribbons fully open.'
  },
  {
    name: 'thickness',
    type: 'number',
    default: '1',
    description: 'How thick the edges of the light are, and the white core where the ribbon turns edge-on.'
  },
  { name: 'spread', type: 'number', default: '1', description: 'How wide the ribbon opens, fanning its colors out.' },
  { name: 'glow', type: 'number', default: '1', description: 'Strength of the soft glow around the light.' },
  {
    name: 'taper',
    type: 'number',
    default: '1',
    description: 'How quickly the light fades toward the sides of the orb.'
  },
  { name: 'intensity', type: 'number', default: '1', description: 'Overall brightness of the light.' },
  { name: 'saturation', type: 'number', default: '1', description: 'Color saturation of the light. 0 is greyscale.' },
  {
    name: 'hueShift',
    type: 'number',
    default: '0',
    description: 'Rotates the colors of the light around the color wheel, from 0 to 1.'
  },
  { name: 'scale', type: 'number', default: '1', description: 'Width of the light.' },
  {
    name: 'glass',
    type: 'boolean',
    default: 'true',
    description: 'Shows the glass orb. Turn it off for the light on its own.'
  },
  { name: 'glassSize', type: 'number', default: '1', description: 'Size of the glass orb.' },
  {
    name: 'refraction',
    type: 'number',
    default: '1',
    description: 'How strongly the edge of the glass bends the light, wrapping the colors around its rim.'
  },
  { name: 'rim', type: 'number', default: '1', description: 'Brightness of the glass rim and the light it catches.' },
  {
    name: 'dispersion',
    type: 'number',
    default: '1',
    description: 'Amount of rainbow color separation along the edge of the glass.'
  },
  {
    name: 'listening',
    type: 'boolean',
    default: 'false',
    description: 'Animates the orb as if it were hearing someone speak.'
  },
  {
    name: 'level',
    type: 'number',
    default: 'undefined',
    description:
      'Drives the orb from your own audio level, from 0 to 1, for example a microphone volume. Overrides listening.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'The light tilts toward the cursor and stirs as it gets close.'
  },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a burst of motion through the light.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The orb fades in and the light unfolds from the center when it first appears.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description:
      'For light pages. The orb turns into frosted white glass and the strands use deeper colors with a warm core.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall opacity.' },
  {
    name: 'maxDevicePixelRatio',
    type: 'number',
    default: '2',
    description: 'Highest pixel ratio the canvas renders at.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const computedProps = computed(() => (theme.value === 'light' ? { lightMode: true } : {}));

const applyPreset = (value: string | number) => {
  const key = String(value);
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof DemoProps]])
  ) as Partial<DemoProps>;
  updateProps({ ...base, ...PRESETS[key], preset: key });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
