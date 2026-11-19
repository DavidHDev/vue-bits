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
          <Antigravity :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Defy gravity with every move." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="6"
            :model-value="settings.colors"
            @update:model-value="(value: string[]) => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Color Mode"
            :options="COLOR_MODE_OPTIONS"
            :model-value="settings.colorMode"
            @update:model-value="(value: string | number) => updateProp('colorMode', value as ColorMode)"
          />
          <PreviewSelect
            title="Particle Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.particleShape"
            @update:model-value="(value: string | number) => updateProp('particleShape', value as Shape)"
          />
          <PreviewSlider
            title="Color Speed"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.colorSpeed"
            @update:model-value="(value: number) => updateProp('colorSpeed', value)"
          />
          <PreviewSlider
            title="Count"
            :min="100"
            :max="5000"
            :step="50"
            :model-value="settings.count"
            @update:model-value="(value: number) => updateProp('count', value)"
          />
          <PreviewSlider
            title="Particle Size"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.particleSize"
            @update:model-value="(value: number) => updateProp('particleSize', value)"
          />
          <PreviewSlider
            title="Particle Variance"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.particleVariance"
            @update:model-value="(value: number) => updateProp('particleVariance', value)"
          />
          <PreviewSlider
            title="Magnet Radius"
            :min="2"
            :max="20"
            :step="0.5"
            :model-value="settings.magnetRadius"
            @update:model-value="(value: number) => updateProp('magnetRadius', value)"
          />
          <PreviewSlider
            title="Ring Radius"
            :min="0"
            :max="16"
            :step="0.5"
            :model-value="settings.ringRadius"
            @update:model-value="(value: number) => updateProp('ringRadius', value)"
          />
          <PreviewSlider
            title="Field Strength"
            :min="1"
            :max="40"
            :step="0.5"
            :model-value="settings.fieldStrength"
            @update:model-value="(value: number) => updateProp('fieldStrength', value)"
          />
          <PreviewSlider
            title="Wave Amplitude"
            :min="0"
            :max="8"
            :step="0.1"
            :model-value="settings.waveAmplitude"
            @update:model-value="(value: number) => updateProp('waveAmplitude', value)"
          />
          <PreviewSlider
            title="Wave Count"
            :min="0"
            :max="12"
            :step="1"
            :model-value="settings.waveCount"
            @update:model-value="(value: number) => updateProp('waveCount', value)"
          />
          <PreviewSlider
            title="Wave Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.waveSpeed"
            @update:model-value="(value: number) => updateProp('waveSpeed', value)"
          />
          <PreviewSlider
            title="Rotation Speed"
            :min="-3"
            :max="3"
            :step="0.05"
            :model-value="settings.rotationSpeed"
            @update:model-value="(value: number) => updateProp('rotationSpeed', value)"
          />
          <PreviewSlider
            title="Pulse Speed"
            :min="0"
            :max="10"
            :step="0.1"
            :model-value="settings.pulseSpeed"
            @update:model-value="(value: number) => updateProp('pulseSpeed', value)"
          />
          <PreviewSlider
            title="Depth Factor"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.depthFactor"
            @update:model-value="(value: number) => updateProp('depthFactor', value)"
          />
          <PreviewSlider
            title="Ambient"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.ambient"
            @update:model-value="(value: number) => updateProp('ambient', value)"
          />
          <PreviewSlider
            title="Lerp Speed"
            :min="0.01"
            :max="0.3"
            :step="0.01"
            :model-value="settings.lerpSpeed"
            @update:model-value="(value: number) => updateProp('lerpSpeed', value)"
          />
          <PreviewSwitch
            title="Auto Animate"
            :model-value="settings.autoAnimate"
            @update:model-value="(value: boolean) => updateProp('autoAnimate', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="(value: boolean) => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Click Burst"
            :model-value="settings.clickBurst"
            @update:model-value="(value: boolean) => updateProp('clickBurst', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="(value: boolean) => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="antigravity" component-name="Antigravity" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
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
import { antigravity } from '@/constants/code/Backgrounds/antigravityCode';
import Antigravity from '@/content/Backgrounds/Antigravity/Antigravity.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Antigravity';

