<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'source']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 640px">
          <ReflectiveCard
            :key="rerenderKey"
            :theme="theme"
            :video-src="props.source === 'studio' ? undefined : VIDEOS[theme]"
            :webcam="props.source === 'camera'"
            :on-webcam-error="() => updateProp('source', 'video')"
            v-bind="settings"
          />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="value => applyPreset(String(value))"
          />
          <PreviewSelect
            title="Reflection"
            :options="SOURCE_OPTIONS"
            :model-value="props.source"
            @update:model-value="value => updateProp('source', value as Source)"
          />
          <PreviewColorPickerCustom title="Tint" :color="settings.tint" @change="value => updateProp('tint', value)" />
          <PreviewInput
            title="Name"
            :model-value="settings.name"
            :max-length="28"
            @update:model-value="value => updateProp('name', value)"
          />
          <PreviewInput
            title="Role"
            :model-value="settings.role"
            :max-length="32"
            @update:model-value="value => updateProp('role', value)"
          />
          <PreviewSlider
            title="Metalness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.metalness"
            @update:model-value="value => updateProp('metalness', value)"
          />
          <PreviewSlider
            title="Roughness"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.roughness"
            @update:model-value="value => updateProp('roughness', value)"
          />
          <PreviewSlider
            title="Blur"
            :min="0"
            :max="20"
            :step="0.5"
            value-unit="px"
            :model-value="settings.blurStrength"
            @update:model-value="value => updateProp('blurStrength', value)"
          />
          <PreviewSlider
            title="Grayscale"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.grayscale"
            @update:model-value="value => updateProp('grayscale', value)"
          />
          <PreviewSlider
            title="Shine"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.shine"
            @update:model-value="value => updateProp('shine', value)"
          />
          <PreviewSlider
            title="Glare"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.glare"
            @update:model-value="value => updateProp('glare', value)"
          />
          <PreviewSlider
            title="Warp"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.warp"
            @update:model-value="value => updateProp('warp', value)"
          />
          <PreviewSlider
            title="Warp Scale"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.warpScale"
            @update:model-value="value => updateProp('warpScale', value)"
          />
          <PreviewSlider
            title="Bevel"
            :min="0"
            :max="12"
            :step="0.5"
            value-unit="px"
            :model-value="settings.bevel"
            @update:model-value="value => updateProp('bevel', value)"
          />
          <PreviewSlider
            title="Tilt Strength"
            :min="0"
            :max="25"
            :step="1"
            value-unit="°"
            :model-value="settings.tiltStrength"
            @update:model-value="value => updateProp('tiltStrength', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="0"
            :max="40"
            :step="1"
            value-unit="px"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSwitch
            title="Tilt"
            :model-value="settings.enableTilt"
            @update:model-value="value => updateProp('enableTilt', value)"
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
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['@hugeicons/vue', '@hugeicons/core-free-icons']" />
      </template>

      <template #code>
        <CodeExample :code-object="reflectiveCard" component-name="ReflectiveCard" />
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
import { reflectiveCard } from '@/constants/code/Components/reflectiveCardCode';
import ReflectiveCard from '@/content/Components/ReflectiveCard/ReflectiveCard.vue';

type Source = 'video' | 'studio' | 'camera';

const LOOK = {
  tint: '#ffffff',
  metalness: 1,
  roughness: 0.3,
  blurStrength: 6,
  grayscale: 1,
  warp: 0.6,
  warpScale: 1,
  shine: 1,
  bevel: 3,
  glare: 0.5
};

const DEFAULT_PROPS = {
  preset: 'steel',
  source: 'video' as Source,
  name: 'Alexander Doe',
  role: 'Senior Developer',
  ...LOOK,
  tiltStrength: 12,
  radius: 24,
  enableTilt: true,
  intro: true
};

const PRESETS: Record<string, Partial<typeof LOOK>> = {
  steel: {},
  brushed: { roughness: 0.85, blurStrength: 8, shine: 1.2 },
  mirror: { roughness: 0, blurStrength: 1.5, warp: 0.3 },
  gold: { tint: '#f3cf8a', shine: 1.1 },
  rose: { tint: '#f1b9a4' },
  satin: { blurStrength: 14, roughness: 0.5, glare: 0.4 }
};

const PRESET_OPTIONS = [
  { value: 'steel', label: 'Steel' },
  { value: 'brushed', label: 'Brushed' },
  { value: 'mirror', label: 'Mirror' },
  { value: 'gold', label: 'Gold' },
  { value: 'rose', label: 'Rose' },
  { value: 'satin', label: 'Satin' }
];

