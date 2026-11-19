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
          <Beams :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Radiant beams for creative user interfaces" />
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
            title="Beam Width"
            :min="40"
            :max="320"
            :step="2"
            value-unit="px"
            :model-value="settings.beamWidth"
            @update:model-value="(value: number) => updateProp('beamWidth', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="-90"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="settings.rotation"
            @update:model-value="(value: number) => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Wave Length"
            :min="80"
            :max="600"
            :step="1"
            value-unit="px"
            :model-value="settings.waveLength"
            @update:model-value="(value: number) => updateProp('waveLength', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0.2"
            :max="2.5"
            :step="0.05"
            :model-value="settings.depth"
            @update:model-value="(value: number) => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Sharpness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.sharpness"
            @update:model-value="(value: number) => updateProp('sharpness', value)"
          />
          <PreviewSlider
            title="Twist"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.twist"
            @update:model-value="(value: number) => updateProp('twist', value)"
          />
          <PreviewSlider
            title="Fill Light"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.fillLight"
            @update:model-value="(value: number) => updateProp('fillLight', value)"
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
            :min="0.4"
            :max="3"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
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
            title="Variation"
            :min="0"
            :max="20"
            :step="1"
            :model-value="settings.variation"
            @update:model-value="(value: number) => updateProp('variation', value)"
          />
          <PreviewSlider
            title="Mouse Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.mouseStrength"
            @update:model-value="(value: number) => updateProp('mouseStrength', value)"
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
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="(value: boolean) => updateProp('intro', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="beams" component-name="Beams" />
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
import { beams } from '@/constants/code/Backgrounds/beamsCode';
import Beams from '@/content/Backgrounds/Beams/Beams.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Beams';

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the light that glints off the beams.'
  },
  { name: 'beamWidth', type: 'number', default: '140', description: 'Width of each beam, in px.' },
  { name: 'rotation', type: 'number', default: '30', description: 'Angle of the beams, in degrees.' },
  { name: 'speed', type: 'number', default: '1', description: 'How fast the ripples move.' },
  {
    name: 'waveLength',
    type: 'number',
    default: '233',
    description: 'Length of the ripples along each beam, in px.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '1',
    description: 'How deep the ripples are. Deeper ripples catch the light in more places.'
  },
  {
    name: 'sharpness',
    type: 'number',
    default: '0.6',
    description: 'How crisp the glints are, from 0 for soft satin to 1 for sharp, glossy streaks.'
  },
  {
    name: 'twist',
    type: 'number',
    default: '0',
    description: 'Turns each beam slightly on its own axis, so glints show up on more beams.'
  },
  {
    name: 'fillLight',
    type: 'number',
    default: '0.3',
    description: 'Strength of a dimmer second light from the other side, for fuller, more metallic beams.'
  },
  { name: 'brightness', type: 'number', default: '1.6', description: 'Strength of the light.' },
  { name: 'glow', type: 'number', default: '0.6', description: 'Soft glow around the brightest glints.' },
  { name: 'grain', type: 'number', default: '0.35', description: 'Strength of the film grain, from 0 to 1.' },
  {
    name: 'variation',
    type: 'number',
    default: '0',
    description: 'Picks a different ripple pattern. Any number works.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The cursor moves the light along the beams and brightens the glints near it.'
  },
  { name: 'mouseStrength', type: 'number', default: '1', description: 'How strongly the cursor moves the light.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Sweeps the light in on mount.' },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Prints the glints as soft ink, for light backgrounds.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: 'undefined',
    description: 'Optional solid background. By default the canvas is transparent and the page shows through.'
  },
  {
    name: 'quality',
    type: 'number',
    default: '0.75',
    description: 'Render resolution, from 0.25 to 1. Lower values run faster.'
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