type ColorMode = 'conic' | 'radial' | 'random';
type Shape = 'capsule' | 'sphere' | 'box' | 'tetrahedron';

const COLOR_MODE_OPTIONS = [
  { value: 'conic', label: 'Conic' },
  { value: 'radial', label: 'Radial' },
  { value: 'random', label: 'Random' }
];

const SHAPE_OPTIONS = [
  { value: 'capsule', label: 'Capsule' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'box', label: 'Box' },
  { value: 'tetrahedron', label: 'Tetrahedron' }
];

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#7cff67', '#a0ffbc', '#42b883']",
    description: 'Palette the particles are colored from. How it is spread depends on colorMode.'
  },
  {
    name: 'color',
    type: 'string',
    default: '-',
    description: 'A single color for every particle. Overrides colors when set.'
  },
  {
    name: 'colorMode',
    type: "'conic' | 'radial' | 'random'",
    default: "'conic'",
    description:
      'Spreads the palette around the cursor, outward from the ring, or gives each particle a random color from it.'
  },
  {
    name: 'colorSpeed',
    type: 'number',
    default: '0.05',
    description: 'How fast the conic palette turns around the cursor. 0 keeps it still.'
  },
  {
    name: 'particleShape',
    type: "'capsule' | 'sphere' | 'box' | 'tetrahedron'",
    default: "'capsule'",
    description: 'Shape of the particles. Capsules stretch into dashes that point at the cursor.'
  },
  { name: 'count', type: 'number', default: '1500', description: 'Number of particles in the field.' },
  { name: 'particleSize', type: 'number', default: '0.9', description: 'Size of the particles.' },
  {
    name: 'particleVariance',
    type: 'number',
    default: '1',
    description: 'How much each particle pulses in size, from 0 to 1.'
  },
  {
    name: 'magnetRadius',
    type: 'number',
    default: '9',
    description: 'Size of the area around the cursor whose particles get pulled into the ring.'
  },
  { name: 'ringRadius', type: 'number', default: '7', description: 'Radius of the ring the particles form.' },
  {
    name: 'fieldStrength',
    type: 'number',
    default: '10',
    description: 'How tightly the particles line up on the ring. Lower values spread them into a wider band.'
  },
  {
    name: 'waveAmplitude',
    type: 'number',
    default: '1',
    description: 'How much the ring ripples. 0 gives a clean circle.'
  },
  {
    name: 'waveCount',
    type: 'number',
    default: '3',
    description: 'Number of ripples around the ring. Pair with a high waveAmplitude for a flower shape.'
  },
  { name: 'waveSpeed', type: 'number', default: '0.4', description: 'How fast the ripples travel around the ring.' },
  {
    name: 'rotationSpeed',
    type: 'number',
    default: '0',
    description: 'How fast the particles orbit the cursor. Negative values orbit the other way.'
  },
  { name: 'pulseSpeed', type: 'number', default: '3', description: 'How fast the particles pulse in size.' },
  {
    name: 'depthFactor',
    type: 'number',
    default: '1',
    description: 'Strength of the 3D depth. Particles in front grow, particles behind shrink and soften.'
  },
  {
    name: 'ambient',
    type: 'number',
    default: '0.25',
    description: 'How visible the particles away from the ring are, from 0 to 1.'
  },
  {
    name: 'lerpSpeed',
    type: 'number',
    default: '0.05',
    description: 'How quickly the particles follow the cursor. Lower values leave longer trails.'
  },
  {
    name: 'autoAnimate',
    type: 'boolean',
    default: 'true',
    description: 'The ring drifts around on its own after a couple of seconds without cursor movement.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'The ring follows the cursor or finger. Turn off for a purely ambient background.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description: 'Pressing pulls the ring in and spins it faster. Releasing blasts the particles outward.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'The particles float up into place on mount.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Deepens pale colors so the particles stay visible on light backgrounds.'
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

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
