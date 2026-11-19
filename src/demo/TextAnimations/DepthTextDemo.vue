<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div
          class="demo-container relative overflow-hidden"
          style="min-height: 420px; max-height: 460px; margin-bottom: 24px; container-type: inline-size"
        >
          <RefreshButton v-if="settings.intro" @click="forceRerender" />
          <div class="relative text-center" style="padding-left: 32px; padding-right: 32px">
            <DepthText
              :key="`${props.preset}-${rerenderKey}`"
              v-bind="settings"
              :face-color="props.faceColor || 'currentColor'"
            />
          </div>
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewInput
            title="Text"
            placeholder="Your word"
            :max-length="12"
            :model-value="settings.text"
            @update:model-value="value => updateProp('text', value)"
          />
          <PreviewColorPickerCustom
            title="Face Color"
            :color="props.faceColor || ink"
            @change="value => updateProp('faceColor', value)"
          />
          <PreviewColorPickerCustom
            title="Depth Color"
            :color="settings.depthColor"
            @change="value => updateProp('depthColor', value)"
          />
          <PreviewSwitch
            title="Gradient Depth"
            :model-value="settings.gradientDepth"
            @update:model-value="value => updateProp('gradientDepth', value)"
          />
          <PreviewSlider
            title="Hover Push"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.hoverPush"
            @update:model-value="value => updateProp('hoverPush', value)"
          />
          <PreviewSwitch
            title="Float"
            :model-value="settings.float"
            @update:model-value="value => updateProp('float', value)"
          />
          <PreviewSlider
            title="Tilt"
            :min="0"
            :max="12"
            :step="0.5"
            value-unit="°"
            :model-value="settings.tilt"
            @update:model-value="value => updateProp('tilt', value)"
          />
          <PreviewSlider
            title="Smoothing"
            :min="0.04"
            :max="0.3"
            :step="0.01"
            :model-value="settings.smoothing"
            @update:model-value="value => updateProp('smoothing', value)"
          />
          <PreviewSlider
            title="Orbit Speed"
            :min="0.05"
            :max="1"
            :step="0.05"
            :is-disabled="!settings.autoOrbit"
            :model-value="settings.orbitSpeed"
            @update:model-value="value => updateProp('orbitSpeed', value)"
          />
          <PreviewSwitch
            title="Pointer Tracking"
            :model-value="settings.pointerTracking"
            @update:model-value="value => updateProp('pointerTracking', value)"
          />
          <PreviewSwitch
            title="Auto Orbit"
            :model-value="settings.autoOrbit"
            @update:model-value="value => updateProp('autoOrbit', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="
              value => {
                updateProp('intro', value);
                forceRerender();
              }
            "
          />
          <PreviewSelect
            title="Font Size"
            :options="FONT_SIZE_OPTIONS"
            :model-value="settings.fontSize"
            @update:model-value="value => updateProp('fontSize', String(value))"
          />
          <PreviewSelect
            title="Weight"
            :options="FONT_WEIGHT_OPTIONS"
            :model-value="settings.fontWeight"
            @update:model-value="value => updateProp('fontWeight', Number(value))"
          />
          <PreviewSlider
            title="Layers"
            :min="4"
            :max="56"
            :step="1"
            :model-value="settings.layers"
            @update:model-value="value => updateProp('layers', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0.8"
            :max="8"
            :step="0.1"
            value-unit="px"
            :model-value="settings.depth"
            @update:model-value="value => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Perspective"
            :min="450"
            :max="1500"
            :step="25"
            value-unit="px"
            :model-value="settings.perspective"
            @update:model-value="value => updateProp('perspective', value)"
          />
          <PreviewSwitch
            title="Shadow"
            :model-value="settings.shadow"
            @update:model-value="value => updateProp('shadow', value)"
          />
          <PreviewSwitch
            title="Outline"
            :model-value="settings.outline"
            @update:model-value="value => updateProp('outline', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="[]" />
      </template>

      <template #code>
        <CodeExample :code-object="depthText" component-name="DepthText" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewInput from '@/components/common/PreviewInput.vue';
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
import { depthText } from '@/constants/code/TextAnimations/depthTextCode';
import DepthText from '@/content/TextAnimations/DepthText/DepthText.vue';

const SIZE_COMPACT = 'clamp(2.5rem, 9cqi, 5.5rem)';
const SIZE_HERO = 'clamp(3rem, 12cqi, 7rem)';
const SIZE_BILLBOARD = 'clamp(3.5rem, 15cqi, 8.5rem)';

type Look = {
  depthColor: string;
  gradientDepth: boolean;
  hoverPush: number;
  float: boolean;
  tilt: number;
  smoothing: number;
  orbitSpeed: number;
  fontSize: string;
  fontWeight: number;
  layers: number;
  depth: number;
  perspective: number;
  shadow: boolean;
  outline: boolean;
};

const LOOK: Look = {
  depthColor: '#42b883',
  gradientDepth: false,
  hoverPush: 0.5,
  float: false,
  tilt: 7.5,
  smoothing: 0.14,
  orbitSpeed: 0.35,
  fontSize: SIZE_HERO,
  fontWeight: 900,
  layers: 34,
  depth: 2.4,
  perspective: 900,
  shadow: true,
  outline: false
};

