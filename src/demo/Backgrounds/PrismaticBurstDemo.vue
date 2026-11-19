<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'spectrum']"
    :computed-props="{ colors: settings.colors }"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <PrismaticBurst :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="A burst of color, refracted from the core" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            v-if="!props.spectrum"
            title="Colors"
            :min="1"
            :model-value="props.colors"
            @update:model-value="value => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Animation"
            :options="ANIMATION_OPTIONS"
            :model-value="props.animationType"
            @update:model-value="value => updateProp('animationType', String(value))"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.2"
            :max="4"
            :step="0.05"
            :model-value="props.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="props.speed"
            @update:model-value="value => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Zoom"
            :min="0.4"
            :max="2.5"
            :step="0.05"
            :model-value="props.zoom"
            @update:model-value="value => updateProp('zoom', value)"
          />
          <PreviewSlider
            title="Ray Width"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="props.rayWidth"
            @update:model-value="value => updateProp('rayWidth', value)"
          />
          <PreviewSlider
            title="Ray Count"
            :min="0"
            :max="48"
            :step="1"
            :model-value="props.rayCount"
            @update:model-value="value => updateProp('rayCount', value)"
          />
          <PreviewSlider
            title="Distort"
            :min="0"
            :max="6"
            :step="0.1"
            :model-value="props.distort"
            @update:model-value="value => updateProp('distort', value)"
          />
          <PreviewSlider
            title="Twist"
            :min="-3"
            :max="3"
            :step="0.05"
            :model-value="props.twist"
            @update:model-value="value => updateProp('twist', value)"
          />
          <PreviewSlider
            title="Flow"
            :min="-1.5"
            :max="1.5"
            :step="0.05"
            :model-value="props.flow"
            @update:model-value="value => updateProp('flow', value)"
          />
          <PreviewSlider
            title="Center Fade"
            :min="0.5"
            :max="2"
            :step="0.05"
            :model-value="props.centerFade"
            @update:model-value="value => updateProp('centerFade', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0.3"
            :max="1"
            :step="0.05"
            :model-value="props.grain"
            @update:model-value="value => updateProp('grain', value)"
          />
          <PreviewSlider
            title="Cursor Strength"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="props.mouseStrength"
            @update:model-value="value => updateProp('mouseStrength', value)"
          />
          <PreviewSlider
            title="Cursor Smoothing"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.hoverDampness"
            @update:model-value="value => updateProp('hoverDampness', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="props.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSwitch
            title="Spectrum"
            :model-value="props.spectrum"
            @update:model-value="value => updateProp('spectrum', value)"
          />
          <PreviewSwitch
            title="Cursor"
            :model-value="props.mouseInteraction"
            @update:model-value="value => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Burst"
            :model-value="props.clickBurst"
            @update:model-value="value => updateProp('clickBurst', value)"
          />
          <PreviewSwitch title="Intro" :model-value="props.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Light Mode"
            :model-value="props.lightMode"
            @update:model-value="value => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="prismaticBurst" component-name="PrismaticBurst" />
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
import { prismaticBurst } from '@/constants/code/Backgrounds/prismaticBurstCode';
import PrismaticBurst from '@/content/Backgrounds/PrismaticBurst/PrismaticBurst.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps, type PrismaticBurstAnimation } from './presets/PrismaticBurst';

const ANIMATION_OPTIONS = [
  { value: 'rotate', label: 'Rotate' },
  { value: 'rotate3d', label: 'Rotate 3D' },
  { value: 'hover', label: 'Hover' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, spectrum, colors, ...rest } = props.value;
  void _preset;
  return { ...rest, animationType: rest.animationType as PrismaticBurstAnimation, colors: spectrum ? [] : colors };
});

const applyPreset = (value: string | number) => {
  updateProps({ ...presetProps(String(value), { defaults: defaultProps.value }), preset: String(value) });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: 'undefined',
    description: 'Colors blended through the rays, up to 64. Leave empty for a full spectrum.'
  },
  { name: 'intensity', type: 'number', default: '2', description: 'Overall brightness of the rays.' },
  { name: 'speed', type: 'number', default: '0.5', description: 'How fast the burst turns and shifts.' },
  {
    name: 'animationType',
    type: '"rotate" | "rotate3d" | "hover"',
    default: '"rotate3d"',
    description: 'Flat rotation, full 3D rotation, or a burst that turns to follow the cursor.'
  },
  { name: 'zoom', type: 'number', default: '1', description: 'How close the burst is. Higher values zoom in.' },
  {
    name: 'rayWidth',
    type: 'number',
    default: '1',
    description: 'Thickness of the rays, from thin threads to broad beams.'
  },
  {
    name: 'rayCount',
    type: 'number',
    default: '0',
    description: 'Splits the light into this many evenly spaced spokes. 0 keeps it organic.'
  },
  { name: 'distort', type: 'number', default: '0', description: 'Bends the rays into flowing, organic shapes.' },
  {
    name: 'twist',
    type: 'number',
    default: '0',
    description: 'Swirls the rays into a spiral. Negative values turn the other way.'
  },
  {
    name: 'flow',
    type: 'number',
    default: '0',
    description: 'Streams the colors through the burst. Negative values reverse the direction.'
  },
  {
    name: 'centerFade',
    type: 'number',
    default: '1',
    description: 'Size of the dark core at the heart of the burst, from 0.5 to 3.'
  },
  { name: 'glow', type: 'number', default: '0', description: 'Soft bloom around the brightest rays.' },
  { name: 'grain', type: 'number', default: '0.8', description: 'Film grain over the light, from 0.3 to 1.' },
  {
    name: 'offset',
    type: '{ x?: number | string; y?: number | string }',
    default: '{ x: 0, y: 0 }',
    description: 'Moves the center of the burst, in pixels. Positive y moves it up.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The burst leans toward the cursor and the rays near it brighten.'
  },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '0.5',
    description: 'How strongly the burst reacts to the cursor.'
  },
  {
    name: 'hoverDampness',
    type: 'number',
    default: '0.25',
    description: 'How smoothly the burst follows the cursor, from 0 to 1. Higher values feel heavier.'
  },
  {
    name: 'clickBurst',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a wave of light racing out along the rays.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'The burst ignites from the center when it mounts.' },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  {
    name: 'quality',
    type: '"low" | "medium" | "high"',
    default: '"high"',
    description: 'Render resolution. Lower settings are lighter on slower devices.'
  },
  {
    name: 'resolution',
    type: 'number',
    default: 'undefined',
    description: 'Exact render scale from 0.2 to 1. Overrides quality.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the burst as colored ink on a white background.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: 'undefined',
    description: 'CSS blend mode for the canvas, such as screen or lighten.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
