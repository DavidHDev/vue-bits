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
          <PixelSnow :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Oh, the weather outside is frightful!" />
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
          <PreviewSelect
            title="Variant"
            :options="VARIANT_OPTIONS"
            :model-value="settings.variant"
            @update:model-value="(value: string | number) => updateProp('variant', value as PixelSnowVariant)"
          />
          <PreviewSlider
            title="Density"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.density"
            @update:model-value="(value: number) => updateProp('density', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="-1"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Wind"
            :min="-2"
            :max="2"
            :step="0.05"
            :model-value="settings.wind"
            @update:model-value="(value: number) => updateProp('wind', value)"
          />
          <PreviewSlider
            title="Sway"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.sway"
            @update:model-value="(value: number) => updateProp('sway', value)"
          />
          <PreviewSlider
            title="Flake Size"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.flakeSize"
            @update:model-value="(value: number) => updateProp('flakeSize', value)"
          />
          <PreviewSlider
            title="Pixel Size"
            :min="1"
            :max="8"
            :step="1"
            value-unit="px"
            :model-value="settings.pixelSize"
            @update:model-value="(value: number) => updateProp('pixelSize', value)"
          />
          <PreviewSlider
            title="Depth"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.depth"
            @update:model-value="(value: number) => updateProp('depth', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.2"
            :max="2"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Twinkle"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.twinkle"
            @update:model-value="(value: number) => updateProp('twinkle', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="(value: number) => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.opacity"
            @update:model-value="(value: number) => updateProp('opacity', value)"
          />
          <PreviewSwitch
            title="Accumulate"
            :model-value="settings.accumulate"
            @update:model-value="(value: boolean) => updateProp('accumulate', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Intro"
            :model-value="settings.intro"
            @update:model-value="(value: boolean) => updateProp('intro', value)"
          />
          <PreviewSwitch
            title="Light Mode"
            :model-value="settings.lightMode"
            @update:model-value="(value: boolean) => updateProp('lightMode', value)"
          />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="pixelSnow" component-name="PixelSnow" />
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
import { pixelSnow } from '@/constants/code/Backgrounds/pixelSnowCode';
import PixelSnow from '@/content/Backgrounds/PixelSnow/PixelSnow.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/PixelSnow';

type PixelSnowVariant = 'snowflake' | 'square' | 'round';

const VARIANT_OPTIONS = [
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'square', label: 'Square' },
  { value: 'round', label: 'Round' }
];

const propData: PropRow[] = [
  { name: 'color', type: 'string', default: "'#ffffff'", description: 'Color of the snow.' },
  {
    name: 'variant',
    type: "'snowflake' | 'square' | 'round'",
    default: "'snowflake'",
    description: 'Shape of the flakes: pixel crystals, square pixels or round pixels.'
  },
  { name: 'density', type: 'number', default: '0.5', description: 'How much snow is falling, from 0 to 1.' },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'How fast the snow falls. Negative values make it rise.'
  },
  {
    name: 'wind',
    type: 'number',
    default: '0.25',
    description: 'Sideways drift. Negative values blow to the left.'
  },
  { name: 'sway', type: 'number', default: '0.5', description: 'How much each flake swings as it falls.' },
  {
    name: 'flakeSize',
    type: 'number',
    default: '1',
    description: 'Size of the flakes, from 0 for mostly tiny specks to 2 for mostly large crystals.'
  },
  { name: 'pixelSize', type: 'number', default: '3', description: 'Size of one snow pixel in px.' },
  {
    name: 'depth',
    type: 'number',
    default: '0.6',
    description: 'How strongly far flakes fall slower and dimmer than near ones, from 0 to 1.'
  },
  { name: 'brightness', type: 'number', default: '1', description: 'Overall brightness of the snow.' },
  { name: 'glow', type: 'number', default: '0.8', description: 'Strength of the soft light around each flake.' },
  {
    name: 'twinkle',
    type: 'number',
    default: '0.35',
    description: 'How often flakes catch the light and sparkle, from 0 to 1.'
  },
  {
    name: 'accumulate',
    type: 'boolean',
    default: 'false',
    description: 'Lets the snow pile up in soft drifts along the bottom edge.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Lets the cursor brush the snow aside and stir it as it moves.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Lets the snow drift in from the top on mount.' },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the snow as colored pixels for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the snow in place.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
];

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};
</script>
