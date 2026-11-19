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
          <Plasma :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Minimal plasma waves that soothe the eyes" />
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
            title="Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.direction"
            @update:model-value="(value: string | number) => updateProp('direction', value as PlasmaDirection)"
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
            :min="0.5"
            :max="2"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Twist"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.twist"
            @update:model-value="(value: number) => updateProp('twist', value)"
          />
          <PreviewSlider
            title="Wave"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.wave"
            @update:model-value="(value: number) => updateProp('wave', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.softness"
            @update:model-value="(value: number) => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Shine"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.shine"
            @update:model-value="(value: number) => updateProp('shine', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.15"
            :step="0.01"
            :model-value="settings.grain"
            @update:model-value="(value: number) => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Quality"
            :min="0.25"
            :max="1"
            :step="0.05"
            :model-value="settings.quality"
            @update:model-value="(value: number) => updateProp('quality', value)"
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
            title="Mouse Interactive"
            :model-value="settings.mouseInteractive"
            @update:model-value="(value: boolean) => updateProp('mouseInteractive', value)"
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
        <CodeExample :code-object="plasma" component-name="Plasma" />
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
import { plasma } from '@/constants/code/Backgrounds/plasmaCode';
import Plasma from '@/content/Backgrounds/Plasma/Plasma.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Plasma';

type PlasmaDirection = 'forward' | 'reverse' | 'pingpong';

const DIRECTION_OPTIONS = [
  { value: 'forward', label: 'Forward' },
  { value: 'reverse', label: 'Reverse' },
  { value: 'pingpong', label: 'Ping Pong' }
];

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#a3b8aa'",
    description: 'Color of the plasma. Highlights are derived from it.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Animation speed.' },
  {
    name: 'direction',
    type: "'forward' | 'reverse' | 'pingpong'",
    default: "'forward'",
    description: 'Which way the plasma flows. Ping pong eases back and forth.'
  },
  { name: 'scale', type: 'number', default: '1', description: 'Zoom of the plasma. Higher values zoom in.' },
  { name: 'twist', type: 'number', default: '1', description: 'How tightly the plasma spirals.' },
  { name: 'wave', type: 'number', default: '1', description: 'How much the plasma ripples as it flows.' },
  {
    name: 'softness',
    type: 'number',
    default: '0.5',
    description: 'How soft the folds of light are, from 0 for crisp to 1 for misty.'
  },
  { name: 'shine', type: 'number', default: '1', description: 'Strength of the bright highlights along the folds.' },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness.' },
  { name: 'grain', type: 'number', default: '0.04', description: 'Strength of the film grain.' },
  {
    name: 'quality',
    type: 'number',
    default: '0.75',
    description: 'Render resolution, from 0.25 to 1. Lower values run faster on slow devices.'
  },
  {
    name: 'mouseInteractive',
    type: 'boolean',
    default: 'true',
    description: 'Turns the plasma in 3D to follow the cursor and brightens it nearby.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Fades the plasma in as it twists into place.' },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the plasma as tinted satin for light backgrounds.'
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
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};
</script>
