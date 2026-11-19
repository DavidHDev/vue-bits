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
          <MoltenMetal :key="rerenderKey" v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="Molten green caustics that flow like liquid." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="5"
            :model-value="settings.colors"
            @update:model-value="(value: string[]) => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Core Color"
            :color="settings.coreColor"
            @change="(value: string) => updateProp('coreColor', value)"
          />
          <PreviewSelect
            title="Color Mode"
            :options="COLOR_MODE_OPTIONS"
            :model-value="settings.colorMode"
            @update:model-value="(value: string | number) => updateProp('colorMode', value as MoltenMetalColorMode)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="1.5"
            :step="0.01"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="2"
            :max="10"
            :step="0.1"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Detail"
            :min="1"
            :max="8"
            :step="0.1"
            :model-value="settings.detail"
            @update:model-value="(value: number) => updateProp('detail', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0.4"
            :max="3"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0.6"
            :max="1.6"
            :step="0.01"
            :model-value="settings.thickness"
            @update:model-value="(value: number) => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Swirl"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.swirl"
            @update:model-value="(value: number) => updateProp('swirl', value)"
          />
          <PreviewSlider
            title="Turbulence"
            :min="0.05"
            :max="0.4"
            :step="0.01"
            :model-value="settings.turbulence"
            @update:model-value="(value: number) => updateProp('turbulence', value)"
          />
          <PreviewSlider
            title="Haze"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.haze"
            @update:model-value="(value: number) => updateProp('haze', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.4"
            :max="2.5"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
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
          <PreviewSlider
            title="Offset X"
            :min="-0.5"
            :max="0.5"
            :step="0.01"
            :model-value="settings.offsetX"
            @update:model-value="(value: number) => updateProp('offsetX', value)"
          />
          <PreviewSlider
            title="Offset Y"
            :min="-0.5"
            :max="0.5"
            :step="0.01"
            :model-value="settings.offsetY"
            @update:model-value="(value: number) => updateProp('offsetY', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.2"
            :step="0.005"
            :model-value="settings.grain"
            @update:model-value="(value: number) => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.opacity"
            @update:model-value="(value: number) => updateProp('opacity', value)"
          />
          <PreviewSlider
            title="Drift"
            :min="0"
            :max="1"
            :step="0.01"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.drift"
            @update:model-value="(value: number) => updateProp('drift', value)"
          />
          <PreviewSlider
            title="Cursor Heat"
            :min="0"
            :max="1"
            :step="0.01"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.mouseStrength"
            @update:model-value="(value: number) => updateProp('mouseStrength', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="(value: boolean) => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Cursor"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Flare on Click"
            :model-value="settings.flareOnClick"
            @update:model-value="(value: boolean) => updateProp('flareOnClick', value)"
          />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="(value: boolean) => updateProp('lightMode', value)"
          />
          <PreviewSwitch
            title="Pause"
            :model-value="settings.paused"
            @update:model-value="(value: boolean) => updateProp('paused', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="moltenMetal" component-name="MoltenMetal" />
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
import { moltenMetal } from '@/constants/code/Backgrounds/moltenMetalCode';
import MoltenMetal from '@/content/Backgrounds/MoltenMetal/MoltenMetal.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps, type MoltenMetalColorMode } from './presets/MoltenMetal';

const COLOR_MODE_OPTIONS = [
  { value: 'molten', label: 'Molten' },
  { value: 'ember', label: 'Ember' },
  { value: 'frost', label: 'Frost' }
];

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#42b883', '#a0ffbc']",
    description: 'Gradient the metal heats through, from the dim glow to the hot body. Up to five colors.'
  },
  {
    name: 'coreColor',
    type: 'string',
    default: "'#FFFFFF'",
    description: 'Color of the white-hot cores at the end of the gradient.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Fills the canvas behind the metal. Transparent lets the page show through.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description:
      'Draws the flow as colored ink for light pages. Pair it with mid-tone colors that deepen toward the core.'
  },
  { name: 'speed', type: 'number', default: '0.35', description: 'How fast the metal flows.' },
  { name: 'scale', type: 'number', default: '4', description: 'Zoom of the flow. Higher fits more of it on screen.' },
  {
    name: 'detail',
    type: 'number',
    default: '3',
    description: 'Layers of folded filaments, from 1 to 8. Fractions blend between layers.'
  },
  { name: 'glow', type: 'number', default: '1.6', description: 'How much heat the filaments carry.' },
  {
    name: 'thickness',
    type: 'number',
    default: '1',
    description: 'Width of the filaments and their white-hot cores.'
  },
  { name: 'swirl', type: 'number', default: '1', description: 'How tightly the flow spirals.' },
  { name: 'turbulence', type: 'number', default: '0.2', description: 'How strongly each layer folds the flow.' },
  {
    name: 'haze',
    type: 'number',
    default: '0.75',
    description: 'Soft glow between the filaments. 0 leaves only the filaments.'
  },
  { name: 'brightness', type: 'number', default: '1.3', description: 'Overall brightness.' },
  {
    name: 'colorMode',
    type: "'molten' | 'ember' | 'frost'",
    default: "'molten'",
    description: 'Balance of the gradient. Ember runs hotter, frost stays cooler.'
  },
  { name: 'rotation', type: 'number', default: '0', description: 'Rotation of the whole flow in degrees.' },
  {
    name: 'offsetX',
    type: 'number',
    default: '0',
    description: 'Moves the flow sideways, as a fraction of the width.'
  },
  {
    name: 'offsetY',
    type: 'number',
    default: '0',
    description: 'Moves the flow up or down, as a fraction of the height.'
  },
  {
    name: 'drift',
    type: 'number',
    default: '0.3',
    description: 'How far the flow drifts as the cursor moves. 0 keeps it still.'
  },
  { name: 'grain', type: 'number', default: '0.05', description: 'Film grain in the glow. 0 turns it off.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Ignites the metal from its hottest cores outward the first time it comes into view.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The cursor heats the filaments it passes over, leaving a trail that slowly cools.'
  },
  { name: 'mouseStrength', type: 'number', default: '0.5', description: 'How hot the cursor runs.' },
  {
    name: 'flareOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Clicking flares the nearby filaments white-hot before they cool back down.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the flow.' },
  { name: 'dpr', type: 'number', default: '2', description: 'Maximum device pixel ratio of the canvas.' },
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
</script>
