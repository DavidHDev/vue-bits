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
          <Grainient :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Grainy gradients that flow with you." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="2"
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
            title="Type"
            :options="TYPE_OPTIONS"
            :model-value="settings.type"
            @update:model-value="(value: string | number) => updateProp('type', value as 'linear' | 'radial')"
          />
          <PreviewSlider
            title="Angle"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :is-disabled="settings.type === 'radial'"
            :model-value="settings.angle"
            @update:model-value="(value: number) => updateProp('angle', value)"
          />
          <PreviewSlider
            title="Bands"
            :min="1"
            :max="6"
            :step="1"
            :model-value="settings.bands"
            @update:model-value="(value: number) => updateProp('bands', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.softness"
            @update:model-value="(value: number) => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Flow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.flow"
            @update:model-value="(value: number) => updateProp('flow', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.25"
            :max="3"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
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
            title="Silk"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.silk"
            @update:model-value="(value: number) => updateProp('silk', value)"
          />
          <PreviewSlider
            title="Grain Amount"
            :min="0"
            :max="0.3"
            :step="0.01"
            :model-value="settings.grainAmount"
            @update:model-value="(value: number) => updateProp('grainAmount', value)"
          />
          <PreviewSlider
            title="Grain Size"
            :min="0.5"
            :max="4"
            :step="0.1"
            value-unit="px"
            :model-value="settings.grainSize"
            @update:model-value="(value: number) => updateProp('grainSize', value)"
          />
          <PreviewSlider
            title="Contrast"
            :min="0.5"
            :max="1.6"
            :step="0.01"
            :model-value="settings.contrast"
            @update:model-value="(value: number) => updateProp('contrast', value)"
          />
          <PreviewSlider
            title="Saturation"
            :min="0"
            :max="2"
            :step="0.01"
            :model-value="settings.saturation"
            @update:model-value="(value: number) => updateProp('saturation', value)"
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
            title="Stir"
            :min="0"
            :max="2"
            :step="0.05"
            :is-disabled="!settings.interactive"
            :model-value="settings.stir"
            @update:model-value="(value: number) => updateProp('stir', value)"
          />
          <PreviewSwitch
            title="Animated Grain"
            :model-value="settings.grainAnimated"
            @update:model-value="(value: boolean) => updateProp('grainAnimated', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="(value: boolean) => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Click Swirl"
            :model-value="settings.clickSwirl"
            @update:model-value="(value: boolean) => updateProp('clickSwirl', value)"
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
        <CodeExample :code-object="grainient" component-name="Grainient" />
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
import { grainient } from '@/constants/code/Backgrounds/grainientCode';
import Grainient from '@/content/Backgrounds/Grainient/Grainient.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Grainient';

const TYPE_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' }
];

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#111111', '#2a0f0a', '#9a3412', '#f97316', '#fed7aa']",
    description:
      'Two to eight colors, from the base to the highlight. Use your page background as the first color so the edges blend in.'
  },
  {
    name: 'type',
    type: "'linear' | 'radial'",
    default: "'linear'",
    description: 'Linear runs the colors across the container. Radial puts the last color in the middle.'
  },
  {
    name: 'angle',
    type: 'number',
    default: '55',
    description: 'Direction of a linear gradient in degrees, like CSS: 0 runs bottom to top, 90 left to right.'
  },
  {
    name: 'bands',
    type: 'number',
    default: '1',
    description: 'How many times the colors repeat back and forth, from 1 to 8. Higher values make stripes or rings.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '1',
    description: 'Blend between colors, from 0 (crisp, poster-like edges) to 1 (smooth).'
  },
  {
    name: 'flow',
    type: 'number',
    default: '0.8',
    description: 'How much the gradient bends into waves, from 0 (straight) to 3. Above 1 it starts to marble.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Size of the waves, from 0.25 to 3.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Speed of the drifting waves. 0 holds them still.'
  },
  {
    name: 'silk',
    type: 'number',
    default: '0.35',
    description: 'Satin shading on the folds, from 0 to 1. Combine with bands for glossy ribbons.'
  },
  {
    name: 'grainAmount',
    type: 'number',
    default: '0.08',
    description: 'Strength of the film grain, from 0 to 0.5.'
  },
  {
    name: 'grainSize',
    type: 'number',
    default: '1.2',
    description: 'Size of the grain in pixels, from 0.5 to 4.'
  },
  {
    name: 'grainAnimated',
    type: 'boolean',
    default: 'true',
    description: 'Shifts the grain every frame like film. When off, the grain stays fixed.'
  },
  {
    name: 'contrast',
    type: 'number',
    default: '1',
    description: 'Contrast of the colors, from 0.2 to 2.'
  },
  {
    name: 'saturation',
    type: 'number',
    default: '1',
    description: 'Saturation of the colors, from 0 (grayscale) to 2.'
  },
  {
    name: 'variation',
    type: 'number',
    default: '0',
    description: 'Picks a different pattern of waves.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Lets the cursor drag the colors around like paint. The trail settles back after a moment.'
  },
  {
    name: 'stir',
    type: 'number',
    default: '1',
    description: 'How far the cursor drags the colors, from 0 to 2.'
  },
  {
    name: 'clickSwirl',
    type: 'boolean',
    default: 'true',
    description: 'Clicking twists the colors into a swirl that slowly unwinds.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Blooms the colors out from the middle on mount.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description:
      'Builds a light version of the palette: the first color becomes white and the others run in reverse, deepest last.'
  },
  {
    name: 'dpr',
    type: 'number',
    default: 'auto',
    description: 'Maximum device pixel ratio, capped at 2.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Extra class names for the container.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '-',
    description: 'Inline styles for the container.'
  }
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
