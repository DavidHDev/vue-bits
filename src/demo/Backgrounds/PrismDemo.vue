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
          <Prism :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="A spectrum of colors that spark creativity" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="0"
            :max="8"
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
            title="Animation"
            :options="ANIMATION_OPTIONS"
            :model-value="settings.animationType"
            @update:model-value="(value: string | number) => updateProp('animationType', value as PrismAnimationType)"
          />
          <PreviewSlider
            title="Time Scale"
            :min="0"
            :max="2"
            :step="0.05"
            :is-disabled="settings.animationType === 'hover' || settings.animationType === 'static'"
            :model-value="settings.timeScale"
            @update:model-value="(value: number) => updateProp('timeScale', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0.2"
            :max="3"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="1.5"
            :max="6"
            :step="0.1"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Height"
            :min="1"
            :max="8"
            :step="0.1"
            :model-value="settings.height"
            @update:model-value="(value: number) => updateProp('height', value)"
          />
          <PreviewSlider
            title="Base Width"
            :min="1"
            :max="10"
            :step="0.1"
            :model-value="settings.baseWidth"
            @update:model-value="(value: number) => updateProp('baseWidth', value)"
          />
          <PreviewSlider
            title="Hue Shift"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :model-value="settings.hueShift"
            @update:model-value="(value: number) => updateProp('hueShift', value)"
          />
          <PreviewSlider
            title="Color Frequency"
            :min="0.25"
            :max="4"
            :step="0.05"
            :model-value="settings.colorFrequency"
            @update:model-value="(value: number) => updateProp('colorFrequency', value)"
          />
          <PreviewSlider
            title="Saturation"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.saturation"
            @update:model-value="(value: number) => updateProp('saturation', value)"
          />
          <PreviewSlider
            title="Noise"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.noise"
            @update:model-value="(value: number) => updateProp('noise', value)"
          />
          <PreviewSlider
            title="Hover Strength"
            :min="0"
            :max="4"
            :step="0.1"
            :is-disabled="!settings.interactive && settings.animationType !== 'hover'"
            :model-value="settings.hoverStrength"
            @update:model-value="(value: number) => updateProp('hoverStrength', value)"
          />
          <PreviewSlider
            title="Inertia"
            :min="0.01"
            :max="0.3"
            :step="0.01"
            :is-disabled="!settings.interactive && settings.animationType !== 'hover'"
            :model-value="settings.inertia"
            @update:model-value="(value: number) => updateProp('inertia', value)"
          />
          <PreviewSlider
            title="Resolution"
            :min="0.25"
            :max="1"
            :step="0.05"
            :model-value="settings.resolution"
            @update:model-value="(value: number) => updateProp('resolution', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="(value: boolean) => updateProp('interactive', value)"
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
        <CodeExample :code-object="prism" component-name="Prism" />
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
import { prism } from '@/constants/code/Backgrounds/prismCode';
import Prism from '@/content/Backgrounds/Prism/Prism.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps, type PrismAnimationType } from './presets/Prism';

const ANIMATION_OPTIONS = [
  { value: 'rotate', label: 'Rotate' },
  { value: '3drotate', label: '3D Rotate' },
  { value: 'hover', label: 'Hover' },
  { value: 'static', label: 'Static' }
];

const propData: PropRow[] = [
  {
    name: 'animationType',
    type: "'rotate' | '3drotate' | 'hover' | 'static'",
    default: "'rotate'",
    description: 'Rotate spins the prism in place, 3D rotate tumbles it, hover turns it only toward the cursor.'
  },
  {
    name: 'timeScale',
    type: 'number',
    default: '0.5',
    description: 'Speed of the rotation. 0 holds it still.'
  },
  {
    name: 'colors',
    type: 'string[]',
    default: '[]',
    description: 'Custom colors for the light, cycled through the color bands. Leave empty for the original spectrum.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '1',
    description: 'Brightness of the light.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '3.6',
    description: 'Size of the prism on screen. Larger values zoom in.'
  },
  {
    name: 'height',
    type: 'number',
    default: '3.5',
    description: 'Height of the prism from its base to its tip.'
  },
  {
    name: 'baseWidth',
    type: 'number',
    default: '5.5',
    description: 'Width of the prism at its base.'
  },
  {
    name: 'hueShift',
    type: 'number',
    default: '0',
    description: 'Rotates every color around the color wheel, in degrees.'
  },
  {
    name: 'colorFrequency',
    type: 'number',
    default: '1',
    description: 'How quickly the colors change through the light. Higher values show more bands.'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1.5',
    description: 'Color intensity, from 0 (grayscale) to 2.'
  },
  {
    name: 'noise',
    type: 'number',
    default: '0',
    description: 'Film grain over the light, from 0 to 1.'
  },
  {
    name: 'offset',
    type: '{ x?: number; y?: number }',
    default: '{ x: 0, y: 0 }',
    description: 'Moves the prism by a number of pixels, x to the right and y down.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Tilts the prism toward the cursor in every animation mode.'
  },
  {
    name: 'hoverStrength',
    type: 'number',
    default: '2',
    description: 'How far the prism turns toward the cursor.'
  },
  {
    name: 'inertia',
    type: 'number',
    default: '0.05',
    description: 'How quickly the prism follows the cursor, from 0.01 (slow and smooth) to 1 (instant).'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Fades the light in on mount.'
  },
  {
    name: 'resolution',
    type: 'number',
    default: '0.5',
    description:
      'Fraction of the screen resolution the light is rendered at, from 0.25 to 1. The glow is soft, so 0.5 looks the same as full resolution and runs about four times faster.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the light as colored ink for light backgrounds.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
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
</script>
