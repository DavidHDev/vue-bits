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
          <DotField :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Hover to magnify, hold to zoom in." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Pattern"
            :options="PATTERN_OPTIONS"
            :model-value="settings.pattern"
            @update:model-value="(value: string | number) => updateProp('pattern', value as DotFieldPattern)"
          />
          <PreviewColorPickerCustom
            title="Gradient From"
            :color="settings.gradientFrom"
            @change="(value: string) => updateProp('gradientFrom', value)"
          />
          <PreviewColorPickerCustom
            title="Gradient To"
            :color="settings.gradientTo"
            @change="(value: string) => updateProp('gradientTo', value)"
          />
          <PreviewColorPickerCustom
            title="Glow Color"
            :color="settings.glowColor"
            @change="(value: string) => updateProp('glowColor', value)"
          />
          <PreviewSlider
            title="Gradient Angle"
            :min="0"
            :max="360"
            :step="1"
            :model-value="settings.gradientAngle"
            @update:model-value="(value: number) => updateProp('gradientAngle', value)"
          />
          <PreviewSlider
            title="Dot Radius"
            :min="0.5"
            :max="5"
            :step="0.1"
            :model-value="settings.dotRadius"
            @update:model-value="(value: number) => updateProp('dotRadius', value)"
          />
          <PreviewSlider
            title="Dot Spacing"
            :min="4"
            :max="40"
            :step="1"
            :model-value="settings.dotSpacing"
            @update:model-value="(value: number) => updateProp('dotSpacing', value)"
          />
          <PreviewSlider
            title="Cursor Radius"
            :min="60"
            :max="600"
            :step="10"
            :model-value="settings.cursorRadius"
            @update:model-value="(value: number) => updateProp('cursorRadius', value)"
          />
          <PreviewSlider
            title="Bulge Strength"
            :min="-1"
            :max="1"
            :step="0.05"
            :model-value="settings.bulgeStrength"
            @update:model-value="(value: number) => updateProp('bulgeStrength', value)"
          />
          <PreviewSlider
            title="Twist"
            :min="-360"
            :max="360"
            :step="5"
            :model-value="settings.twist"
            @update:model-value="(value: number) => updateProp('twist', value)"
          />
          <PreviewSlider
            title="Glow Radius"
            :min="0"
            :max="500"
            :step="10"
            :model-value="settings.glowRadius"
            @update:model-value="(value: number) => updateProp('glowRadius', value)"
          />
          <PreviewSlider
            title="Glow Intensity"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.glowIntensity"
            @update:model-value="(value: number) => updateProp('glowIntensity', value)"
          />
          <PreviewSlider
            title="Base Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.baseOpacity"
            @update:model-value="(value: number) => updateProp('baseOpacity', value)"
          />
          <PreviewSlider
            title="Wave Amplitude"
            :min="0"
            :max="20"
            :step="0.5"
            :model-value="settings.waveAmplitude"
            @update:model-value="(value: number) => updateProp('waveAmplitude', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSwitch
            title="Sparkle"
            :model-value="settings.sparkle"
            @update:model-value="(value: boolean) => updateProp('sparkle', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="(value: boolean) => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Hold To Zoom"
            :model-value="settings.holdToZoom"
            @update:model-value="(value: boolean) => updateProp('holdToZoom', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="onIntro" />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="(value: boolean) => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="dotField" component-name="DotField" />
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
import { dotField } from '@/constants/code/Backgrounds/dotFieldCode';
import DotField from '@/content/Backgrounds/DotField/DotField.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps, type DotFieldPattern } from './presets/DotField';

const PATTERN_OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'hex', label: 'Hex' },
  { value: 'spiral', label: 'Spiral' },
  { value: 'scatter', label: 'Scatter' }
];

const propData: PropRow[] = [
  { name: 'dotRadius', type: 'number', default: '1.5', description: 'Radius of each dot in pixels.' },
  { name: 'dotSpacing', type: 'number', default: '14', description: 'Gap between neighbouring dots in pixels.' },
  {
    name: 'pattern',
    type: "'grid' | 'hex' | 'spiral' | 'scatter'",
    default: "'grid'",
    description: 'How the dots are laid out: square rows, offset honeycomb rows, a sunflower spiral or a loose scatter.'
  },
  { name: 'gradientFrom', type: 'string', default: "'#7cff67'", description: 'Color the gradient starts from.' },
  { name: 'gradientTo', type: 'string', default: "'#a0ffbc'", description: 'Color the gradient ends on.' },
  {
    name: 'gradientAngle',
    type: 'number',
    default: '135',
    description: 'Direction of the gradient in degrees, the same as CSS linear-gradient.'
  },
  {
    name: 'cursorRadius',
    type: 'number',
    default: '240',
    description: 'Radius of the lens that follows the cursor, in pixels.'
  },
  {
    name: 'bulgeStrength',
    type: 'number',
    default: '0.6',
    description: 'How much the lens magnifies the dots under it, from -1 to 1. Negative values pinch them inward.'
  },
  {
    name: 'twist',
    type: 'number',
    default: '0',
    description: 'Swirls the dots around the cursor by this many degrees. Negative values swirl the other way.'
  },
  {
    name: 'glowColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color the dots inside the glow light up to.'
  },
  {
    name: 'glowRadius',
    type: 'number',
    default: '160',
    description: 'Radius of the glow around the cursor, in pixels. 0 turns it off.'
  },
  {
    name: 'glowIntensity',
    type: 'number',
    default: '0.8',
    description: 'How strongly the dots inside the glow light up and bloom.'
  },
  {
    name: 'baseOpacity',
    type: 'number',
    default: '0.55',
    description: 'Opacity of the dots outside the glow, from 0 to 1.'
  },
  {
    name: 'waveAmplitude',
    type: 'number',
    default: '0',
    description: 'How far the dots drift in a slow rolling wave, in pixels. 0 keeps the field still.'
  },
  {
    name: 'sparkle',
    type: 'boolean',
    default: 'false',
    description: 'A few dots at a time softly grow and brighten, like stars twinkling.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'How fast the wave and the sparkles animate.' },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'The lens follows the cursor or finger. Turn off for a purely ambient background.'
  },
  {
    name: 'holdToZoom',
    type: 'boolean',
    default: 'true',
    description: 'Pressing and holding deepens the lens to look closer.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'The field pulls into focus on mount.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Prints the dots as ink so they stay crisp on light backgrounds.'
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

const onIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
