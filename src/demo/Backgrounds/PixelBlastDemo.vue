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
          <PixelBlast :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="It's dangerous to go alone! Take this." />
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
          <PreviewColorPickerCustom
            title="Accent Color"
            :color="settings.accentColor"
            @change="(value: string) => updateProp('accentColor', value)"
          />
          <PreviewSelect
            title="Variant"
            :options="VARIANT_OPTIONS"
            :model-value="settings.variant"
            @update:model-value="(value: string | number) => updateProp('variant', value as Settings['variant'])"
          />
          <PreviewSelect
            title="Hover Effect"
            :options="HOVER_OPTIONS"
            :model-value="settings.hoverEffect"
            @update:model-value="
              (value: string | number) => updateProp('hoverEffect', value as Settings['hoverEffect'])
            "
          />
          <PreviewSlider
            title="Pixel Size"
            :min="1"
            :max="12"
            :step="0.5"
            value-unit="px"
            :model-value="settings.pixelSize"
            @update:model-value="(value: number) => updateProp('pixelSize', value)"
          />
          <PreviewSlider
            title="Pattern Scale"
            :min="0.5"
            :max="5"
            :step="0.1"
            :model-value="settings.patternScale"
            @update:model-value="(value: number) => updateProp('patternScale', value)"
          />
          <PreviewSlider
            title="Pattern Density"
            :min="0.5"
            :max="2"
            :step="0.01"
            :model-value="settings.patternDensity"
            @update:model-value="(value: number) => updateProp('patternDensity', value)"
          />
          <PreviewSlider
            title="Pixel Jitter"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.pixelSizeJitter"
            @update:model-value="(value: number) => updateProp('pixelSizeJitter', value)"
          />
          <PreviewSlider
            title="Softness"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.softness"
            @update:model-value="(value: number) => updateProp('softness', value)"
          />
          <PreviewSlider
            title="Smoothing"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.smoothing"
            @update:model-value="(value: number) => updateProp('smoothing', value)"
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
            title="Twinkle"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.twinkle"
            @update:model-value="(value: number) => updateProp('twinkle', value)"
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
            title="Drift"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.drift"
            @update:model-value="(value: number) => updateProp('drift', value)"
          />
          <PreviewSlider
            title="Drift Angle"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :is-disabled="!settings.drift"
            :model-value="settings.driftAngle"
            @update:model-value="(value: number) => updateProp('driftAngle', value)"
          />
          <PreviewSlider
            title="Hover Radius"
            :min="40"
            :max="400"
            :step="10"
            value-unit="px"
            :is-disabled="settings.hoverEffect === 'none'"
            :model-value="settings.hoverRadius"
            @update:model-value="(value: number) => updateProp('hoverRadius', value)"
          />
          <PreviewSlider
            title="Ripple Speed"
            :min="0.05"
            :max="1"
            :step="0.01"
            :is-disabled="!settings.enableRipples"
            :model-value="settings.rippleSpeed"
            @update:model-value="(value: number) => updateProp('rippleSpeed', value)"
          />
          <PreviewSlider
            title="Ripple Thickness"
            :min="0.02"
            :max="0.4"
            :step="0.01"
            :is-disabled="!settings.enableRipples"
            :model-value="settings.rippleThickness"
            @update:model-value="(value: number) => updateProp('rippleThickness', value)"
          />
          <PreviewSlider
            title="Ripple Intensity"
            :min="0.2"
            :max="3"
            :step="0.05"
            :is-disabled="!settings.enableRipples"
            :model-value="settings.rippleIntensityScale"
            @update:model-value="(value: number) => updateProp('rippleIntensityScale', value)"
          />
          <PreviewSlider
            title="Auto Ripple"
            :min="0"
            :max="6"
            :step="0.1"
            value-unit="s"
            :is-disabled="!settings.enableRipples"
            :model-value="settings.autoRipple"
            @update:model-value="(value: number) => updateProp('autoRipple', value)"
          />
          <PreviewSlider
            title="Tilt X"
            :min="-70"
            :max="70"
            :step="1"
            value-unit="°"
            :model-value="settings.tiltX"
            @update:model-value="(value: number) => updateProp('tiltX', value)"
          />
          <PreviewSlider
            title="Tilt Y"
            :min="-70"
            :max="70"
            :step="1"
            value-unit="°"
            :model-value="settings.tiltY"
            @update:model-value="(value: number) => updateProp('tiltY', value)"
          />
          <PreviewSlider
            title="Edge Fade"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.edgeFade"
            @update:model-value="(value: number) => updateProp('edgeFade', value)"
          />
          <PreviewSwitch
            title="Ripples"
            :model-value="settings.enableRipples"
            @update:model-value="(value: boolean) => updateProp('enableRipples', value)"
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
        <CodeExample :code-object="pixelBlast" component-name="PixelBlast" />
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
import { useColorMode } from '@/composables/useTheme';
import { pixelBlast } from '@/constants/code/Backgrounds/pixelBlastCode';
import PixelBlast from '@/content/Backgrounds/PixelBlast/PixelBlast.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/PixelBlast';

