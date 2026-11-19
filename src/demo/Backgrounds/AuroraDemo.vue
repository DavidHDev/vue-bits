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
          <Aurora :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Bring the Arctic to you, with one line of code" />
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
            v-for="(title, index) in COLOR_TITLES"
            :key="title"
            :title="title"
            :color="settings.colorStops[index] ?? settings.colorStops[0]"
            @change="(value: string) => setColor(index, value)"
          />
          <PreviewSelect
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="(value: string | number) => updateProp('direction', value as 'top' | 'bottom')"
          />
          <PreviewSlider
            title="Height"
            :min="0.1"
            :max="0.9"
            :step="0.01"
            :model-value="settings.height"
            @update:model-value="(value: number) => updateProp('height', value)"
          />
          <PreviewSlider
            title="Amplitude"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.amplitude"
            @update:model-value="(value: number) => updateProp('amplitude', value)"
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
            title="Glow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
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
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.2"
            :max="2"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Layers"
            :min="1"
            :max="3"
            :step="1"
            :model-value="settings.layers"
            @update:model-value="(value: number) => updateProp('layers', value)"
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
        <CodeExample :code-object="aurora" component-name="Aurora" />
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
import { aurora } from '@/constants/code/Backgrounds/auroraCode';
import Aurora from '@/content/Backgrounds/Aurora/Aurora.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Aurora';

const COLOR_TITLES = ['Color 1', 'Color 2', 'Color 3'];

const DIRECTION_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' }
];

const propData: PropRow[] = [
  {
    name: 'colorStops',
    type: 'string[]',
    default: "['#42b883', '#7cff67', '#42b883']",
    description: 'Two to five colors that blend across the aurora from left to right.'
  },
  { name: 'amplitude', type: 'number', default: '1', description: 'How tall the waves along the edge are.' },
  { name: 'blend', type: 'number', default: '0.5', description: 'How softly the edge fades out, from 0 to 1.' },
  {
    name: 'height',
    type: 'number',
    default: '0.45',
    description: 'How far the aurora reaches into the container, from 0 to 1.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Speed of the flowing motion.' },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Size of the waves. Lower values make broader, calmer shapes.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0.6',
    description: 'How far the light spills softly past the edge.'
  },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness of the light.' },
  {
    name: 'layers',
    type: 'number',
    default: '1',
    description: 'Number of curtains, from 1 to 3. Extra ones glow fainter behind for depth.'
  },
  {
    name: 'direction',
    type: "'top' | 'bottom'",
    default: "'top'",
    description: 'Whether the aurora hangs from the top or rises from the bottom.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The light gently reaches toward the cursor.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Fades the aurora in as it unfurls on mount.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the aurora as soft pastel light for white backgrounds.'
  },
  {
    name: 'time',
    type: 'number',
    default: '-',
    description: 'Drives the animation from your own clock, for example scroll progress, instead of real time.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
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

const setColor = (index: number, value: string) => {
  const next = [...settings.value.colorStops];
  next[index] = value;
  updateProp('colorStops', next);
};
</script>
