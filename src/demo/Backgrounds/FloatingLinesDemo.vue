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
          <FloatingLines :key="rerenderKey" v-bind="settings" :enabled-waves="waves" />
          <BackgroundContent headline="Waves are cool! Even cooler with lines!" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="8"
            :model-value="settings.linesGradient"
            @update:model-value="(value: string[]) => updateProp('linesGradient', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Line Style"
            :options="STYLE_OPTIONS"
            :model-value="settings.lineStyle"
            @update:model-value="value => updateProp('lineStyle', value as LineStyle)"
          />
          <PreviewSlider
            title="Line Count"
            :min="1"
            :max="24"
            :step="1"
            :model-value="settings.lineCount"
            @update:model-value="value => updateProp('lineCount', value)"
          />
          <PreviewSlider
            title="Line Distance"
            :min="1"
            :max="30"
            :step="0.5"
            :model-value="settings.lineDistance"
            @update:model-value="value => updateProp('lineDistance', value)"
          />
          <PreviewSlider
            title="Line Width"
            :min="0.5"
            :max="4"
            :step="0.1"
            value-unit="px"
            :model-value="settings.lineWidth"
            @update:model-value="value => updateProp('lineWidth', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.2"
            :max="2"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="value => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.animationSpeed"
            @update:model-value="value => updateProp('animationSpeed', value)"
          />
          <PreviewSlider
            title="Amplitude"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.amplitude"
            @update:model-value="value => updateProp('amplitude', value)"
          />
          <PreviewSlider
            title="Depth Of Field"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.depthOfField"
            @update:model-value="value => updateProp('depthOfField', value)"
          />
          <PreviewSlider
            title="Edge Fade"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.edgeFade"
            @update:model-value="value => updateProp('edgeFade', value)"
          />
          <PreviewSlider
            title="Bend Radius"
            :min="1"
            :max="15"
            :step="0.5"
            :is-disabled="!settings.interactive"
            :model-value="settings.bendRadius"
            @update:model-value="value => updateProp('bendRadius', value)"
          />
          <PreviewSlider
            title="Bend Strength"
            :min="-2"
            :max="2"
            :step="0.05"
            :is-disabled="!settings.interactive"
            :model-value="settings.bendStrength"
            @update:model-value="value => updateProp('bendStrength', value)"
          />
          <PreviewSlider
            title="Parallax Strength"
            :min="0"
            :max="1"
            :step="0.05"
            :is-disabled="!settings.parallax"
            :model-value="settings.parallaxStrength"
            @update:model-value="value => updateProp('parallaxStrength', value)"
          />
          <PreviewSwitch
            v-for="wave in WAVES"
            :key="wave"
            :title="`${wave[0].toUpperCase()}${wave.slice(1)} Wave`"
            :model-value="waves.includes(wave)"
            @update:model-value="() => toggleWave(wave)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="value => updateProp('interactive', value)"
          />
          <PreviewSwitch
            title="Parallax"
            :model-value="settings.parallax"
            @update:model-value="value => updateProp('parallax', value)"
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
        <CodeExample :code-object="floatingLines" component-name="FloatingLines" />
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
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import RefreshButton from '@/components/common/RefreshButton.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useForceRerender } from '@/composables/useForceRerender';
import { floatingLines } from '@/constants/code/Backgrounds/floatingLinesCode';
import FloatingLines from '@/content/Backgrounds/FloatingLines/FloatingLines.vue';
import {
  DEFAULT_PROPS,
  PRESET_OPTIONS,
  WAVES,
  presetProps,
  type LineStyle,
  type WaveName
} from './presets/FloatingLines';

const STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'dashed', label: 'Dashed' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return { ...rest, lineStyle: rest.lineStyle as LineStyle };
});

const waves = computed<WaveName[]>(() =>
  Array.isArray(settings.value.enabledWaves) ? (settings.value.enabledWaves as WaveName[]) : WAVES
);

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};

