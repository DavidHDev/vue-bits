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
          <LightPillar :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Ethereal light pillar for your hero sections." />
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
            title="Top Color"
            :color="settings.topColor"
            @change="(value: string) => updateProp('topColor', value)"
          />
          <PreviewColorPickerCustom
            title="Bottom Color"
            :color="settings.bottomColor"
            @change="(value: string) => updateProp('bottomColor', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.1"
            :max="3"
            :step="0.05"
            :model-value="settings.intensity"
            @update:model-value="(value: number) => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0.0005"
            :max="0.01"
            :step="0.0005"
            :model-value="settings.glowAmount"
            @update:model-value="(value: number) => updateProp('glowAmount', value)"
          />
          <PreviewSlider
            title="Bloom"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.bloom"
            @update:model-value="(value: number) => updateProp('bloom', value)"
          />
          <PreviewSlider
            title="Pillar Width"
            :min="0.5"
            :max="8"
            :step="0.1"
            :model-value="settings.pillarWidth"
            @update:model-value="(value: number) => updateProp('pillarWidth', value)"
          />
          <PreviewSlider
            title="Pillar Height"
            :min="0.1"
            :max="1.5"
            :step="0.05"
            :model-value="settings.pillarHeight"
            @update:model-value="(value: number) => updateProp('pillarHeight', value)"
          />
          <PreviewSlider
            title="Pillar Rotation"
            :min="-90"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="settings.pillarRotation"
            @update:model-value="(value: number) => updateProp('pillarRotation', value)"
          />
          <PreviewSlider
            title="Twist"
            :min="0"
            :max="1.6"
            :step="0.05"
            :model-value="settings.twist"
            @update:model-value="(value: number) => updateProp('twist', value)"
          />
          <PreviewSlider
            title="Detail"
            :min="1"
            :max="6"
            :step="1"
            :model-value="settings.detail"
            @update:model-value="(value: number) => updateProp('detail', value)"
          />
          <PreviewSlider
            title="Rotation Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.rotationSpeed"
            @update:model-value="(value: number) => updateProp('rotationSpeed', value)"
          />
          <PreviewSlider
            title="Flow"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.flow"
            @update:model-value="(value: number) => updateProp('flow', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.noiseIntensity"
            @update:model-value="(value: number) => updateProp('noiseIntensity', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
          />
          <PreviewSelect
            title="Quality"
            :options="QUALITY_OPTIONS"
            :model-value="settings.quality"
            @update:model-value="(value: string | number) => updateProp('quality', value as 'low' | 'medium' | 'high')"
          />
          <PreviewSelect
            title="Blend Mode"
            :options="BLEND_OPTIONS"
            :model-value="settings.mixBlendMode"
            @update:model-value="(value: string | number) => updateProp('mixBlendMode', String(value))"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="(value: boolean) => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Click Pulse"
            :model-value="settings.clickPulse"
            @update:model-value="(value: boolean) => updateProp('clickPulse', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="
              (value: boolean) => {
                updateProp('intro', value);
                forceRerender();
              }
            "
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
        <CodeExample :code-object="lightPillar" component-name="LightPillar" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
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
import { lightPillar } from '@/constants/code/Backgrounds/lightPillarCode';
import LightPillar from '@/content/Backgrounds/LightPillar/LightPillar.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/LightPillar';

const QUALITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const BLEND_OPTIONS = [
  { value: 'screen', label: 'Screen' },
  { value: 'normal', label: 'Normal' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'luminosity', label: 'Luminosity' }
];

const propData: PropRow[] = [
  {
    name: 'topColor',
    type: 'string',
    default: "'#42b883'",
    description: 'Color of the lower, denser part of the pillar.'
  },
  {
    name: 'bottomColor',
    type: 'string',
    default: "'#a0ffbc'",
    description: 'Color the light fades into toward the top.'
  },
  { name: 'intensity', type: 'number', default: '1', description: 'Overall brightness.' },
  {
    name: 'glowAmount',
    type: 'number',
    default: '0.002',
    description: 'How much light the strands gather. Higher values burn brighter and whiter.'
  },
  {
    name: 'bloom',
    type: 'number',
    default: '0.5',
    description: 'Soft halo around the brightest strands, from 0 to 1.'
  },
  { name: 'pillarWidth', type: 'number', default: '3', description: 'Width of the pillar.' },
  {
    name: 'pillarHeight',
    type: 'number',
    default: '0.4',
    description: 'Vertical stretch of the strands. Higher values pack them tighter.'
  },
  {
    name: 'pillarRotation',
    type: 'number',
    default: '25',
    description: 'Tilts the pillar, in degrees.'
  },
  {
    name: 'twist',
    type: 'number',
    default: '0.4',
    description: 'How much the strands swirl around each other.'
  },
  {
    name: 'detail',
    type: 'number',
    default: '4',
    description: 'Layers of turbulence in the strands, from 1 to 6. Fewer layers are smoother and faster.'
  },
  {
    name: 'rotationSpeed',
    type: 'number',
    default: '0.3',
    description: 'How fast the pillar turns. Also drives the overall animation speed.'
  },
  {
    name: 'flow',
    type: 'number',
    default: '1',
    description: 'How fast the light streams along the pillar, relative to the rotation.'
  },
  { name: 'noiseIntensity', type: 'number', default: '0.5', description: 'Strength of the film grain.' },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'The pillar leans, drifts and turns toward the cursor.'
  },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a surge of light racing up the pillar.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The pillar ignites from the bottom and widens when it first appears.'
  },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  {
    name: 'quality',
    type: "'low' | 'medium' | 'high'",
    default: "'high'",
    description: 'Render resolution of the light. The pillar is soft, so lower settings look almost the same.'
  },
  {
    name: 'resolution',
    type: 'number',
    default: '-',
    description: 'Exact render scale relative to the element size, from 0.25 to 2. Overrides quality.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: "'screen'",
    description: 'CSS blend mode for the canvas. Screen lets the page show through the dark areas.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the pillar as colored light on a white background.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, mixBlendMode, ...rest } = props.value;
  void _preset;
  return { ...rest, mixBlendMode: mixBlendMode as CSSProperties['mixBlendMode'] };
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};
</script>
