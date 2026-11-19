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
          <Iridescence v-bind="settings" />
          <BackgroundContent headline="Radiant iridescence with customizable colors" />
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
            title="Hue Shift"
            :min="-180"
            :max="180"
            :step="1"
            value-unit="°"
            :model-value="settings.hueShift"
            @update:model-value="(value: number) => updateProp('hueShift', value)"
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
            title="Brightness"
            :min="0.2"
            :max="2.5"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Contrast"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.contrast"
            @update:model-value="(value: number) => updateProp('contrast', value)"
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
            title="Scale"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Detail"
            :min="1"
            :max="16"
            :step="1"
            :model-value="settings.detail"
            @update:model-value="(value: number) => updateProp('detail', value)"
          />
          <PreviewSlider
            title="Warp"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.warp"
            @update:model-value="(value: number) => updateProp('warp', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="-180"
            :max="180"
            :step="1"
            value-unit="°"
            :model-value="settings.rotation"
            @update:model-value="(value: number) => updateProp('rotation', value)"
          />
          <PreviewSwitch
            title="Mouse React"
            :model-value="settings.mouseReact"
            @update:model-value="(value: boolean) => updateProp('mouseReact', value)"
          />
          <PreviewSlider
            title="Amplitude"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.amplitude"
            @update:model-value="(value: number) => updateProp('amplitude', value)"
          />
          <PreviewSlider
            title="Stir"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.stir"
            @update:model-value="(value: number) => updateProp('stir', value)"
          />
          <PreviewSlider
            title="Sheen"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.sheen"
            @update:model-value="(value: number) => updateProp('sheen', value)"
          />
          <PreviewSwitch
            title="Click Swirl"
            :model-value="settings.clickSwirl"
            @update:model-value="(value: boolean) => updateProp('clickSwirl', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.grain"
            @update:model-value="(value: number) => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="iridescence" component-name="Iridescence" />
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
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { iridescence } from '@/constants/code/Backgrounds/iridescenceCode';
import Iridescence from '@/content/Backgrounds/Iridescence/Iridescence.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Iridescence';

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string | number[]',
    default: '[1, 1, 1]',
    description: 'Tint multiplied over the colors. Any CSS color, or an RGB array from 0 to 1.'
  },
  { name: 'hueShift', type: 'number', default: '0', description: 'Rotates the hues, in degrees.' },
  {
    name: 'saturation',
    type: 'number',
    default: '1',
    description: 'Color intensity. 0 gives a monochrome chrome look.'
  },
  { name: 'brightness', type: 'number', default: '1.5', description: 'Overall brightness.' },
  { name: 'contrast', type: 'number', default: '1', description: 'Contrast between the folds.' },
  { name: 'speed', type: 'number', default: '1', description: 'Animation speed. 0 holds the pattern still.' },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Size of the pattern. Higher values give broader folds.'
  },
  {
    name: 'detail',
    type: 'number',
    default: '8',
    description: 'How many layers of folds are stacked. Lower is softer, higher is more intricate.'
  },
  { name: 'warp', type: 'number', default: '1', description: 'How strongly the folds bend into each other.' },
  { name: 'rotation', type: 'number', default: '0', description: 'Rotation of the pattern in degrees.' },
  {
    name: 'mouseReact',
    type: 'boolean',
    default: 'true',
    description: 'Turns the pointer interactions on or off: parallax, stir and sheen.'
  },
  { name: 'amplitude', type: 'number', default: '0.1', description: 'How far the pattern drifts toward the pointer.' },
  {
    name: 'stir',
    type: 'number',
    default: '0.5',
    description: 'Drags the folds along with the pointer like a liquid. 0 turns it off.'
  },
  { name: 'sheen', type: 'number', default: '0.3', description: 'Brightens the surface softly around the pointer.' },
  {
    name: 'clickSwirl',
    type: 'boolean',
    default: 'true',
    description: 'Stirs a swirl into the surface wherever you click, which slowly unwinds.'
  },
  { name: 'grain', type: 'number', default: '0', description: 'Film grain over the surface, from 0 to 1.' },
  {
    name: 'fade',
    type: 'number',
    default: '0',
    description: 'Fades the edges into the page, from 0 to 1. The canvas is transparent where it fades.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'resolution',
    type: 'number',
    default: '1',
    description: 'Render scale. Lower values trade sharpness for speed on large screens.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

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
