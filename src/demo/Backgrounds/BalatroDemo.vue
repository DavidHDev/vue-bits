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
          <Balatro :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Swirling psychedelic colors, dealt straight from the deck." />
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
            title="Color 1"
            :color="settings.color1"
            @change="(value: string) => updateProp('color1', value)"
          />
          <PreviewColorPickerCustom
            title="Color 2"
            :color="settings.color2"
            @change="(value: string) => updateProp('color2', value)"
          />
          <PreviewColorPickerCustom
            title="Color 3"
            :color="settings.color3"
            @change="(value: string) => updateProp('color3', value)"
          />
          <PreviewSlider
            title="Contrast"
            :min="1"
            :max="8"
            :step="0.1"
            :model-value="settings.contrast"
            @update:model-value="(value: number) => updateProp('contrast', value)"
          />
          <PreviewSlider
            title="Lighting"
            :min="0"
            :max="1.2"
            :step="0.05"
            :model-value="settings.lighting"
            @update:model-value="(value: number) => updateProp('lighting', value)"
          />
          <PreviewSlider
            title="Swirl"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.swirl"
            @update:model-value="(value: number) => updateProp('swirl', value)"
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
            title="Rotation Speed"
            :min="-5"
            :max="5"
            :step="0.1"
            :model-value="settings.rotationSpeed"
            @update:model-value="(value: number) => updateProp('rotationSpeed', value)"
          />
          <PreviewSlider
            title="Scale"
            :min="0.4"
            :max="3"
            :step="0.05"
            :model-value="settings.scale"
            @update:model-value="(value: number) => updateProp('scale', value)"
          />
          <PreviewSlider
            title="Detail"
            :min="1"
            :max="8"
            :step="1"
            :model-value="settings.detail"
            @update:model-value="(value: number) => updateProp('detail', value)"
          />
          <PreviewSlider
            title="Pixel Size"
            :min="0"
            :max="12"
            :step="0.5"
            :model-value="settings.pixelSize"
            @update:model-value="(value: number) => updateProp('pixelSize', value)"
          />
          <PreviewSlider
            title="CRT"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.crt"
            @update:model-value="(value: number) => updateProp('crt', value)"
          />
          <PreviewSlider
            title="Mouse Strength"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.mouseStrength"
            @update:model-value="(value: number) => updateProp('mouseStrength', value)"
          />
          <PreviewSwitch
            title="Mouse Interaction"
            :model-value="settings.mouseInteraction"
            @update:model-value="(value: boolean) => updateProp('mouseInteraction', value)"
          />
          <PreviewSwitch
            title="Click Swirl"
            :model-value="settings.clickSwirl"
            @update:model-value="(value: boolean) => updateProp('clickSwirl', value)"
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
        <CodeExample :code-object="balatro" component-name="Balatro" />
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
import { balatro } from '@/constants/code/Backgrounds/balatroCode';
import Balatro from '@/content/Backgrounds/Balatro/Balatro.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Balatro';

const propData: PropRow[] = [
  { name: 'color1', type: 'string', default: "'#DE443B'", description: 'Main paint color.' },
  { name: 'color2', type: 'string', default: "'#006BB4'", description: 'Second paint color, swirled into the first.' },
  { name: 'color3', type: 'string', default: "'#162325'", description: 'Color of the gaps between the two paints.' },
  {
    name: 'contrast',
    type: 'number',
    default: '3.5',
    description: 'How sharply the paints separate. Lower values blend them into soft washes.'
  },
  { name: 'lighting', type: 'number', default: '0.4', description: 'Strength of the glossy highlights on the paint.' },
  {
    name: 'swirl',
    type: 'number',
    default: '0.25',
    description: 'How tightly the paint spirals around the center, from 0 to 1.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'How fast the paint flows. 0 freezes it.' },
  {
    name: 'rotationSpeed',
    type: 'number',
    default: '0',
    description: 'Turns the whole swirl continuously. Negative values turn it the other way.'
  },
  { name: 'scale', type: 'number', default: '1', description: 'Size of the paint shapes. Higher values zoom in.' },
  {
    name: 'detail',
    type: 'number',
    default: '5',
    description: 'How many times the paint folds over itself, from 1 to 8. Higher values add finer streaks.'
  },
  {
    name: 'offset',
    type: '[number, number]',
    default: '[0, 0]',
    description: 'Moves the center of the swirl, as a fraction of the container diagonal.'
  },
  {
    name: 'pixelSize',
    type: 'number',
    default: '1.5',
    description: 'Size of the pixels in CSS pixels. 0 renders it smooth.'
  },
  {
    name: 'crt',
    type: 'number',
    default: '0',
    description: 'Adds the scanlines and soft edge falloff of an old CRT screen, from 0 to 1.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'The cursor stirs the paint and steers the swirl.'
  },
  {
    name: 'mouseStrength',
    type: 'number',
    default: '1',
    description: 'How strongly the cursor drags the paint along.'
  },
  {
    name: 'clickSwirl',
    type: 'boolean',
    default: 'true',
    description: 'Clicking spins the paint into a whirlpool that slowly unwinds.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'The swirl spins into place on mount.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Lightens the gaps between the paints so it sits on light pages.'
  },
  { name: 'opacity', type: 'number', default: '1', description: 'Overall opacity, from 0 to 1.' },
  {
    name: 'maxDevicePixelRatio',
    type: 'number',
    default: '2',
    description: 'Highest pixel ratio the canvas renders at.'
  },
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