const toggleWave = (wave: WaveName) => {
  const current = waves.value;
  const next = current.includes(wave) ? current.filter(item => item !== wave) : [...current, wave];
  if (next.length === 0) return;
  updateProp(
    'enabledWaves',
    WAVES.filter(item => next.includes(item))
  );
};

const propData: PropRow[] = [
  {
    name: 'linesGradient',
    type: 'string[]',
    default: "['#7cff67', '#ffffff']",
    description: 'Up to 8 colors blended across the lines of each wave.'
  },
  {
    name: 'enabledWaves',
    type: "Array<'top' | 'middle' | 'bottom'>",
    default: "['top', 'middle', 'bottom']",
    description: 'Which waves to show.'
  },
  {
    name: 'lineCount',
    type: 'number | number[]',
    default: '10',
    description: 'Lines per wave, from 1 to 24. Pass an array to set each enabled wave separately.'
  },
  {
    name: 'lineDistance',
    type: 'number | number[]',
    default: '6',
    description: 'Spacing between the lines of a wave. Pass an array to set each enabled wave separately.'
  },
  {
    name: 'lineStyle',
    type: "'solid' | 'dotted' | 'dashed'",
    default: "'solid'",
    description: 'Draws the lines as solid strands, rows of dots or dashes.'
  },
  { name: 'lineWidth', type: 'number', default: '1', description: 'Width of each line in pixels.' },
  { name: 'glow', type: 'number', default: '1', description: 'Strength of the glow around the lines.' },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness of the lines.' },
  { name: 'animationSpeed', type: 'number', default: '1', description: 'Speed of the wave motion.' },
  { name: 'amplitude', type: 'number', default: '1', description: 'Height of the waves.' },
  {
    name: 'depthOfField',
    type: 'number',
    default: '0.5',
    description: 'How much the waves in the back soften out of focus, from 0 to 1.'
  },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0',
    description: 'Fades the lines out toward the left and right edges, from 0 to 1.'
  },
  {
    name: 'topWavePosition',
    type: '{ x: number; y: number; rotate: number }',
    default: '{ x: 10, y: 0.5, rotate: -0.4 }',
    description: 'Offset, height and curl of the top wave.'
  },
  {
    name: 'middleWavePosition',
    type: '{ x: number; y: number; rotate: number }',
    default: '{ x: 5, y: 0, rotate: 0.2 }',
    description: 'Offset, height and curl of the middle wave.'
  },
  {
    name: 'bottomWavePosition',
    type: '{ x: number; y: number; rotate: number }',
    default: '{ x: 2, y: -0.7, rotate: -1 }',
    description: 'Offset, height and curl of the bottom wave.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Bends the lines around the cursor.'
  },
  {
    name: 'bendRadius',
    type: 'number',
    default: '5',
    description: 'Size of the area around the cursor that bends the lines.'
  },
  {
    name: 'bendStrength',
    type: 'number',
    default: '-0.5',
    description:
      'How strongly the lines bend. Negative values part them around the cursor, positive values pull them in.'
  },
  {
    name: 'mouseDamping',
    type: 'number',
    default: '0.05',
    description: 'How smoothly the bend follows the cursor, from 0 (frozen) to 1 (instant).'
  },
  { name: 'parallax', type: 'boolean', default: 'true', description: 'Shifts the waves in depth as the cursor moves.' },
  { name: 'parallaxStrength', type: 'number', default: '0.2', description: 'Strength of the parallax shift.' },
  {
    name: 'clickSwirl',
    type: 'boolean',
    default: 'true',
    description:
      'Clicking stirs the lines into a curl that slowly unwinds, turning in the direction the cursor was moving.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Swells the waves in from flat lines on mount.' },
  {
    name: 'mixBlendMode',
    type: "CSSProperties['mixBlendMode']",
    default: "'screen'",
    description: 'CSS mix-blend-mode of the container in dark mode.'
  },
  {
    name: 'backgroundColor',
    type: 'string',
    default: '-',
    description: 'Paints an opaque background behind the lines. Leave it unset for a transparent canvas.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the lines as ink for light backgrounds.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
