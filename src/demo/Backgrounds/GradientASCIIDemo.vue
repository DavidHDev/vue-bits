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
          <GradientASCII :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Soft gradients, typed out in characters." />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="2"
            :max="8"
            :model-value="settings.colors"
            @update:model-value="(value: string[]) => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="value => updateProp('shape', String(value))"
          />
          <PreviewSelect
            title="Characters"
            :options="CHARACTER_OPTIONS"
            :model-value="settings.characters"
            @update:model-value="value => updateProp('characters', String(value))"
          />
          <PreviewSelect
            title="Click Effect"
            :options="CLICK_OPTIONS"
            :model-value="settings.clickEffect"
            @update:model-value="value => updateProp('clickEffect', String(value))"
          />
          <PreviewSlider
            title="Cell Size"
            :min="8"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="settings.cellSize"
            @update:model-value="value => updateProp('cellSize', value)"
          />
          <PreviewSlider
            title="Density"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.density"
            @update:model-value="value => updateProp('density', value)"
          />
          <PreviewSlider
            title="Glyph Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.glyphOpacity"
            @update:model-value="value => updateProp('glyphOpacity', value)"
          />
          <PreviewSlider
            title="Gradient Opacity"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.gradientOpacity"
            @update:model-value="value => updateProp('gradientOpacity', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Depth of Field"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.depthOfField"
            @update:model-value="value => updateProp('depthOfField', value)"
          />
          <PreviewSlider
            title="Flicker"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.flicker"
            @update:model-value="value => updateProp('flicker', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.softness"
            @update:model-value="value => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.4"
            :max="2.5"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Flow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.flow"
            @update:model-value="value => updateProp('flow', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.4"
            :step="0.01"
            :model-value="settings.grain"
            @update:model-value="value => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Variation"
            :min="0"
            :max="20"
            :step="1"
            :model-value="settings.variation"
            @update:model-value="value => updateProp('variation', value)"
          />
          <PreviewSlider
            title="Scramble Radius"
            :min="0.02"
            :max="0.4"
            :step="0.01"
            :is-disabled="!settings.mouseInteraction"
            :model-value="settings.scrambleRadius"
            @update:model-value="value => updateProp('scrambleRadius', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
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
        <CodeExample :code-object="gradientASCII" component-name="GradientASCII" />
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
import { useColorMode } from '@/composables/useTheme';
import { gradientASCII } from '@/constants/code/Backgrounds/gradientASCIICode';
import GradientASCII, {
  type GradientASCIIClickEffect,
  type GradientASCIIShape
} from '@/content/Backgrounds/GradientASCII/GradientASCII.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/GradientASCII';

const SHAPE_OPTIONS = [
  { value: 'horizon', label: 'Horizon' },
  { value: 'pinch', label: 'Pinch' },
  { value: 'rise', label: 'Rise' },
  { value: 'eclipse', label: 'Eclipse' }
];

const CHARACTER_OPTIONS = [
  { value: ' =+xX0S8#@', label: 'Letters' },
  { value: ' .:-=+*#%@', label: 'Classic' },
  { value: ' 01', label: 'Binary' },
  { value: ' ░▒▓█', label: 'Blocks' },
  { value: ' .·•●', label: 'Dots' }
];

const CLICK_OPTIONS = [
  { value: 'wave', label: 'Wave' },
  { value: 'burst', label: 'Burst' },
  { value: 'none', label: 'None' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { isLight } = useColorMode();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return {
    ...rest,
    shape: rest.shape as GradientASCIIShape,
    clickEffect: rest.clickEffect as GradientASCIIClickEffect
  };
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: isLight.value, defaults: defaultProps.value }), preset: value });
};

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8']",
    description:
      'Two to eight colors for the light, from the edge of the shadow to the brightest or farthest point. Dark areas stay transparent.'
  },
  {
    name: 'shape',
    type: "'horizon' | 'pinch' | 'rise' | 'eclipse'",
    default: "'horizon'",
    description:
      'Horizon glows over a dark curve, pinch is a band of light squeezed in the middle, rise glows up from the bottom and eclipse rings a dark disc.'
  },
  {
    name: 'characters',
    type: 'string',
    default: "' =+xX0S8#@'",
    description: 'Characters from dimmest to brightest. Brighter parts of the gradient use characters further along.'
  },
  {
    name: 'cellSize',
    type: 'number',
    default: '18',
    description: 'Height of each character cell in px.'
  },
  {
    name: 'density',
    type: 'number',
    default: '0.8',
    description: 'Share of cells that show a character, from 0 to 1. Brighter areas fill in first.'
  },
  {
    name: 'glyphOpacity',
    type: 'number',
    default: '0.85',
    description: 'How strongly the characters stand out from the gradient.'
  },
  {
    name: 'gradientOpacity',
    type: 'number',
    default: '0.9',
    description: 'Opacity of the gradient behind the characters. At 0 only the characters are left.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0.2',
    description: 'Soft glow around the characters, from 0 to 1.5.'
  },
  {
    name: 'depthOfField',
    type: 'number',
    default: '0',
    description: 'Share of characters drawn out of focus, from 0 to 1.'
  },
  {
    name: 'flicker',
    type: 'number',
    default: '0.2',
    description: 'How often characters swap with their neighbors in brightness, from 0 to 1.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0.5',
    description: 'How soft the edges of the shape are, from 0 to 1.'
  },
  {
    name: 'scale',
    type: 'number',
    default: '1',
    description: 'Size of the shape, from 0.4 to 2.5.'
  },
  {
    name: 'flow',
    type: 'number',
    default: '0.5',
    description: 'How much the light wavers as it drifts, from 0 to 2.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Speed of the drift. 0 holds the shape still.'
  },
  {
    name: 'grain',
    type: 'number',
    default: '0.08',
    description: 'Strength of the film grain, from 0 to 0.4.'
  },
  {
    name: 'variation',
    type: 'number',
    default: '0',
    description: 'Picks a different drift and a different pattern of characters.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Scrambles the characters under the cursor as it moves. They settle back a moment later.'
  },
  {
    name: 'scrambleRadius',
    type: 'number',
    default: '0.1',
    description: 'Size of the scrambled area around the cursor, relative to the container height.'
  },
  {
    name: 'clickEffect',
    type: "'wave' | 'burst' | 'none'",
    default: "'wave'",
    description: 'Wave sends a ring of scrambled characters out from the click, burst scrambles a patch under it.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Fades the light in from its source while the characters decode.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the gradient as a wash on light backgrounds, with characters a shade darker.'
  },
  {
    name: 'fontFamily',
    type: 'string',
    default: '\'"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace\'',
    description: 'Font used for the characters. Monospaced fonts keep the grid even.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
