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
          <AeroShards :key="rerenderKey" v-bind="settings" />
          <BackgroundContent pill-text="New Background" headline="Don't touch them, they are pretty sharp!" />
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
            title="Shard Color"
            :color="settings.shardColor"
            @change="(value: string) => updateProp('shardColor', value)"
          />
          <PreviewColorPickerCustom
            title="Accent Color"
            :color="settings.accentColor"
            @change="(value: string) => updateProp('accentColor', value)"
          />
          <PreviewSelect
            title="Placement"
            :options="PLACEMENT_OPTIONS"
            :model-value="settings.placement"
            @update:model-value="(value: string | number) => updateProp('placement', value as Settings['placement'])"
          />
          <PreviewSelect
            title="Material"
            :options="MATERIAL_OPTIONS"
            :model-value="settings.material"
            @update:model-value="(value: string | number) => updateProp('material', value as Settings['material'])"
          />
          <PreviewSelect
            title="Markers"
            :options="MARKER_OPTIONS"
            :model-value="settings.markers"
            @update:model-value="(value: string | number) => updateProp('markers', value as Settings['markers'])"
          />
          <PreviewSlider
            title="Count"
            :min="400"
            :max="3200"
            :step="50"
            :model-value="settings.count"
            @update:model-value="(value: number) => updateProp('count', value)"
          />
          <PreviewSlider
            title="Shard Size"
            :min="0.5"
            :max="2"
            :step="0.01"
            :model-value="settings.shardSize"
            @update:model-value="(value: number) => updateProp('shardSize', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0.3"
            :max="2"
            :step="0.01"
            :model-value="settings.spread"
            @update:model-value="(value: number) => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Twist"
            :min="0"
            :max="2"
            :step="0.01"
            :model-value="settings.twist"
            @update:model-value="(value: number) => updateProp('twist', value)"
          />
          <PreviewSlider
            title="Billow"
            :min="0"
            :max="2"
            :step="0.01"
            :model-value="settings.billow"
            @update:model-value="(value: number) => updateProp('billow', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.01"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.6"
            :max="1.8"
            :step="0.01"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Depth of Field"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.depthOfField"
            @update:model-value="(value: number) => updateProp('depthOfField', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1.5"
            :step="0.01"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.4"
            :step="0.01"
            :model-value="settings.grain"
            @update:model-value="(value: number) => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Vignette"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.vignette"
            @update:model-value="(value: number) => updateProp('vignette', value)"
          />
          <PreviewSlider
            title="Cursor Strength"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.mouseStrength"
            :is-disabled="!settings.mouseInteraction"
            @update:model-value="(value: number) => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Parallax"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.parallax"
            :is-disabled="!settings.mouseInteraction"
            @update:model-value="(value: number) => updateProp('parallax', value)"
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
            title="Pulse on Click"
            :model-value="settings.pulseOnClick"
            @update:model-value="(value: boolean) => updateProp('pulseOnClick', value)"
          />
          <PreviewSwitch
            title="Hold to Gather"
            :model-value="settings.holdToGather"
            @update:model-value="(value: boolean) => updateProp('holdToGather', value)"
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
        <Dependencies :dependency-list="['vgpu']" />
      </template>

      <template #code>
        <CodeExample :code-object="aeroShards" component-name="AeroShards" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
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
import { aeroShards } from '@/constants/code/Backgrounds/aeroShardsCode';
import AeroShards from '@/content/Backgrounds/AeroShards/AeroShards.vue';
import { LOOK, PRESET_OPTIONS, presetProps } from './presets/AeroShards';

const DEFAULT_PROPS = {
  preset: 'emerald',
  ...LOOK,
  intro: true,
  mouseInteraction: true,
  mouseStrength: 0.6,
  parallax: 0.5,
  pulseOnClick: true,
  holdToGather: true,
  paused: false
};

type Settings = Omit<typeof DEFAULT_PROPS, 'preset'>;

const PLACEMENT_OPTIONS = [
  { value: 'full', label: 'Full' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'center', label: 'Center' }
];

const MATERIAL_OPTIONS = [
  { value: 'glass', label: 'Glass' },
  { value: 'chrome', label: 'Chrome' }
];

const MARKER_OPTIONS = [
  { value: 'plus', label: 'Plus' },
  { value: 'dots', label: 'Dots' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  { name: 'shardColor', type: 'string', default: "'#6ABD89'", description: 'Main color of the shards.' },
  {
    name: 'accentColor',
    type: 'string',
    default: "'#7CFF67'",
    description: 'Color of the light the shards catch, their rim light and the markers.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Fills the canvas behind the shards. Transparent lets the page show through.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the shards as soft tinted glass for light backgrounds.'
  },
  {
    name: 'placement',
    type: "'full' | 'left' | 'right' | 'center'",
    default: "'full'",
    description: 'Where the ribbons flow: across the whole view, down one side, or in a ring around the center.'
  },
  {
    name: 'material',
    type: "'glass' | 'chrome'",
    default: "'glass'",
    description: 'Surface of the shards: thick glass that catches light along its edges, or polished chrome.'
  },
  {
    name: 'markers',
    type: "'plus' | 'dots' | 'none'",
    default: "'plus'",
    description:
      'Survey markers floating at each depth. A few blink, and the one nearest the cursor gets a target frame.'
  },
  { name: 'count', type: 'number', default: '1300', description: 'Number of shards across all the ribbons.' },
  { name: 'shardSize', type: 'number', default: '1', description: 'Size of the shards.' },
  { name: 'spread', type: 'number', default: '1', description: 'Width of the ribbons.' },
  { name: 'twist', type: 'number', default: '1', description: 'How much the ribbons twist along their length.' },
  { name: 'billow', type: 'number', default: '1', description: 'How much the ribbons ripple like silk.' },
  { name: 'speed', type: 'number', default: '1', description: 'How fast the shards flow.' },
  { name: 'scale', type: 'number', default: '1', description: 'Zoom of the whole scene.' },
  {
    name: 'depthOfField',
    type: 'number',
    default: '0.75',
    description: 'How soft the farther ribbons get. 0 keeps everything sharp.'
  },
  { name: 'glow', type: 'number', default: '0.35', description: 'Soft bloom around the brightest glints.' },
  { name: 'grain', type: 'number', default: '0.06', description: 'Film grain on the shards. 0 turns it off.' },
  {
    name: 'vignette',
    type: 'number',
    default: '0.3',
    description: 'Fades everything out toward the edges of the frame. 0 runs edge to edge.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'The ribbons draw in from the left, front to back, on mount.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The cursor parts the shards it passes through and leans the camera toward it.'
  },
  { name: 'mouseStrength', type: 'number', default: '0.6', description: 'How strongly the cursor parts the shards.' },
  { name: 'parallax', type: 'number', default: '0.5', description: 'How far the camera leans toward the cursor.' },
  {
    name: 'pulseOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ring of light out through every depth, flipping the shards it passes.'
  },
  {
    name: 'holdToGather',
    type: 'boolean',
    default: 'true',
    description: 'Pressing and holding gathers nearby shards into a swirl that scatters back on release.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the flow.' },
  { name: 'dpr', type: 'number', default: '2', description: 'Maximum device pixel ratio of the canvas.' },
  {
    name: 'onError',
    type: '(error: Error) => void',
    default: '-',
    description: 'Called if WebGPU is unavailable or fails, so you can show a fallback.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { colorMode } = useColorMode();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed<Settings>(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: colorMode.value === 'light' }), preset: value });
};
</script>
