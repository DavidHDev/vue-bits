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
          <SoftAurora :key="rerenderKey" v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="A gentle glow to light your way!" />
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
            title="Color 1"
            :color="settings.color1"
            @change="(value: string) => updateProp('color1', value)"
          />
          <PreviewColorPickerCustom
            title="Color 2"
            :color="settings.color2"
            @change="(value: string) => updateProp('color2', value)"
          />
          <PreviewSlider
            title="Spectrum"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.spectrum"
            @update:model-value="(value: number) => updateProp('spectrum', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Color Speed"
            :min="0"
            :max="5"
            :step="0.1"
            :model-value="settings.colorSpeed"
            @update:model-value="(value: number) => updateProp('colorSpeed', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.1"
            :max="3"
            :step="0.1"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.1"
            :max="3"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Noise Frequency"
            :min="0.5"
            :max="10"
            :step="0.5"
            :model-value="settings.noiseFrequency"
            @update:model-value="(value: number) => updateProp('noiseFrequency', value)"
          />
          <PreviewSlider
            title="Noise Amplitude"
            :min="0"
            :max="5"
            :step="0.1"
            :model-value="settings.noiseAmplitude"
            @update:model-value="(value: number) => updateProp('noiseAmplitude', value)"
          />
          <PreviewSlider
            title="Band Height"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.bandHeight"
            @update:model-value="(value: number) => updateProp('bandHeight', value)"
          />
          <PreviewSlider
            title="Band Spread"
            :min="0.1"
            :max="3"
            :step="0.05"
            :model-value="settings.bandSpread"
            @update:model-value="(value: number) => updateProp('bandSpread', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="-45"
            :max="45"
            :step="1"
            :model-value="settings.tilt"
            @update:model-value="(value: number) => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Octave Decay"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.octaveDecay"
            @update:model-value="(value: number) => updateProp('octaveDecay', value)"
          />
          <PreviewSlider
            title="Layer Offset"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.layerOffset"
            @update:model-value="(value: number) => updateProp('layerOffset', value)"
          />
          <PreviewSlider
            title="Mouse Influence"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.mouseInfluence"
            @update:model-value="(value: number) => updateProp('mouseInfluence', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.enableMouseInteraction"
            @update:model-value="(value: boolean) => updateProp('enableMouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Pulse"
            :model-value="settings.clickPulse"
            @update:model-value="(value: boolean) => updateProp('clickPulse', value)"
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
        <CodeExample :code-object="softAurora" component-name="SoftAurora" />
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
import { softAurora } from '@/constants/code/Backgrounds/softAuroraCode';
import SoftAurora from '@/content/Backgrounds/SoftAurora/SoftAurora.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/SoftAurora';

const propData: PropRow[] = [
  { name: 'color1', type: 'string', default: "'#f7f7f7'", description: 'Tint of the first aurora layer.' },
  { name: 'color2', type: 'string', default: "'#7cff67'", description: 'Tint of the second aurora layer.' },
  {
    name: 'spectrum',
    type: 'number',
    default: '1',
    description:
      'How much of the shifting rainbow shows through the tints, from 0 to 1. 0 uses the two colors as they are.'
  },
  { name: 'speed', type: 'number', default: '0.6', description: 'Overall animation speed.' },
  { name: 'colorSpeed', type: 'number', default: '1', description: 'How fast the colors drift along the band.' },
  { name: 'scale', type: 'number', default: '1.5', description: 'Scale of the noise that shapes the band.' },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness.' },
  { name: 'noiseFrequency', type: 'number', default: '2.5', description: 'How tightly the band ripples.' },
  { name: 'noiseAmplitude', type: 'number', default: '1', description: 'How far the band waves up and down.' },
  {
    name: 'bandHeight',
    type: 'number',
    default: '0.5',
    description: 'Vertical position of the band, from 0 at the bottom to 1 at the top.'
  },
  {
    name: 'bandSpread',
    type: 'number',
    default: '1',
    description: 'How tight and bright the band is. Lower values spread it into a wide, soft glow.'
  },
  { name: 'tilt', type: 'number', default: '0', description: 'Tilts the band by this many degrees.' },
  {
    name: 'octaveDecay',
    type: 'number',
    default: '0.1',
    description: 'How much fine ripple sits on top of the large waves.'
  },
  {
    name: 'layerOffset',
    type: 'number',
    default: '0',
    description: 'Shifts the second layer in time so the two separate.'
  },
  {
    name: 'enableMouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The aurora drifts with the cursor and reaches toward it when it comes close.'
  },
  { name: 'mouseInfluence', type: 'number', default: '0.25', description: 'Strength of the cursor drift and reach.' },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a soft pulse of light along the band.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The band starts as a thin line and blooms in on mount.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Prints the aurora as soft colored ink so it sits on light pages.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall opacity, from 0 to 1.' },
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

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
