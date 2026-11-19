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
          <GhostFibers :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Ribbons of fine fibers that fold through the light." />
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
            title="Glow Color"
            :color="settings.glowColor"
            @change="(value: string) => updateProp('glowColor', value)"
          />
          <PreviewColorPickerCustom
            title="Line Color"
            :color="settings.lineColor"
            @change="(value: string) => updateProp('lineColor', value)"
          />
          <PreviewColorPickerCustom
            title="Secondary"
            :color="settings.secondaryColor"
            @change="(value: string) => updateProp('secondaryColor', value)"
          />
          <PreviewSelect
            title="Gradient"
            :options="GRADIENT_OPTIONS"
            :model-value="settings.gradient"
            @update:model-value="(value: string | number) => updateProp('gradient', value as GhostFibersGradient)"
          />
          <PreviewSlider
            title="Layers"
            :min="1"
            :max="3"
            :step="1"
            :model-value="settings.layers"
            @update:model-value="value => updateProp('layers', value)"
          />
          <PreviewSlider
            title="Waves"
            :min="0"
            :max="2.5"
            :step="0.05"
            :model-value="settings.waves"
            @update:model-value="value => updateProp('waves', value)"
          />
          <PreviewSlider
            title="Twist"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.twist"
            @update:model-value="value => updateProp('twist', value)"
          />
          <PreviewSlider
            title="Volume"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.volume"
            @update:model-value="value => updateProp('volume', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0.4"
            :max="2.5"
            :step="0.05"
            :model-value="settings.spread"
            @update:model-value="value => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.5"
            :max="2"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="value => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="-90"
            :max="90"
            :step="1"
            :model-value="settings.rotation"
            @update:model-value="value => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Perspective"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.perspective"
            @update:model-value="value => updateProp('perspective', value)"
          />
          <PreviewSelect
            title="Fiber Style"
            :options="STYLE_OPTIONS"
            :model-value="settings.fiberStyle"
            @update:model-value="(value: string | number) => updateProp('fiberStyle', value as GhostFibersFiberStyle)"
          />
          <PreviewSlider
            title="Threads"
            :min="12"
            :max="160"
            :step="1"
            :model-value="settings.threads"
            @update:model-value="value => updateProp('threads', value)"
          />
          <PreviewSlider
            title="Density"
            :min="0.3"
            :max="2.5"
            :step="0.05"
            :model-value="settings.density"
            @update:model-value="value => updateProp('density', value)"
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
            title="Tips"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.tips"
            @update:model-value="value => updateProp('tips', value)"
          />
          <PreviewSlider
            title="Fold Glow"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.foldGlow"
            @update:model-value="value => updateProp('foldGlow', value)"
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
            title="Flow"
            :min="-1.5"
            :max="1.5"
            :step="0.05"
            :model-value="settings.flow"
            @update:model-value="value => updateProp('flow', value)"
          />
          <PreviewSlider
            title="Roll Speed"
            :min="-1"
            :max="1"
            :step="0.01"
            :model-value="settings.rollSpeed"
            @update:model-value="value => updateProp('rollSpeed', value)"
          />
          <PreviewSlider
            title="Depth Of Field"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.depthOfField"
            @update:model-value="value => updateProp('depthOfField', value)"
          />
          <PreviewSlider
            title="Focus Depth"
            :min="-1"
            :max="1"
            :step="0.05"
            :model-value="settings.focusDepth"
            @update:model-value="value => updateProp('focusDepth', value)"
          />
          <PreviewSlider
            title="Particles"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.particles"
            @update:model-value="value => updateProp('particles', value)"
          />
          <PreviewSlider
            title="Sparkle"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.sparkle"
            @update:model-value="value => updateProp('sparkle', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="value => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Vignette"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.vignette"
            @update:model-value="value => updateProp('vignette', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.3"
            :step="0.01"
            :model-value="settings.grain"
            @update:model-value="value => updateProp('grain', value)"
          />
          <PreviewSelect
            title="Hover Effect"
            :options="HOVER_OPTIONS"
            :model-value="settings.hoverEffect"
            @update:model-value="(value: string | number) => updateProp('hoverEffect', value as GhostFibersHoverEffect)"
          />
          <PreviewSlider
            title="Hover Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.mouseStrength"
            @update:model-value="value => updateProp('mouseStrength', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Pulse On Click"
            :model-value="settings.pulseOnClick"
            @update:model-value="value => updateProp('pulseOnClick', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="value => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="ghostFibers" component-name="GhostFibers" />
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
import { useColorModeValue } from '@/composables/useTheme';
import { ghostFibers } from '@/constants/code/Backgrounds/ghostFibersCode';
import GhostFibers from '@/content/Backgrounds/GhostFibers/GhostFibers.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/GhostFibers';

type GhostFibersGradient = 'depth' | 'along' | 'across';
type GhostFibersFiberStyle = 'dots' | 'dashes' | 'lines';
type GhostFibersHoverEffect = 'focus' | 'part' | 'none';

