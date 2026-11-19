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
          <Orb :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Move closer and the orb reaches for you." />
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
            v-for="(title, index) in COLOR_TITLES"
            :key="title"
            :title="title"
            :color="settings.colors[index]"
            @change="(value: string) => setColor(index, value)"
          />
          <PreviewSlider
            title="Hue Shift"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :model-value="settings.hue"
            @update:model-value="(value: number) => updateProp('hue', value)"
          />
          <PreviewSlider
            title="Size"
            :min="0.4"
            :max="1.6"
            :step="0.01"
            :model-value="settings.size"
            @update:model-value="(value: number) => updateProp('size', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Bleed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.bleed"
            @update:model-value="(value: number) => updateProp('bleed', value)"
          />
          <PreviewSlider
            title="Wobble"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.wobble"
            @update:model-value="(value: number) => updateProp('wobble', value)"
          />
          <PreviewSlider
            title="Highlight"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.highlight"
            @update:model-value="(value: number) => updateProp('highlight', value)"
          />
          <PreviewSlider
            title="Trail"
            :min="0"
            :max="4"
            :step="0.05"
            :model-value="settings.trail"
            @update:model-value="(value: number) => updateProp('trail', value)"
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
            title="Speed"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Hover Intensity"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.hoverIntensity"
            @update:model-value="(value: number) => updateProp('hoverIntensity', value)"
          />
          <PreviewColorPickerCustom
            title="Background Color"
            :color="settings.backgroundColor"
            @change="(value: string) => updateProp('backgroundColor', value)"
          />
          <PreviewSwitch
            title="Rotate On Hover"
            :model-value="settings.rotateOnHover"
            @update:model-value="(value: boolean) => updateProp('rotateOnHover', value)"
          />
          <PreviewSwitch
            title="Force Hover State"
            :model-value="settings.forceHoverState"
            @update:model-value="(value: boolean) => updateProp('forceHoverState', value)"
          />
          <PreviewSwitch
            title="Follow Cursor"
            :model-value="settings.followCursor"
            @update:model-value="(value: boolean) => updateProp('followCursor', value)"
          />
          <PreviewSwitch
            title="Click Pulse"
            :model-value="settings.clickPulse"
            @update:model-value="(value: boolean) => updateProp('clickPulse', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="(value: boolean) => updateProp('intro', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="orb" component-name="Orb" />
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
import { orb } from '@/constants/code/Backgrounds/orbCode';
import Orb from '@/content/Backgrounds/Orb/Orb.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Orb';

const COLOR_TITLES = ['Primary Color', 'Secondary Color', 'Depth Color'];

const propData: PropRow[] = [
  {
    name: 'colors',
    type: 'string[]',
    default: "['#7cff67', '#4cc2e9', '#0c4a3a']",
    description: 'Two colors that swirl around the ring, then the deep color of the glow behind it.'
  },
  { name: 'hue', type: 'number', default: '0', description: 'Shifts the hue of every color, in degrees.' },
  {
    name: 'backgroundColor',
    type: 'string',
    default: "'#000000'",
    description: 'Color the orb sits on. Light colors switch it to a soft, filled style.'
  },
  { name: 'size', type: 'number', default: '1', description: 'Size of the orb relative to the container.' },
  { name: 'glow', type: 'number', default: '1', description: 'How soft and wide the glow around the ring is.' },
  {
    name: 'bleed',
    type: 'number',
    default: '1',
    description: 'How far the glow bleeds into the inside of the orb. 0 keeps a tight ring.'
  },
  { name: 'wobble', type: 'number', default: '1', description: 'How much the ring breathes and warps at rest.' },
  { name: 'highlight', type: 'number', default: '1', description: 'Brightness of the light that orbits the ring.' },
  {
    name: 'trail',
    type: 'number',
    default: '1',
    description: 'Length of the glowing tail behind the orbiting light. 0 removes it.'
  },
  {
    name: 'tiltX',
    type: 'number',
    default: '0',
    description: 'Tilts the ring back in perspective, in degrees. Positive values push the top away.'
  },
  {
    name: 'tiltY',
    type: 'number',
    default: '0',
    description: 'Turns the ring sideways in perspective, in degrees.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Speed of the swirl, the orbiting light and the breathing.'
  },
  {
    name: 'hoverIntensity',
    type: 'number',
    default: '1',
    description: 'How far the ring reaches toward the cursor and how brightly it lights up there.'
  },
  {
    name: 'rotateOnHover',
    type: 'boolean',
    default: 'true',
    description: 'Slowly turns the orb while it is hovered.'
  },
  {
    name: 'forceHoverState',
    type: 'boolean',
    default: 'false',
    description: 'Keeps the hover effect on without hovering.'
  },
  {
    name: 'followCursor',
    type: 'boolean',
    default: 'true',
    description: 'The orbiting light swings toward the cursor while the orb is hovered.'
  },
  { name: 'clickPulse', type: 'boolean', default: 'true', description: 'Clicking the orb makes it pulse and swirl.' },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Powers the orb on with a spring and a swirl.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const { isLight } = useColorMode();

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { light: isLight.value, defaults: defaultProps.value }), preset: value });
};

const setColor = (index: number, value: string) => {
  const next = [...settings.value.colors];
  next[index] = value;
  updateProp('colors', next);
};
</script>
