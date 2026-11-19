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
          <GradientBlinds :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Let a little light into your next launch" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewColorList
            title="Colors"
            :min="1"
            :max="8"
            :model-value="settings.gradientColors"
            @update:model-value="(value: string[]) => updateProp('gradientColors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Click Effect"
            :options="CLICK_OPTIONS"
            :model-value="settings.clickEffect"
            @update:model-value="(value: string | number) => updateProp('clickEffect', value as 'ripple' | 'none')"
          />
          <PreviewSelect
            title="Idle Light"
            :options="IDLE_OPTIONS"
            :model-value="settings.idle"
            @update:model-value="(value: string | number) => updateProp('idle', value as 'drift' | 'center' | 'stay')"
          />
          <PreviewSelect
            title="Light Direction"
            :options="DIRECTION_OPTIONS"
            :model-value="settings.shineDirection"
            @update:model-value="(value: string | number) => updateProp('shineDirection', value as 'left' | 'right')"
          />
          <PreviewColorPickerCustom
            title="Light Color"
            :color="settings.lightColor"
            @change="(value: string) => updateProp('lightColor', value)"
          />
          <PreviewSlider
            title="Angle"
            :min="-90"
            :max="90"
            :step="1"
            value-unit="°"
            :model-value="settings.angle"
            @update:model-value="(value: number) => updateProp('angle', value)"
          />
          <PreviewSlider
            title="Blind Count"
            :min="2"
            :max="64"
            :step="1"
            :model-value="settings.blindCount"
            @update:model-value="(value: number) => updateProp('blindCount', value)"
          />
          <PreviewSlider
            title="Min Blind Width"
            :min="10"
            :max="200"
            :step="5"
            value-unit="px"
            :model-value="settings.blindMinWidth"
            @update:model-value="(value: number) => updateProp('blindMinWidth', value)"
          />
          <PreviewSlider
            title="Spotlight Radius"
            :min="0.1"
            :max="1.5"
            :step="0.01"
            :model-value="settings.spotlightRadius"
            @update:model-value="(value: number) => updateProp('spotlightRadius', value)"
          />
          <PreviewSlider
            title="Spotlight Softness"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.spotlightSoftness"
            @update:model-value="(value: number) => updateProp('spotlightSoftness', value)"
          />
          <PreviewSlider
            title="Spotlight Opacity"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.spotlightOpacity"
            @update:model-value="(value: number) => updateProp('spotlightOpacity', value)"
          />
          <PreviewSlider
            title="Shine"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.shine"
            @update:model-value="(value: number) => updateProp('shine', value)"
          />
          <PreviewSlider
            title="Relief"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.relief"
            @update:model-value="(value: number) => updateProp('relief', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Sway"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.sway"
            @update:model-value="(value: number) => updateProp('sway', value)"
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
            title="Hover Tilt"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.hoverTilt"
            @update:model-value="(value: number) => updateProp('hoverTilt', value)"
          />
          <PreviewSlider
            title="Perspective"
            :min="-1"
            :max="1"
            :step="0.01"
            :model-value="settings.perspective"
            @update:model-value="(value: number) => updateProp('perspective', value)"
          />
          <PreviewSlider
            title="Gradient Speed"
            :min="0"
            :max="4"
            :step="0.05"
            :model-value="settings.gradientSpeed"
            @update:model-value="(value: number) => updateProp('gradientSpeed', value)"
          />
          <PreviewSlider
            title="Distort"
            :min="0"
            :max="40"
            :step="1"
            :model-value="settings.distortAmount"
            @update:model-value="(value: number) => updateProp('distortAmount', value)"
          />
          <PreviewSlider
            title="Noise"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.noise"
            @update:model-value="(value: number) => updateProp('noise', value)"
          />
          <PreviewSlider
            title="Mouse Dampening"
            :min="0"
            :max="1"
            :step="0.01"
            value-unit="s"
            :model-value="settings.mouseDampening"
            @update:model-value="(value: number) => updateProp('mouseDampening', value)"
          />
          <PreviewSwitch
            title="Mirror Gradient"
            :model-value="settings.mirrorGradient"
            @update:model-value="(value: boolean) => updateProp('mirrorGradient', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="(value: boolean) => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="gradientBlinds" component-name="GradientBlinds" />
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
import { gradientBlinds } from '@/constants/code/Backgrounds/gradientBlindsCode';
import GradientBlinds from '@/content/Backgrounds/GradientBlinds/GradientBlinds.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/GradientBlinds';