const GRADIENT_OPTIONS = [
  { value: 'depth', label: 'Depth' },
  { value: 'along', label: 'Along' },
  { value: 'across', label: 'Across' }
];

const STYLE_OPTIONS = [
  { value: 'dots', label: 'Dots' },
  { value: 'dashes', label: 'Dashes' },
  { value: 'lines', label: 'Lines' }
];

const HOVER_OPTIONS = [
  { value: 'focus', label: 'Focus' },
  { value: 'part', label: 'Part' },
  { value: 'none', label: 'None' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const light = useColorModeValue(true, false);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: light.value, defaults: defaultProps.value }), preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  { name: 'glowColor', type: 'string', default: "'#42b883'", description: 'Main color of the fibers.' },
  {
    name: 'lineColor',
    type: 'string',
    default: '-',
    description: 'Color of the bright folds, sparkles and tips. Leave it out to use a pale tint of the glow color.'
  },
  {
    name: 'secondaryColor',
    type: 'string',
    default: '-',
    description: 'Second color the gradient blends toward. Leave it out to use a deeper shade of the glow color.'
  },
  {
    name: 'gradient',
    type: "'depth' | 'along' | 'across'",
    default: "'depth'",
    description: 'How the two colors blend: by distance, along the length of the ribbons, or across their width.'
  },
  { name: 'layers', type: 'number', default: '3', description: 'Number of ribbons, from 1 to 3.' },
  { name: 'waves', type: 'number', default: '1', description: 'How much the ribbons undulate. 0 keeps them straight.' },
  { name: 'twist', type: 'number', default: '1.2', description: 'How often the ribbons turn over along their length.' },
  {
    name: 'volume',
    type: 'number',
    default: '0.7',
    description: 'Thickness of each ribbon, from a single flat sheet at 0 to a layered bundle.'
  },
  { name: 'spread', type: 'number', default: '1', description: 'Width of the ribbons.' },
  { name: 'scale', type: 'number', default: '1', description: 'Size of the whole effect.' },
  { name: 'rotation', type: 'number', default: '18', description: 'Tilt of the whole effect, in degrees.' },
  {
    name: 'perspective',
    type: 'number',
    default: '0.65',
    description: 'How far the ribbons turn into the distance, from side-on at 0 to steeply receding at 1.'
  },
  { name: 'threads', type: 'number', default: '72', description: 'Number of fibers in each ribbon.' },
  { name: 'density', type: 'number', default: '1', description: 'Number of dots along each fiber.' },
  { name: 'thickness', type: 'number', default: '1', description: 'Size of the dots.' },
  {
    name: 'fiberStyle',
    type: "'dots' | 'dashes' | 'lines'",
    default: "'dots'",
    description: 'Draws the fibers as rows of dots, short dashes or continuous lines.'
  },
  {
    name: 'tips',
    type: 'number',
    default: '0',
    description: 'Cuts the fibers at different lengths and lights their ends, like fiber optics.'
  },
  {
    name: 'foldGlow',
    type: 'number',
    default: '1',
    description: 'Brightness of the light where the ribbons fold edge-on.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '0.5',
    description: 'Speed of the waves and the twist. 0 holds them still.'
  },
  {
    name: 'flow',
    type: 'number',
    default: '0.4',
    description: 'Speed of the dots along the fibers. Negative values reverse them.'
  },
  { name: 'rollSpeed', type: 'number', default: '0.15', description: 'How fast the ribbons roll around their length.' },
  {
    name: 'depthOfField',
    type: 'number',
    default: '0.85',
    description: 'Strength of the camera blur away from the focus. 0 keeps everything sharp.'
  },
  {
    name: 'focusDepth',
    type: 'number',
    default: '0',
    description: 'Moves the focus nearer with negative values or farther with positive ones.'
  },
  { name: 'particles', type: 'number', default: '0.5', description: 'Amount of dust floating around the ribbons.' },
  { name: 'sparkle', type: 'number', default: '0.5', description: 'How often single dots twinkle.' },
  { name: 'glow', type: 'number', default: '0.8', description: 'Strength of the bloom around the bright areas.' },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness.' },
  { name: 'vignette', type: 'number', default: '0.3', description: 'How much the edges fade out, from 0 to 1.' },
  { name: 'grain', type: 'number', default: '0.06', description: 'Strength of the film grain.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Lets the view follow the cursor slightly and turns on the hover effect.'
  },
  {
    name: 'hoverEffect',
    type: "'focus' | 'part' | 'none'",
    default: "'focus'",
    description: 'Pulls the focus to the ribbon under the cursor, parts the fibers around it, or does nothing.'
  },
  { name: 'mouseStrength', type: 'number', default: '1', description: 'Strength of the hover effect.' },
  {
    name: 'pulseOnClick',
    type: 'boolean',
    default: 'true',
    description: 'Sends a pulse of light along the ribbon you click.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Draws the ribbons in from one end when the effect first appears.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the fibers as colored ink for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];
</script>