type Settings = Omit<typeof DEFAULT_PROPS, 'preset'>;

const VARIANT_OPTIONS = [
  { value: 'square', label: 'Square' },
  { value: 'circle', label: 'Circle' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'cross', label: 'Cross' },
  { value: 'ring', label: 'Ring' }
];

const HOVER_OPTIONS = [
  { value: 'reveal', label: 'Reveal' },
  { value: 'grow', label: 'Grow' },
  { value: 'none', label: 'None' }
];

const propData: PropRow[] = [
  { name: 'color', type: 'string', default: "'#a0ffbc'", description: 'Color of the pixels.' },
  {
    name: 'accentColor',
    type: 'string',
    default: 'color',
    description: 'Color the densest areas, ripples and the area under the cursor shift toward.'
  },
  {
    name: 'variant',
    type: "'square' | 'circle' | 'triangle' | 'diamond' | 'cross' | 'ring'",
    default: "'square'",
    description: 'Shape of each pixel.'
  },
  { name: 'pixelSize', type: 'number', default: '3', description: 'Size of each pixel, in px.' },
  {
    name: 'patternScale',
    type: 'number',
    default: '2',
    description: 'Zoom of the cloud pattern. Higher values make smaller, busier clouds.'
  },
  {
    name: 'patternDensity',
    type: 'number',
    default: '1',
    description: 'How many pixels light up. Higher values fill more of the area.'
  },
  {
    name: 'pixelSizeJitter',
    type: 'number',
    default: '0',
    description: 'Random size variation between pixels, from 0 to 1.'
  },
  {
    name: 'softness',
    type: 'number',
    default: '0.6',
    description: 'Lets pixels grow and shrink smoothly as the pattern moves, instead of popping on and off.'
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '1',
    description: 'Smooths the edges of the clouds. 0 keeps the original blocky steps.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0.4',
    description: 'Soft light behind the densest areas, and a hot core in ripples.'
  },
  {
    name: 'twinkle',
    type: 'number',
    default: '0.25',
    description: 'Lets pixels shimmer at their own pace, from 0 to 1.'
  },
  { name: 'speed', type: 'number', default: '0.5', description: 'How fast the clouds change shape.' },
  {
    name: 'drift',
    type: 'number',
    default: '0.2',
    description: 'How fast the clouds slide across the area. 0 keeps them in place.'
  },
  { name: 'driftAngle', type: 'number', default: '30', description: 'Direction of the drift, in degrees.' },
  {
    name: 'hoverEffect',
    type: "'reveal' | 'grow' | 'none'",
    default: "'reveal'",
    description: 'What the cursor does: light up more pixels around it, or make nearby pixels swell and brighten.'
  },
  {
    name: 'hoverRadius',
    type: 'number',
    default: '140',
    description: 'Size of the area the cursor affects, in px.'
  },
  {
    name: 'enableRipples',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ring of pixels out from the click.'
  },
  { name: 'rippleSpeed', type: 'number', default: '0.3', description: 'How fast ripples spread.' },
  { name: 'rippleThickness', type: 'number', default: '0.1', description: 'Width of the ripple ring.' },
  { name: 'rippleIntensityScale', type: 'number', default: '1', description: 'Brightness of ripples.' },
  {
    name: 'autoRipple',
    type: 'number',
    default: '0',
    description: 'Sends a ripple from a random spot about this many seconds apart. 0 turns it off.'
  },
  {
    name: 'tiltX',
    type: 'number',
    default: '0',
    description: 'Tilts the pixels back into a floor that fades toward the horizon, in degrees.'
  },
  { name: 'tiltY', type: 'number', default: '0', description: 'Turns the pixels sideways in perspective, in degrees.' },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0.5',
    description: 'Fades the pixels out toward the edges, from 0 to 1.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Blasts the pixels out from the center in a ring on mount.'
  },
  { name: 'noiseAmount', type: 'number', default: '0', description: 'Film grain on the pixels.' },
  {
    name: 'transparent',
    type: 'boolean',
    default: 'true',
    description: 'Shows the page behind the pixels. Turn off for a solid black, or white in light mode, backdrop.'
  },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Darkens hot pixels instead of brightening them, for light pages.'
  },
  {
    name: 'variation',
    type: 'number',
    default: 'random',
    description: 'Picks a fixed pattern. Leave it out for a different one on every mount.'
  },
  {
    name: 'autoPauseOffscreen',
    type: 'boolean',
    default: 'true',
    description: 'Stops rendering while the background is scrolled out of view.'
  },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: '-', description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { isLight } = useColorMode();
const { props, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed<Settings>(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: isLight.value }), preset: value });
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};
</script>
