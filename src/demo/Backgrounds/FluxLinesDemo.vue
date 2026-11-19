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
          <FluxLines :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Follow the lines of force" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            v-for="index in [0, 1, 2]"
            :key="index"
            :title="`Color ${index + 1}`"
            :color="colorAt(index)"
            @change="(value: string) => setColor(index, value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0.5"
            :max="4"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Rim Width"
            :min="0.05"
            :max="0.5"
            :step="0.01"
            :model-value="settings.rimWidth"
            @update:model-value="value => updateProp('rimWidth', value)"
          />
          <PreviewSlider
            title="Sharpness"
            :min="1"
            :max="6"
            :step="0.1"
            :model-value="settings.sharpness"
            @update:model-value="value => updateProp('sharpness', value)"
          />
          <PreviewSlider
            title="Line Width"
            :min="0"
            :max="3"
            :step="0.1"
            value-unit="px"
            :model-value="settings.lineWidth"
            @update:model-value="value => updateProp('lineWidth', value)"
          />
          <PreviewSlider
            title="Shimmer"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.shimmer"
            @update:model-value="value => updateProp('shimmer', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.5"
            :max="3"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Turbulence"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.turbulence"
            @update:model-value="value => updateProp('turbulence', value)"
          />
          <PreviewSlider
            title="Fluidity"
            :min="0.02"
            :max="0.5"
            :step="0.01"
            :model-value="settings.fluidity"
            @update:model-value="value => updateProp('fluidity', value)"
          />
          <PreviewSelect
            title="Flow Direction"
            :options="FLOW_OPTIONS"
            :model-value="settings.flowDirection"
            @update:model-value="value => updateProp('flowDirection', String(value))"
          />
          <PreviewSlider
            title="Cursor Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.mouseStrength"
            @update:model-value="value => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Cursor Radius"
            :min="0.1"
            :max="0.8"
            :step="0.01"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.mouseRadius"
            @update:model-value="value => updateProp('mouseRadius', value)"
          />
          <PreviewSwitch
            title="Cursor Magnet"
            :model-value="settings.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Swirl"
            :model-value="settings.clickSwirl"
            @update:model-value="value => updateProp('clickSwirl', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="value => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="fluxLines" component-name="FluxLines" />
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
import { fluxLines } from '@/constants/code/Backgrounds/fluxLinesCode';
import FluxLines from '@/content/Backgrounds/FluxLines/FluxLines.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/FluxLines';

type Flow = 'up' | 'down' | 'left' | 'right';

const FLOW_OPTIONS = [
  { value: 'down', label: 'Down' },
  { value: 'up', label: 'Up' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return { ...rest, flowDirection: rest.flowDirection as Flow };
});

const colorAt = (index: number) => settings.value.colors?.[index] ?? settings.value.colors?.[0] ?? '#ffffff';

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};

const setColor = (index: number, value: string) => {
  const next = [0, 1, 2].map(i => colorAt(i));
  next[index] = value;
  updateProp('colors', next);
};

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#ffffff', '#ffffff', '#ffffff']",
    description: 'Up to 8 colors blended along the lines. A single color makes every line the same.'
  },
  { name: 'speed', type: 'number', default: '0.5', description: 'How fast the fluid churns and flows.' },
  {
    name: 'scale',
    type: 'number',
    default: '1.6',
    description: 'Zoom of the pattern. Higher values show bigger, fewer shapes.'
  },
  { name: 'turbulence', type: 'number', default: '1', description: 'How much the flow swirls and distorts.' },
  {
    name: 'fluidity',
    type: 'number',
    default: '0.1',
    description: 'How smoothly the two layers of the fluid merge. Higher values give softer, rounder lines.'
  },
  { name: 'rimWidth', type: 'number', default: '0.2', description: 'Thickness of the glow around each line.' },
  { name: 'sharpness', type: 'number', default: '2.5', description: 'Falloff of the glow. Higher values are tighter.' },
  {
    name: 'shimmer',
    type: 'number',
    default: '1.5',
    description: 'How much the lines break up into separate strokes. 0 shows every line.'
  },
  { name: 'glow', type: 'number', default: '2', description: 'Brightness of the lines.' },
  {
    name: 'lineWidth',
    type: 'number',
    default: '1',
    description: 'Width of the crisp core inside each line, in pixels. 0 keeps only the glow.'
  },
  {
    name: 'flowDirection',
    type: "'up' | 'down' | 'left' | 'right'",
    default: "'down'",
    description: 'Main direction the fluid drifts.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Turns the cursor into a magnet that reveals and curls the lines around it.'
  },
  { name: 'mouseStrength', type: 'number', default: '1', description: 'Strength of the cursor magnet.' },
  {
    name: 'mouseRadius',
    type: 'number',
    default: '0.35',
    description: 'Reach of the cursor magnet, as a fraction of the height.'
  },
  {
    name: 'mouseDampening',
    type: 'number',
    default: '0.15',
    description: 'Time in seconds the magnet takes to catch up with the cursor. 0 follows instantly.'
  },
  { name: 'clickSwirl', type: 'boolean', default: 'true', description: 'Clicking stirs the fluid into a swirl.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Fades the lines in on mount.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the lines as ink for light backgrounds.'
  },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Lets the page show through. When off, the lines sit on the background color.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'#111111'",
    description: 'Background color when transparent is off. Defaults to white in light mode.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the flow.' },
  { name: 'mixBlendMode', type: 'string', default: '-', description: 'CSS mix-blend-mode applied to the container.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
