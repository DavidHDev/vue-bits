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
          <Particles :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Drift through a field of light." />
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
            v-for="(title, index) in COLOR_TITLES"
            :key="title"
            :title="title"
            :color="settings.particleColors[index] ?? settings.particleColors[0]"
            @change="(value: string) => setColor(index, value)"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="(value: string | number) => updateProp('shape', value as typeof settings.shape)"
          />
          <PreviewSlider
            title="Count"
            :min="10"
            :max="4000"
            :step="10"
            :model-value="settings.particleCount"
            @update:model-value="(value: number) => updateProp('particleCount', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="2"
            :max="30"
            :step="0.5"
            :model-value="settings.particleSpread"
            @update:model-value="(value: number) => updateProp('particleSpread', value)"
          />
          <PreviewSlider
            title="Size"
            :min="20"
            :max="400"
            :step="5"
            :model-value="settings.particleBaseSize"
            @update:model-value="(value: number) => updateProp('particleBaseSize', value)"
          />
          <PreviewSlider
            title="Size Randomness"
            :min="0.1"
            :max="2"
            :step="0.05"
            :model-value="settings.sizeRandomness"
            @update:model-value="(value: number) => updateProp('sizeRandomness', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
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
            title="Twinkle"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.twinkle"
            @update:model-value="(value: number) => updateProp('twinkle', value)"
          />
          <PreviewSlider
            title="Depth Of Field"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.depthOfField"
            @update:model-value="(value: number) => updateProp('depthOfField', value)"
          />
          <PreviewSelect
            title="Drift"
            :options="DRIFT_OPTIONS"
            :model-value="settings.drift"
            @update:model-value="(value: string | number) => updateProp('drift', value as typeof settings.drift)"
          />
          <PreviewSlider
            title="Drift Speed"
            :min="0"
            :max="4"
            :step="0.05"
            :is-disabled="settings.drift === 'none'"
            :model-value="settings.driftSpeed"
            @update:model-value="(value: number) => updateProp('driftSpeed', value)"
          />
          <PreviewSlider
            title="Connection Distance"
            :min="40"
            :max="240"
            :step="5"
            value-unit="px"
            :is-disabled="!settings.connections"
            :model-value="settings.connectionDistance"
            @update:model-value="(value: number) => updateProp('connectionDistance', value)"
          />
          <PreviewSelect
            title="Hover Effect"
            :options="HOVER_OPTIONS"
            :model-value="settings.hoverEffect"
            @update:model-value="
              (value: string | number) => updateProp('hoverEffect', value as typeof settings.hoverEffect)
            "
          />
          <PreviewSlider
            title="Hover Factor"
            :min="0"
            :max="4"
            :step="0.05"
            :is-disabled="!settings.moveParticlesOnHover"
            :model-value="settings.particleHoverFactor"
            @update:model-value="(value: number) => updateProp('particleHoverFactor', value)"
          />
          <PreviewSlider
            title="Hover Radius"
            :min="40"
            :max="400"
            :step="5"
            value-unit="px"
            :is-disabled="!settings.moveParticlesOnHover || settings.hoverEffect === 'parallax'"
            :model-value="settings.hoverRadius"
            @update:model-value="(value: number) => updateProp('hoverRadius', value)"
          />
          <PreviewSlider
            title="Camera Distance"
            :min="6"
            :max="60"
            :step="1"
            :model-value="settings.cameraDistance"
            @update:model-value="(value: number) => updateProp('cameraDistance', value)"
          />
          <PreviewSlider
            title="Variation"
            :min="0"
            :max="20"
            :step="1"
            :model-value="settings.variation"
            @update:model-value="(value: number) => updateProp('variation', value)"
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
            title="Connections"
            :model-value="settings.connections"
            @update:model-value="(value: boolean) => updateProp('connections', value)"
          />
          <PreviewSwitch
            title="Move On Hover"
            :model-value="settings.moveParticlesOnHover"
            @update:model-value="(value: boolean) => updateProp('moveParticlesOnHover', value)"
          />
          <PreviewSwitch
            title="Click Burst"
            :model-value="settings.clickBurst"
            @update:model-value="(value: boolean) => updateProp('clickBurst', value)"
          />
          <PreviewSwitch
            title="Soft Particles"
            :model-value="settings.alphaParticles"
            @update:model-value="(value: boolean) => updateProp('alphaParticles', value)"
          />
          <PreviewSwitch
            title="Disable Rotation"
            :model-value="settings.disableRotation"
            @update:model-value="(value: boolean) => updateProp('disableRotation', value)"
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
        <CodeExample :code-object="particles" component-name="Particles" />
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
import { particles } from '@/constants/code/Backgrounds/particlesCode';
import Particles from '@/content/Backgrounds/Particles/Particles.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Particles';

