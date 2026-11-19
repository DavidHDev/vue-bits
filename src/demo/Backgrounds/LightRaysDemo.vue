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
          <LightRays :key="rerenderKey" v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="May these lights guide you on your path" />
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
            title="Rays Origin"
            :options="ORIGIN_OPTIONS"
            :model-value="settings.raysOrigin"
            @update:model-value="(value: string | number) => updateProp('raysOrigin', value as RaysOrigin)"
          />
          <PreviewColorPickerCustom
            title="Rays Color"
            :color="settings.raysColor"
            @change="(value: string) => updateProp('raysColor', value)"
          />
          <PreviewSlider
            title="Rays Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.raysSpeed"
            @update:model-value="(value: number) => updateProp('raysSpeed', value)"
          />
          <PreviewSlider
            title="Light Spread"
            :min="0.1"
            :max="2"
            :step="0.01"
            :model-value="settings.lightSpread"
            @update:model-value="(value: number) => updateProp('lightSpread', value)"
          />
          <PreviewSlider
            title="Ray Length"
            :min="0.5"
            :max="4"
            :step="0.1"
            :model-value="settings.rayLength"
            @update:model-value="(value: number) => updateProp('rayLength', value)"
          />
          <PreviewSlider
            title="Ray Density"
            :min="0.3"
            :max="4"
            :step="0.1"
            :model-value="settings.rayDensity"
            @update:model-value="(value: number) => updateProp('rayDensity', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="-60"
            :max="60"
            :step="1"
            :model-value="settings.tilt"
            @update:model-value="(value: number) => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Ray Sharpness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.raySharpness"
            @update:model-value="(value: number) => updateProp('raySharpness', value)"
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
            title="Haze"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.haze"
            @update:model-value="(value: number) => updateProp('haze', value)"
          />
          <PreviewSlider
            title="Atmosphere"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.atmosphere"
            @update:model-value="(value: number) => updateProp('atmosphere', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.2"
            :max="2"
            :step="0.05"
            :model-value="settings.intensity"
            @update:model-value="(value: number) => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Fade Distance"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.fadeDistance"
            @update:model-value="(value: number) => updateProp('fadeDistance', value)"
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
            title="Mouse Influence"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.mouseInfluence"
            @update:model-value="(value: number) => updateProp('mouseInfluence', value)"
          />
          <PreviewSlider
            title="Noise Amount"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.noiseAmount"
            @update:model-value="(value: number) => updateProp('noiseAmount', value)"
          />
          <PreviewSlider
            title="Distortion"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.distortion"
            @update:model-value="(value: number) => updateProp('distortion', value)"
          />
          <PreviewSwitch
            title="Pulsating"
            :model-value="settings.pulsating"
            @update:model-value="(value: boolean) => updateProp('pulsating', value)"
          />
          <PreviewSwitch
            title="Follow Mouse"
            :model-value="settings.followMouse"
            @update:model-value="(value: boolean) => updateProp('followMouse', value)"
          />
          <PreviewSwitch
            title="Cursor Shadow"
            :model-value="settings.cursorShadow"
            @update:model-value="(value: boolean) => updateProp('cursorShadow', value)"
          />
          <PreviewSwitch
            title="Click Pulse"
            :model-value="settings.clickPulse"
            @update:model-value="(value: boolean) => updateProp('clickPulse', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="(value: boolean) => setIntro(value)"
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
        <CodeExample :code-object="lightRays" component-name="LightRays" />
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
import { lightRays } from '@/constants/code/Backgrounds/lightRaysCode';
import LightRays from '@/content/Backgrounds/LightRays/LightRays.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps, type RaysOrigin } from './presets/LightRays';

const ORIGIN_OPTIONS = [
  { value: 'top-center', label: 'Top' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'bottom-center', label: 'Bottom' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' }
];

const propData: PropRow[] = [
  {
    name: 'raysOrigin',
    type: 'RaysOrigin',
    default: "'top-center'",
    description:
      "Where the light comes from: 'top-center', 'top-left', 'top-right', 'left', 'right', 'bottom-center', 'bottom-left' or 'bottom-right'."
  },
  { name: 'raysColor', type: 'string', default: "'#ffffff'", description: 'Color of the light.' },
  { name: 'raysSpeed', type: 'number', default: '1', description: 'Animation speed. 0 freezes the rays.' },
  {
    name: 'lightSpread',
    type: 'number',
    default: '0.5',
    description: 'How wide the beam opens. Lower values give a tight spotlight.'
  },
  { name: 'rayLength', type: 'number', default: '3', description: 'How far the rays reach, in container widths.' },
  { name: 'rayDensity', type: 'number', default: '1', description: 'How many separate shafts the beam splits into.' },
  { name: 'tilt', type: 'number', default: '0', description: 'Turns the beam by this many degrees.' },
  {
    name: 'raySharpness',
    type: 'number',
    default: '0.35',
    description: 'How crisp the edges of the shafts are, from 0 to 1.'
  },
  { name: 'glow', type: 'number', default: '0.6', description: 'Brightness of the glow around the light source.' },
  {
    name: 'haze',
    type: 'number',
    default: '0.25',
    description: 'Drifting haze that breaks the shafts up, like dust in the air, from 0 to 1.'
  },
  {
    name: 'atmosphere',
    type: 'number',
    default: '1',
    description: 'How much the light cools toward blue as it travels away from the source, from 0 to 1.'
  },
  { name: 'intensity', type: 'number', default: '1', description: 'Overall brightness of the light.' },
  { name: 'pulsating', type: 'boolean', default: 'false', description: 'The rays slowly breathe brighter and dimmer.' },
  {
    name: 'fadeDistance',
    type: 'number',
    default: '1',
    description: 'How far the rays travel before they dim, in container widths.'
  },
  { name: 'saturation', type: 'number', default: '1', description: 'Color saturation of the light.' },
  {
    name: 'followMouse',
    type: 'boolean',
    default: 'true',
    description: 'The beam turns toward the cursor.'
  },
  {
    name: 'mouseInfluence',
    type: 'number',
    default: '0.1',
    description: 'How far the beam turns toward the cursor, from 0 to 1.'
  },
  {
    name: 'cursorShadow',
    type: 'boolean',
    default: 'true',
    description: 'The cursor blocks the light and casts a soft shadow down the rays.'
  },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a wave of light down the rays.'
  },
  { name: 'noiseAmount', type: 'number', default: '0', description: 'Film grain over the rays, from 0 to 1.' },
  { name: 'distortion', type: 'number', default: '0', description: 'Makes the rays waver as if seen through heat.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'The rays grow out from the source on mount.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Prints the light as soft colored ink so it sits on light pages.'
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
