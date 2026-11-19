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
          <LiquidChrome :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Swirl through a pool of liquid chrome." />
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
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Amplitude"
            :min="0"
            :max="0.8"
            :step="0.01"
            :model-value="settings.amplitude"
            @update:model-value="(value: number) => updateProp('amplitude', value)"
          />
          <PreviewSlider
            title="Frequency X"
            :min="0.5"
            :max="8"
            :step="0.1"
            :model-value="settings.frequencyX"
            @update:model-value="(value: number) => updateProp('frequencyX', value)"
          />
          <PreviewSlider
            title="Frequency Y"
            :min="0.5"
            :max="8"
            :step="0.1"
            :model-value="settings.frequencyY"
            @update:model-value="(value: number) => updateProp('frequencyY', value)"
          />
          <PreviewSlider
            title="Detail"
            :min="1"
            :max="8"
            :step="1"
            :model-value="settings.detail"
            @update:model-value="(value: number) => updateProp('detail', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0.3"
            :max="2.5"
            :step="0.05"
            :model-value="settings.thickness"
            @update:model-value="(value: number) => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.depth"
            @update:model-value="(value: number) => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Roughness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.roughness"
            @update:model-value="(value: number) => updateProp('roughness', value)"
          />
          <PreviewSlider
            title="Exposure"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.exposure"
            @update:model-value="(value: number) => updateProp('exposure', value)"
          />
          <PreviewSlider
            title="Ripple Strength"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.rippleStrength"
            @update:model-value="(value: number) => updateProp('rippleStrength', value)"
          />
          <PreviewSlider
            title="Ripple Size"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.rippleSize"
            @update:model-value="(value: number) => updateProp('rippleSize', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.tilt"
            @update:model-value="(value: number) => updateProp('tilt', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="(value: boolean) => updateProp('interactive', value)"
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
        <CodeExample :code-object="liquidChrome" component-name="LiquidChrome" />
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
import { liquidChrome } from '@/constants/code/Backgrounds/liquidChromeCode';
import LiquidChrome from '@/content/Backgrounds/LiquidChrome/LiquidChrome.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/LiquidChrome';

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the metal. White is polished chrome, warmer tones give gold or copper.'
  },
  { name: 'speed', type: 'number', default: '0.2', description: 'How fast the chrome flows. 0 freezes it.' },
  { name: 'amplitude', type: 'number', default: '0.3', description: 'How strongly the flow swirls and folds.' },
  { name: 'frequencyX', type: 'number', default: '3', description: 'How tightly the flow folds horizontally.' },
  { name: 'frequencyY', type: 'number', default: '3', description: 'How tightly the flow folds vertically.' },
  {
    name: 'detail',
    type: 'number',
    default: '4',
    description: 'Layers of swirl, from 1 to 8. Low values give smooth, heavy shapes, high values intricate ones.'
  },
  { name: 'thickness', type: 'number', default: '1', description: 'Width of the chrome ribbons.' },
  {
    name: 'depth',
    type: 'number',
    default: '1',
    description: 'How steeply the chrome rises from the surface. Higher values catch more reflections.'
  },
  {
    name: 'roughness',
    type: 'number',
    default: '0.3',
    description: 'Softens the reflections, from a sharp mirror at 0 to a soft, frosted sheen at 1.'
  },
  { name: 'exposure', type: 'number', default: '1', description: 'Brightness of the reflections.' },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description:
      'The cursor leaves a wake in the liquid, clicks send ripples out and the reflections follow the cursor.'
  },
  { name: 'rippleStrength', type: 'number', default: '1', description: 'How visible the wake and ripples are.' },
  { name: 'rippleSize', type: 'number', default: '1', description: 'Size of the wake and ripples.' },
  {
    name: 'tilt',
    type: 'number',
    default: '1',
    description: 'How much the reflections sway and turn toward the cursor. 0 keeps the light still.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'The chrome rises from the surface when it mounts.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Lights the chrome for light pages, with soft gray contours instead of a dark studio.'
  },
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
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};
</script>