const COLOR_TITLES = ['Color 1', 'Color 2', 'Color 3'];

const SHAPE_OPTIONS = [
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'ring', label: 'Ring' },
  { value: 'sparkle', label: 'Sparkle' }
];

const HOVER_OPTIONS = [
  { value: 'parallax', label: 'Parallax' },
  { value: 'repel', label: 'Repel' },
  { value: 'attract', label: 'Attract' }
];

const DRIFT_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'forward', label: 'Forward' }
];

const propData: PropRow[] = [
  { name: 'particleCount', type: 'number', default: '200', description: 'How many particles there are.' },
  {
    name: 'particleSpread',
    type: 'number',
    default: '10',
    description: 'How far the particles spread out from the center.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.1',
    description: 'Speed of the floating motion, twinkle and rotation.'
  },
  {
    name: 'particleColors',
    type: 'string[]',
    default: "['#ffffff']",
    description: 'Colors the particles are picked from.'
  },
  {
    name: 'particleBaseSize',
    type: 'number',
    default: '100',
    description: 'Base size of the particles. Nearer particles are drawn larger.'
  },
  {
    name: 'sizeRandomness',
    type: 'number',
    default: '1',
    description: 'How much particle sizes vary. 0 draws every particle at the base size in px.'
  },
  {
    name: 'shape',
    type: "'circle' | 'square' | 'ring' | 'sparkle'",
    default: "'circle'",
    description: 'Shape of each particle.'
  },
  { name: 'glow', type: 'number', default: '0.5', description: 'Soft glow around each particle.' },
  { name: 'twinkle', type: 'number', default: '0.3', description: 'How much the particles flicker, from 0 to 1.' },
  {
    name: 'depthOfField',
    type: 'number',
    default: '0',
    description: 'Blurs the nearest particles into soft bokeh, like a camera lens.'
  },
  {
    name: 'connections',
    type: 'boolean',
    default: 'false',
    description: 'Joins nearby particles with thin lines, like a constellation.'
  },
  {
    name: 'connectionDistance',
    type: 'number',
    default: '110',
    description: 'How close particles need to be to connect, in px.'
  },
  {
    name: 'drift',
    type: "'none' | 'up' | 'down' | 'forward'",
    default: "'none'",
    description: 'Sends the particles drifting up like embers, down like snow, or toward you like a starfield.'
  },
  { name: 'driftSpeed', type: 'number', default: '1', description: 'How fast the particles drift.' },
  {
    name: 'moveParticlesOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Lets the cursor move the particles.'
  },
  {
    name: 'hoverEffect',
    type: "'parallax' | 'repel' | 'attract'",
    default: "'parallax'",
    description:
      'Parallax shifts the whole field away from the cursor. Repel and attract push or pull nearby particles.'
  },
  {
    name: 'particleHoverFactor',
    type: 'number',
    default: '1',
    description: 'Strength of the hover effect.'
  },
  {
    name: 'hoverRadius',
    type: 'number',
    default: '140',
    description: 'Radius around the cursor that repel and attract reach, in px.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a burst of light rippling through the particles.'
  },
  {
    name: 'alphaParticles',
    type: 'boolean',
    default: 'false',
    description: 'Draws softer, slightly see-through particles.'
  },
  {
    name: 'cameraDistance',
    type: 'number',
    default: '20',
    description: 'Distance from the camera to the particles. Lower values feel closer and deeper.'
  },
  {
    name: 'disableRotation',
    type: 'boolean',
    default: 'false',
    description: 'Stops the slow rotation of the whole field.'
  },
  { name: 'variation', type: 'number', default: '0', description: 'Picks a different particle layout.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Flies the particles in from the distance on mount.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the particles as ink for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  {
    name: 'pixelRatio',
    type: 'number',
    default: 'auto',
    description: "Maximum device pixel ratio. Defaults to the screen's, capped at 2."
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

const setColor = (index: number, value: string) => {
  const next = [...settings.value.particleColors];
  next[index] = value;
  updateProp('particleColors', next);
};
</script>
