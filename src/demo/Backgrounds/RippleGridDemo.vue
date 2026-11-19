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
          <RippleGrid :key="rerenderKey" v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="Every move sends ripples through the grid" />
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
            title="Color"
            :color="settings.color"
            @change="(value: string) => updateProp('color', value)"
          />
          <PreviewSelect
            title="Variant"
            :options="VARIANT_OPTIONS"
            :model-value="settings.variant"
            @update:model-value="(value: string | number) => updateProp('variant', value as RippleGridVariant)"
          />
          <PreviewSelect
            title="Auto Ripple"
            :options="AUTO_OPTIONS"
            :model-value="settings.autoRipple"
            @update:model-value="(value: string | number) => updateProp('autoRipple', value as RippleGridAutoRipple)"
          />
          <PreviewSlider
            title="Cell Size"
            :min="16"
            :max="120"
            :step="1"
            value-unit="px"
            :model-value="settings.cellSize"
            @update:model-value="(value: number) => updateProp('cellSize', value)"
          />
          <PreviewSlider
            title="Line Width"
            :min="0.5"
            :max="4"
            :step="0.25"
            value-unit="px"
            :model-value="settings.lineWidth"
            @update:model-value="(value: number) => updateProp('lineWidth', value)"
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
            title="Ripple Strength"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.rippleStrength"
            @update:model-value="(value: number) => updateProp('rippleStrength', value)"
          />
          <PreviewSlider
            title="Ripple Speed"
            :min="0.2"
            :max="3"
            :step="0.05"
            :model-value="settings.rippleSpeed"
            @update:model-value="(value: number) => updateProp('rippleSpeed', value)"
          />
          <PreviewSlider
            title="Ripple Size"
            :min="0.4"
            :max="3"
            :step="0.05"
            :model-value="settings.rippleSize"
            @update:model-value="(value: number) => updateProp('rippleSize', value)"
          />
          <PreviewSlider
            title="Ripple Interval"
            :min="0.5"
            :max="8"
            :step="0.1"
            value-unit="s"
            :model-value="settings.rippleInterval"
            @update:model-value="(value: number) => updateProp('rippleInterval', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="75"
            :step="1"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="(value: number) => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="0"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="settings.rotation"
            @update:model-value="(value: number) => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
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
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
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
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="(value: boolean) => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="rippleGrid" component-name="RippleGrid" />
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
import { rippleGrid } from '@/constants/code/Backgrounds/rippleGridCode';
import RippleGrid from '@/content/Backgrounds/RippleGrid/RippleGrid.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/RippleGrid';

type RippleGridVariant = 'lines' | 'dots' | 'cross';
type RippleGridAutoRipple = 'center' | 'random' | 'none';

const VARIANT_OPTIONS = [
  { value: 'lines', label: 'Lines' },
  { value: 'dots', label: 'Dots' },
  { value: 'cross', label: 'Cross' }
];

const AUTO_OPTIONS = [
  { value: 'center', label: 'Center' },
  { value: 'random', label: 'Random' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the grid. Light mode derives its ink from it.'
  },
  {
    name: 'variant',
    type: "'lines' | 'dots' | 'cross'",
    default: "'lines'",
    description: 'Draws the grid as lines, dots at each crossing, or small crosses.'
  },
  { name: 'cellSize', type: 'number', default: '48', description: 'Size of each grid cell, in px.' },
  { name: 'lineWidth', type: 'number', default: '1', description: 'Width of the lines, in px.' },
  { name: 'glow', type: 'number', default: '0.6', description: 'Soft glow around the lines.' },
  {
    name: 'rippleStrength',
    type: 'number',
    default: '1',
    description: 'How far ripples bend the grid and how brightly their crests light it.'
  },
  { name: 'rippleSpeed', type: 'number', default: '1', description: 'How fast ripples travel outward.' },
  { name: 'rippleSize', type: 'number', default: '1', description: 'Wavelength of the ripples.' },
  {
    name: 'autoRipple',
    type: "'center' | 'random' | 'none'",
    default: "'center'",
    description: 'Where idle ripples start: from the center, at random spots, or not at all.'
  },
  { name: 'rippleInterval', type: 'number', default: '2.6', description: 'Seconds between idle ripples.' },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description: 'Lays the grid back in perspective, like a floor, in degrees.'
  },
  { name: 'rotation', type: 'number', default: '0', description: 'Turns the grid, in degrees.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The cursor leaves a wake of small ripples and lights up the lines nearby.'
  },
  { name: 'clickRipple', type: 'boolean', default: 'true', description: 'Clicking sends a strong ripple.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Reveals the grid with a ripple from the center.' },
  { name: 'fade', type: 'number', default: '0.5', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the grid as ink for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value, props: settings.value }), preset: value });
};
</script>
