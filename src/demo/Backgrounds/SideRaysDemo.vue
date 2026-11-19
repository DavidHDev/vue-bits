<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="colors"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <SideRays :key="rerenderKey" v-bind="{ ...settings, ...colors }" />
          <BackgroundContent headline="Light cascading from the corner." />
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
            title="Origin"
            :options="ORIGIN_OPTIONS"
            :model-value="settings.origin"
            @update:model-value="(value: string | number) => updateProp('origin', value as SideRaysOrigin)"
          />
          <PreviewColorPickerCustom
            title="Ray Color 1"
            :color="colors.rayColor1"
            @change="(value: string) => updateProp('rayColor1', value)"
          />
          <PreviewColorPickerCustom
            title="Ray Color 2"
            :color="colors.rayColor2"
            @change="(value: string) => updateProp('rayColor2', value)"
          />
          <PreviewSlider
            title="Blend"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.blend"
            @update:model-value="(value: number) => updateProp('blend', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="6"
            :step="0.1"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.2"
            :max="4"
            :step="0.05"
            :model-value="settings.intensity"
            @update:model-value="(value: number) => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0.3"
            :max="4"
            :step="0.05"
            :model-value="settings.spread"
            @update:model-value="(value: number) => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Density"
            :min="1"
            :max="20"
            :step="0.5"
            :model-value="settings.density"
            @update:model-value="(value: number) => updateProp('density', value)"
          />
          <PreviewSlider
            title="Sharpness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.sharpness"
            @update:model-value="(value: number) => updateProp('sharpness', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="-60"
            :max="60"
            :step="1"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="(value: number) => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Falloff"
            :min="0.5"
            :max="4"
            :step="0.05"
            :model-value="settings.falloff"
            @update:model-value="(value: number) => updateProp('falloff', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
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
            title="Dust"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.dust"
            @update:model-value="(value: number) => updateProp('dust', value)"
          />
          <PreviewSlider
            title="Mouse Influence"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.mouseInfluence"
            @update:model-value="(value: number) => updateProp('mouseInfluence', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.opacity"
            @update:model-value="(value: number) => updateProp('opacity', value)"
          />
          <PreviewSwitch
            title="Follow Mouse"
            :model-value="settings.followMouse"
            @update:model-value="(value: boolean) => updateProp('followMouse', value)"
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
        <CodeExample :code-object="sideRays" component-name="SideRays" />
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
import { sideRays } from '@/constants/code/Backgrounds/sideRaysCode';
import SideRays from '@/content/Backgrounds/SideRays/SideRays.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps, swapColor, type SideRaysOrigin } from './presets/SideRays';

const ORIGIN_OPTIONS = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' }
];

const propData: PropRow[] = [
  {
    name: 'rayColor1',
    type: 'string',
    default: "'#FFC46B'",
    description: 'Color of the first layer of rays, on the upper side of the fan.'
  },
  {
    name: 'rayColor2',
    type: 'string',
    default: "'#96c8ff'",
    description: 'Color of the second layer of rays, on the lower side of the fan.'
  },
  {
    name: 'blend',
    type: 'number',
    default: '0.6',
    description: 'Balance between the two layers, from 0 (only the first color) to 1 (only the second).'
  },
  {
    name: 'origin',
    type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'right' | 'left'",
    default: "'top-right'",
    description: 'Corner or side the light shines in from.'
  },
  { name: 'speed', type: 'number', default: '2.5', description: 'How fast the rays shimmer and sway. 0 freezes them.' },
  { name: 'intensity', type: 'number', default: '2', description: 'Brightness of the light.' },
  { name: 'spread', type: 'number', default: '2', description: 'How wide the rays fan out.' },
  {
    name: 'density',
    type: 'number',
    default: '5',
    description: 'How many separate rays the light breaks into. Higher values give finer rays.'
  },
  {
    name: 'sharpness',
    type: 'number',
    default: '0.5',
    description: 'How crisp the edges of the rays are, from soft haze at 0 to defined beams at 1.'
  },
  { name: 'tilt', type: 'number', default: '0', description: 'Rotates the rays, in degrees.' },
  {
    name: 'falloff',
    type: 'number',
    default: '1.6',
    description: 'How quickly the light fades with distance. Lower values let the rays reach further.'
  },
  { name: 'glow', type: 'number', default: '1', description: 'Brightness of the glow where the light enters.' },
  {
    name: 'saturation',
    type: 'number',
    default: '1',
    description: 'Color saturation of the light. 0 is grayscale.'
  },
  {
    name: 'dust',
    type: 'number',
    default: '0',
    description: 'Amount of dust drifting in the light, from 0 to 1. Specks only show inside the rays.'
  },
  {
    name: 'followMouse',
    type: 'boolean',
    default: 'true',
    description: 'The rays lean toward the cursor and the ray under it brightens.'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '0.5',
    description: 'How strongly the rays follow the cursor, from 0 to 1.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'The rays grow out from their source on mount.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Renders the rays as soft tinted light for light backgrounds.'
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

const colors = computed(() => ({
  rayColor1: swapColor(settings.value.rayColor1, settings.value.lightMode),
  rayColor2: swapColor(settings.value.rayColor2, settings.value.lightMode)
}));

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
