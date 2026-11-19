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
          <WebThreads :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Luminous threads woven to a glowing pinch." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="6"
            :model-value="settings.colors"
            @update:model-value="value => updateProp('colors', value)"
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
          <PreviewSlider
            title="Threads"
            :min="1"
            :max="24"
            :step="1"
            :model-value="settings.threadCount"
            @update:model-value="value => updateProp('threadCount', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Frequency"
            :min="1"
            :max="12"
            :step="0.1"
            :model-value="settings.frequency"
            @update:model-value="value => updateProp('frequency', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0"
            :max="0.5"
            :step="0.01"
            :model-value="settings.spread"
            @update:model-value="value => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Taper"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.taper"
            @update:model-value="value => updateProp('taper', value)"
          />
          <PreviewSlider
            title="Position"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.position"
            @update:model-value="value => updateProp('position', value)"
          />
          <PreviewSlider
            title="Pinch"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.pinch"
            @update:model-value="value => updateProp('pinch', value)"
          />
          <PreviewSlider
            title="Nodes"
            :min="1"
            :max="4"
            :step="1"
            :model-value="settings.nodes"
            @update:model-value="value => updateProp('nodes', value)"
          />
          <PreviewSlider
            title="Angle"
            :min="-45"
            :max="45"
            :step="1"
            value-unit="°"
            :model-value="settings.angle"
            @update:model-value="value => updateProp('angle', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0.004"
            :max="0.05"
            :step="0.001"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Falloff"
            :min="0.3"
            :max="1.2"
            :step="0.01"
            :model-value="settings.falloff"
            @update:model-value="value => updateProp('falloff', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.thickness"
            @update:model-value="value => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.2"
            :max="1.5"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="value => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.opacity"
            @update:model-value="value => updateProp('opacity', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Pulses"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.pulses"
            @update:model-value="value => updateProp('pulses', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.15"
            :step="0.005"
            :model-value="settings.grain"
            @update:model-value="value => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Cursor Strength"
            :min="0"
            :max="1"
            :step="0.01"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.mouseStrength"
            @update:model-value="value => updateProp('mouseStrength', value)"
          />
          <PreviewSwitch
            title="Mirror"
            :model-value="settings.mirror"
            @update:model-value="value => updateProp('mirror', value)"
          />
          <PreviewSwitch
            title="Shimmer"
            :model-value="settings.shimmer"
            @update:model-value="value => updateProp('shimmer', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="value => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Cursor"
            :model-value="settings.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Pulse on Click"
            :model-value="settings.pulseOnClick"
            @update:model-value="value => updateProp('pulseOnClick', value)"
          />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="value => updateProp('lightMode', value)"
          />
          <PreviewSwitch
            title="Pause"
            :model-value="settings.paused"
            @update:model-value="value => updateProp('paused', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="webThreads" component-name="WebThreads" />
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
import { webThreads } from '@/constants/code/Backgrounds/webThreadsCode';
import WebThreads from '@/content/Backgrounds/WebThreads/WebThreads.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/WebThreads';

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#42b883', '#a0ffbc']",
    description: 'Gradient across the threads, from the first thread to the last. Up to six colors.'
  },
  {
    name: 'coreColor',
    type: 'string',
    default: "'#FFFFFF'",
    description: 'Hot color where threads overlap and converge.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'transparent'",
    description: 'Fills the canvas behind the threads. Transparent lets the page show through.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws crisp ink strokes for light backgrounds instead of glowing light.'
  },
  { name: 'threadCount', type: 'number', default: '6', description: 'Number of threads, up to 24.' },
  { name: 'speed', type: 'number', default: '0.2', description: 'How fast the threads weave.' },
  { name: 'frequency', type: 'number', default: '5', description: 'How many waves fit across the width.' },
  { name: 'spread', type: 'number', default: '0.18', description: 'How far the threads fan away from the pinch.' },
  {
    name: 'taper',
    type: 'number',
    default: '1',
    description: 'How much wider each next thread swings, nesting them inside each other.'
  },
  { name: 'position', type: 'number', default: '0.5', description: 'Height of the weave, from bottom 0 to top 1.' },
  {
    name: 'pinch',
    type: 'number',
    default: '0.5',
    description: 'Where the threads converge across the width, from 0 to 1.'
  },
  {
    name: 'nodes',
    type: 'number',
    default: '1',
    description: 'Number of pinch points. More than one braids the threads through each of them.'
  },
  { name: 'angle', type: 'number', default: '0', description: 'Rotation of the whole weave in degrees.' },
  { name: 'glow', type: 'number', default: '0.02', description: 'Strength of the light around each thread.' },
  { name: 'falloff', type: 'number', default: '0.6', description: 'How quickly the glow fades. Higher is tighter.' },
  { name: 'thickness', type: 'number', default: '1.1', description: 'Width of the threads.' },
  { name: 'brightness', type: 'number', default: '0.6', description: 'Overall brightness.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'depth',
    type: 'number',
    default: '0',
    description: 'Twists the threads in 3D, so strands behind the bundle turn thinner and dimmer.'
  },
  {
    name: 'pulses',
    type: 'number',
    default: '0',
    description: 'Strength of light pulses that travel along the threads toward the pinch.'
  },
  { name: 'mirror', type: 'boolean', default: 'true', description: 'Weaves each side of the pinch as a mirror.' },
  { name: 'shimmer', type: 'boolean', default: 'false', description: 'Adds a gentle, uneven sway to each thread.' },
  {
    name: 'fade',
    type: 'number',
    default: '0',
    description: 'Fades the threads out toward both ends so they melt into the page.'
  },
  { name: 'grain', type: 'number', default: '0.05', description: 'Film grain in the light. 0 turns it off.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Draws the threads in one after another the first time they come into view, each led by a soft light.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The strand nearest the cursor lights up while the others recede.'
  },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '0.5',
    description: 'How strongly the focused strand stands out from the rest.'
  },
  {
    name: 'pulseOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends light along every thread, gathering in the pinch and fading out the far side.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the weaving.' },
  { name: 'dpr', type: 'number', default: '2', description: 'Maximum device pixel ratio of the canvas.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { colorMode } = useColorMode();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: colorMode.value === 'light' }), preset: value });
};
</script>