const DIRECTION_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const CLICK_OPTIONS = [
  { value: 'ripple', label: 'Ripple' },
  { value: 'none', label: 'None' }
];

const IDLE_OPTIONS = [
  { value: 'drift', label: 'Drift' },
  { value: 'center', label: 'Center' },
  { value: 'stay', label: 'Stay' }
];

const propData: PropRow[] = [
  {
    name: 'gradientColors',
    type: 'string[]',
    default: "['#a0ffbc', '#42b883']",
    description: 'Colors of the gradient across the blinds, up to 8. One color is used for every blind.'
  },
  {
    name: 'angle',
    type: 'number',
    default: '0',
    description: 'Rotation of the blinds in degrees. 0 stands them upright.'
  },
  {
    name: 'blindCount',
    type: 'number',
    default: '16',
    description: 'Number of blinds. Acts as an upper limit when blindMinWidth is set.'
  },
  {
    name: 'blindMinWidth',
    type: 'number',
    default: '60',
    description: 'Narrowest a blind can get, in px. Fewer blinds are drawn on small screens to respect it.'
  },
  {
    name: 'shineDirection',
    type: "'left' | 'right'",
    default: "'left'",
    description: 'Which edge of each blind catches the light.'
  },
  {
    name: 'lightColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Color of the light that falls on the blinds. Warm or cool whites change the mood.'
  },
  {
    name: 'spotlightRadius',
    type: 'number',
    default: '0.5',
    description: 'Size of the light around the cursor, relative to the area.'
  },
  {
    name: 'spotlightSoftness',
    type: 'number',
    default: '1',
    description: 'How the light fades toward its edge. Higher values keep it brighter for longer, then drop off.'
  },
  {
    name: 'spotlightOpacity',
    type: 'number',
    default: '1',
    description: 'Strength of the light.'
  },
  {
    name: 'shine',
    type: 'number',
    default: '0.4',
    description: 'Soft highlight along the lit edge of each blind, strongest near the light, from 0 (matte) to 1.'
  },
  {
    name: 'relief',
    type: 'number',
    default: '0.5',
    description: 'Depth of the shadow where each blind tucks under the next, from 0 (flat) to 1.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0.4',
    description: 'Soft haze of colored light around the cursor.'
  },
  {
    name: 'sway',
    type: 'number',
    default: '0.35',
    description: 'How much the blinds drift and turn on their own, as if in a breeze.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Speed of the sway and of the drifting light.'
  },
  {
    name: 'hoverTilt',
    type: 'number',
    default: '0.6',
    description: 'How much the blinds near the cursor turn toward the light and brighten, from 0 to 1.'
  },
  {
    name: 'clickEffect',
    type: "'ripple' | 'none'",
    default: "'ripple'",
    description: 'Clicking sends a wave of light through the blinds, from slat to slat outward from the click.'
  },
  {
    name: 'idle',
    type: "'drift' | 'center' | 'stay'",
    default: "'drift'",
    description: 'What the light does while the cursor is away: wander slowly, return to the middle, or stay put.'
  },
  {
    name: 'perspective',
    type: 'number',
    default: '0',
    description: 'Makes the blinds recede to one side like a window seen at an angle, from -1 to 1.'
  },
  {
    name: 'gradientSpeed',
    type: 'number',
    default: '0',
    description: 'Drifts the colors across the blinds over time. 0 keeps them still.'
  },
  {
    name: 'mirrorGradient',
    type: 'boolean',
    default: 'false',
    description: 'Runs the gradient forward and back again instead of once across.'
  },
  {
    name: 'distortAmount',
    type: 'number',
    default: '0',
    description: 'Bends the blinds into soft waves.'
  },
  {
    name: 'noise',
    type: 'number',
    default: '0.3',
    description: 'Strength of the film grain, from 0 (clean) to 1.'
  },
  {
    name: 'mouseDampening',
    type: 'number',
    default: '0.15',
    description: 'How long the light takes to catch up with the cursor, in seconds. 0 follows instantly.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Fades the light in while the blinds turn into place on mount.'
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description: 'Freezes the current frame.'
  },
  {
    name: 'mixBlendMode',
    type: 'string',
    default: "'lighten'",
    description: 'CSS blend mode of the blinds over the page in dark mode, so dark areas show the page behind.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the blinds as clean colored light on a white page.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { colorMode } = useColorMode();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({
    ...presetProps(value, { light: colorMode.value === 'light', defaults: defaultProps.value }),
    preset: value
  });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
