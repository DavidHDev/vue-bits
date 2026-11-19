<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'colors']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0; cursor: crosshair">
          <div class="splash-cursor-demo-hint">
            <span>Move your cursor</span>
          </div>
          <SplashCursor v-if="settings.contained" :key="rerenderKey" :theme="theme" v-bind="settings" :colors="shown" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            v-if="!settings.rainbow"
            title="Colors"
            :min="1"
            :max="6"
            :model-value="shown"
            @update:model-value="(value: string[]) => updateProp('colors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Quality"
            :options="QUALITY_OPTIONS"
            :model-value="settings.quality"
            @update:model-value="(value: string | number) => updateProp('quality', value as Quality)"
          />
          <PreviewSlider
            title="Color Speed"
            :min="0"
            :max="4"
            :step="0.05"
            :model-value="settings.colorSpeed"
            @update:model-value="value => updateProp('colorSpeed', value)"
          />
          <PreviewSlider
            title="Intensity"
            :min="0.2"
            :max="3"
            :step="0.05"
            :model-value="settings.intensity"
            @update:model-value="value => updateProp('intensity', value)"
          />
          <PreviewSlider
            title="Size"
            :min="0.2"
            :max="4"
            :step="0.05"
            :model-value="settings.size"
            @update:model-value="value => updateProp('size', value)"
          />
          <PreviewSlider
            title="Force"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.force"
            @update:model-value="value => updateProp('force', value)"
          />
          <PreviewSlider
            title="Swirl"
            :min="0"
            :max="40"
            :step="0.5"
            :model-value="settings.swirl"
            @update:model-value="value => updateProp('swirl', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0.2"
            :max="5"
            :step="0.05"
            :model-value="settings.trail"
            @update:model-value="value => updateProp('trail', value)"
          />
          <PreviewSlider
            title="Momentum"
            :min="0.2"
            :max="5"
            :step="0.05"
            :model-value="settings.momentum"
            @update:model-value="value => updateProp('momentum', value)"
          />
          <PreviewSlider
            title="Shading"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.shading"
            @update:model-value="value => updateProp('shading', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.glow"
            @update:model-value="value => updateProp('glow', value)"
          />
          <PreviewSwitch
            title="Rainbow"
            :model-value="settings.rainbow"
            @update:model-value="value => updateProp('rainbow', value)"
          />
          <PreviewSwitch
            title="Click Splash"
            :model-value="settings.clickSplash"
            @update:model-value="value => updateProp('clickSplash', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Contained"
            :model-value="settings.contained"
            @update:model-value="value => updateProp('contained', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="splashCursor" component-name="SplashCursor" />
      </template>
    </TabsLayout>

    <SplashCursor v-if="!settings.contained" :key="rerenderKey" :theme="theme" v-bind="settings" :colors="shown" />
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
import { useColorModeValue } from '@/composables/useTheme';
import { splashCursor } from '@/constants/code/Animations/splashCursorCode';
import SplashCursor from '@/content/Animations/SplashCursor/SplashCursor.vue';
import { CLASSIC, LOOK, PRESET_OPTIONS, presetProps } from './presets/SplashCursor';

type Quality = 'low' | 'medium' | 'high';

const DEFAULT_PROPS = {
  preset: 'classic',
  ...LOOK,
  ...CLASSIC,
  quality: 'high' as Quality,
  clickSplash: true,
  intro: true,
  contained: false
};

const LIGHT_SWAP: Record<string, string> = {
  '#42b883': '#1f9d45',
  '#e5e5e5': '#3f3f3f',
  '#3b82f6': '#1d4ed8'
};

const DARK_SWAP: Record<string, string> = Object.fromEntries(
  Object.entries(LIGHT_SWAP).map(([dark, light]) => [light, dark])
);

const QUALITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#4f8cff', '#2dd4bf', '#ffd166']",
    description: 'Palette the ink cycles through when rainbow is off.'
  },
  {
    name: 'rainbow',
    type: 'boolean',
    default: 'true',
    description: 'Cycles through the full spectrum instead of the palette.'
  },
  {
    name: 'colorSpeed',
    type: 'number',
    default: '1',
    description: 'How fast the colors shift while you move. 0 keeps one color per stroke.'
  },
  { name: 'intensity', type: 'number', default: '1', description: 'How much ink each movement leaves behind.' },
  { name: 'size', type: 'number', default: '1', description: 'Width of the stroke and the splash.' },
  { name: 'force', type: 'number', default: '1', description: 'How hard the cursor pushes the fluid.' },
  { name: 'swirl', type: 'number', default: '3', description: 'Amount of curling eddies in the flow.' },
  {
    name: 'trail',
    type: 'number',
    default: '1',
    description: 'How long the ink lingers before it fades. 2 lasts twice as long.'
  },
  {
    name: 'momentum',
    type: 'number',
    default: '1',
    description: 'How long the fluid keeps moving after the cursor stops.'
  },
  { name: 'shading', type: 'number', default: '1', description: 'Depth shading on the ripples, from 0 to 1.' },
  { name: 'glow', type: 'number', default: '0', description: 'Soft bloom around the brightest ink, from 0 to 1.' },
  {
    name: 'quality',
    type: "'low' | 'medium' | 'high'",
    default: "'high'",
    description: 'Simulation detail. Lower settings are lighter on older devices.'
  },
  { name: 'clickSplash', type: 'boolean', default: 'true', description: 'Bursts a splash where you click or tap.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Plays a short stroke across the screen on mount.' },
  {
    name: 'contained',
    type: 'boolean',
    default: 'false',
    description: 'Fills the parent element instead of the whole viewport and only reacts inside it.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Glowing ink for dark backgrounds or absorbing ink for light ones.'
  },
  { name: 'zIndex', type: 'number', default: '50', description: 'Stacking order of the effect over your content.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'StyleValue', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, colors: _colors, ...rest } = props.value;
  return rest;
});

const shown = computed(() => {
  const swap = theme.value === 'light' ? LIGHT_SWAP : DARK_SWAP;
  const colors = props.value.colors?.length ? props.value.colors : LOOK.colors;
  return colors.map(color => swap[color.toLowerCase()] ?? color);
});

const computedProps = computed(() => ({
  colors: shown.value,
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value), preset: value });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>

<style scoped>
.splash-cursor-demo-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.splash-cursor-demo-hint span {
  font-size: 14px;
  color: var(--text-muted);
  user-select: none;
}
</style>