const SOURCE_OPTIONS = [
  { value: 'video', label: 'Video' },
  { value: 'studio', label: 'Studio' },
  { value: 'camera', label: 'Camera' }
];

const VIDEOS = {
  light: '/assets/demo/reflection-day.mp4',
  dark: '/assets/demo/reflection-night.mp4'
};

const propData: PropRow[] = [
  { name: 'name', type: 'string', default: "'Alexander Doe'", description: 'Name shown on the card.' },
  { name: 'role', type: 'string', default: "'Senior Developer'", description: 'Role shown under the name.' },
  { name: 'badge', type: 'string', default: "'Verified'", description: 'Label of the badge in the top left corner.' },
  {
    name: 'status',
    type: 'string',
    default: "'Active'",
    description: 'Label of the status chip in the top right corner.'
  },
  { name: 'statusColor', type: 'string', default: "'#22c55e'", description: 'Color of the status dot.' },
  { name: 'idLabel', type: 'string', default: "'ID number'", description: 'Small label above the ID number.' },
  { name: 'idValue', type: 'string', default: "'8901 2345 6789'", description: 'ID number shown in the footer.' },
  {
    name: 'default slot',
    type: 'slot',
    default: '-',
    description: 'Custom content for the card. Replaces the badge, name and footer.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Dark graphite or light silver metal, with matching text.'
  },
  {
    name: 'videoSrc',
    type: 'string',
    default: '-',
    description: 'Looping video the card reflects when the camera is off. Without one it reflects a soft studio.'
  },
  {
    name: 'webcam',
    type: 'boolean',
    default: 'false',
    description: 'Reflects the camera feed, mirrored. Asks for camera access and falls back to the video.'
  },
  {
    name: 'onWebcamError',
    type: '(error: Error) => void',
    default: '-',
    description: 'Called when camera access is denied or unavailable.'
  },
  { name: 'tint', type: 'string', default: "'#ffffff'", description: 'Color of the metal. White gives plain steel.' },
  {
    name: 'metalness',
    type: 'number',
    default: '1',
    description: 'How strongly the surface mirrors the scene, from 0 to 1. At 0 the card turns matte.'
  },
  {
    name: 'roughness',
    type: 'number',
    default: '0.3',
    description: 'Brushed grain of the metal, from 0 to 1. Stretches reflections along the grain.'
  },
  { name: 'blurStrength', type: 'number', default: '6', description: 'Blur of the reflection, in px.' },
  {
    name: 'grayscale',
    type: 'number',
    default: '1',
    description: 'Removes color from the reflection, from 0 to 1. Lower it to see the scene in color.'
  },
  {
    name: 'warp',
    type: 'number',
    default: '0.6',
    description: 'Gentle bends in the surface that ripple the reflection.'
  },
  { name: 'warpScale', type: 'number', default: '1', description: 'Size of the bends.' },
  {
    name: 'shine',
    type: 'number',
    default: '1',
    description: 'Brightness of the light band that sweeps across the card as it tilts.'
  },
  {
    name: 'bevel',
    type: 'number',
    default: '3',
    description: 'Width of the polished edge that catches the light, in px.'
  },
  {
    name: 'glare',
    type: 'number',
    default: '0.5',
    description: 'Strength of the light that follows the cursor, from 0 to 1.'
  },
  { name: 'enableTilt', type: 'boolean', default: 'true', description: 'Tilts the card toward the cursor.' },
  { name: 'tiltStrength', type: 'number', default: '12', description: 'Largest tilt angle, in degrees.' },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Fades the card in and sweeps the light across it once.'
  },
  { name: 'width', type: 'number | string', default: '320', description: 'Width of the card. Numbers are in px.' },
  { name: 'height', type: 'number | string', default: '500', description: 'Height of the card. Numbers are in px.' },
  { name: 'radius', type: 'number', default: '24', description: 'Corner radius, in px.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the card.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the card.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, source: _source, ...rest } = props.value;
  return rest;
});

const applyPreset = (value: string) => {
  const base = Object.fromEntries(
    Object.keys(LOOK).map(name => [name, defaultProps.value[name as keyof typeof LOOK]])
  ) as Partial<typeof DEFAULT_PROPS>;
  updateProps({ ...base, ...PRESETS[value], preset: value });
};

const computedProps = computed(() => ({
  ...(props.value.source === 'camera' ? { webcam: true } : {}),
  ...(theme.value === 'light' ? { theme: 'light' } : {})
}));
</script>
