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
          <DarkVeil :key="rerenderKey" v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="Become emboldened by the flame of ambition" />
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
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.5"
            :max="2.5"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :model-value="settings.rotation"
            @update:model-value="(value: number) => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Flow"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.flow"
            @update:model-value="(value: number) => updateProp('flow', value)"
          />
          <PreviewSlider
            title="Warp"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.warp"
            @update:model-value="(value: number) => updateProp('warp', value)"
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
            title="Brightness"
            :min="0.2"
            :max="2.5"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Sheen"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.sheen"
            @update:model-value="(value: number) => updateProp('sheen', value)"
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
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSlider
            title="Mouse Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.mouseStrength"
            @update:model-value="(value: number) => updateProp('mouseStrength', value)"
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
        <CodeExample :code-object="darkVeil" component-name="DarkVeil" />
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
import { darkVeil } from '@/constants/code/Backgrounds/darkVeilCode';
import DarkVeil from '@/content/Backgrounds/DarkVeil/DarkVeil.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/DarkVeil';

const propData: PropRow[] = [
  {
    name: 'color',
    type: 'string',
    default: "'#42b883'",
    description: 'Color of the veil. Highlights are derived from it.'
  },
  { name: 'speed', type: 'number', default: '0.5', description: 'Animation speed.' },
  { name: 'scale', type: 'number', default: '1', description: 'Zoom of the veil. Higher values zoom in.' },
  { name: 'rotation', type: 'number', default: '0', description: 'Turns the veil around the center, in degrees.' },
  { name: 'flow', type: 'number', default: '1', description: 'How much the veil drifts and changes shape over time.' },
  { name: 'warp', type: 'number', default: '0', description: 'Adds a gentle ripple to the veil.' },
  { name: 'variation', type: 'number', default: '0', description: 'Picks a different veil shape. Any number works.' },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness.' },
  {
    name: 'sheen',
    type: 'number',
    default: '0',
    description: 'Strength of the silky highlights along the folds. They follow the cursor like a light.'
  },
  { name: 'glow', type: 'number', default: '0.4', description: 'Soft glow around the brightest parts.' },
  { name: 'grain', type: 'number', default: '0.03', description: 'Strength of the film grain.' },
  {
    name: 'quality',
    type: 'number',
    default: '0.5',
    description:
      'Render resolution, from 0.25 to 1. The veil is soft, so lower values look almost the same and run faster.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The veil swirls, morphs and lights up around the cursor.'
  },
  { name: 'mouseStrength', type: 'number', default: '1', description: 'How strongly the cursor bends the veil.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Fades the veil in as it unfolds.' },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the veil as soft tinted ink for light backgrounds.'
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