const PRESETS: Record<string, Look> = {
  extrude: { ...LOOK },
  fade: {
    ...LOOK,
    depthColor: '#ff5a1f',
    gradientDepth: true,
    hoverPush: 0.65,
    tilt: 10,
    layers: 56,
    depth: 2.6
  },
  float: {
    ...LOOK,
    depthColor: '#a1a6a1',
    hoverPush: 0.4,
    float: true,
    tilt: 8,
    fontSize: SIZE_BILLBOARD,
    layers: 48,
    depth: 2.2
  },
  contour: {
    ...LOOK,
    depthColor: '#38bdf8',
    gradientDepth: true,
    hoverPush: 0.8,
    float: true,
    tilt: 10,
    fontWeight: 800,
    layers: 18,
    depth: 4.4,
    shadow: false,
    outline: true
  }
};

const DEFAULT_PROPS = {
  preset: 'extrude',
  text: 'Elevate',
  faceColor: '',
  ...LOOK,
  pointerTracking: true,
  autoOrbit: true,
  intro: true
};

const PRESET_OPTIONS = [
  { value: 'extrude', label: 'Extrude' },
  { value: 'fade', label: 'Fade' },
  { value: 'float', label: 'Float' },
  { value: 'contour', label: 'Contour' }
];

const FONT_WEIGHT_OPTIONS = [
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' }
];

const FONT_SIZE_OPTIONS = [
  { value: SIZE_COMPACT, label: 'Compact' },
  { value: SIZE_HERO, label: 'Hero' },
  { value: SIZE_BILLBOARD, label: 'Billboard' }
];

const propData: PropRow[] = [
  {
    name: 'text',
    type: 'string',
    default: '"Elevate"',
    description: 'The word or short phrase rendered as extruded type.'
  },
  {
    name: 'layers',
    type: 'number',
    default: '34',
    description: 'Number of stacked copies that form the extrusion. Clamped to protect the DOM.'
  },
  {
    name: 'depth',
    type: 'number',
    default: '2.4',
    description: 'Spacing in pixels between each layer of the extrusion.'
  },
  {
    name: 'faceColor',
    type: 'string',
    default: '"currentColor"',
    description: 'Color of the crisp front face. Follows the surrounding text color by default.'
  },
  {
    name: 'depthColor',
    type: 'string',
    default: '"#42b883"',
    description: 'Tint the extrusion fades into toward the back.'
  },
  {
    name: 'gradientDepth',
    type: 'boolean',
    default: 'false',
    description:
      'Paints the extrusion in the depth color right behind the face and fades it out to the background toward the back.'
  },
  {
    name: 'tilt',
    type: 'number',
    default: '7.5',
    description: 'Resting angle and maximum pointer-driven rotation, in degrees.'
  },
  {
    name: 'pointerTracking',
    type: 'boolean',
    default: 'true',
    description: 'Enables smoothed pointer parallax on fine pointer devices.'
  },
  {
    name: 'smoothing',
    type: 'number',
    default: '0.14',
    description: 'Damping amount used to ease rotation toward the pointer target.'
  },
  {
    name: 'perspective',
    type: 'number',
    default: '900',
    description: 'Perspective distance in pixels for the 3D stack.'
  },
  {
    name: 'autoOrbit',
    type: 'boolean',
    default: 'true',
    description: 'Adds a subtle orbit when pointer tracking is unavailable or idle.'
  },
  {
    name: 'orbitSpeed',
    type: 'number',
    default: '0.35',
    description: 'Speed of the fallback orbit in cycles per second.'
  },
  {
    name: 'hoverPush',
    type: 'number',
    default: '0',
    description:
      'How far hovering presses the text into the page, from 0 to 1. The extrusion compresses on a spring, pressing pushes a little deeper and releasing bounces back. 0 turns it off.'
  },
  {
    name: 'float',
    type: 'boolean',
    default: 'false',
    description: 'Lets the text bob and sway gently while it is not hovered.'
  },
  {
    name: 'fontSize',
    type: 'string',
    default: '"clamp(3rem, 12vw, 7rem)"',
    description: 'CSS font-size value for the display word.'
  },
  {
    name: 'fontWeight',
    type: 'number | string',
    default: '900',
    description: 'Font weight used for every layer.'
  },
  {
    name: 'shadow',
    type: 'boolean',
    default: 'true',
    description: 'Casts a soft drop shadow behind the extrusion.'
  },
  {
    name: 'outline',
    type: 'boolean',
    default: 'false',
    description: 'Draws the extrusion as stacked outlines instead of solid layers.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Grows the extrusion out from the flat face on mount.'
  },
  {
    name: 'className',
    type: 'string',
    default: '""',
    description: 'Optional class name for the outer wrapper.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '{}',
    description: 'Optional inline styles for the outer wrapper.'
  }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const settings = computed(() => {
  const { preset: _preset, faceColor: _faceColor, ...rest } = props.value;
  return rest;
});
const ink = useColorModeValue('#161816', '#ffffff');

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    (Object.keys(LOOK) as (keyof Look)[]).map(name => [name, defaultProps.value[name]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => ({ faceColor: props.value.faceColor || undefined }));
</script>
