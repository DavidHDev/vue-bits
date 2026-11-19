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
          <SlicedWaves :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Waves of light, sliced and set in motion." />
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
            title="Ribbons"
            :min="1"
            :max="6"
            :step="1"
            :model-value="settings.ribbons"
            @update:model-value="(value: number) => updateProp('ribbons', value)"
          />
          <PreviewSlider
            title="Spacing"
            :min="8"
            :max="60"
            :step="1"
            value-unit="px"
            :model-value="settings.spacing"
            @update:model-value="(value: number) => updateProp('spacing', value)"
          />
          <PreviewSlider
            title="Bar Width"
            :min="0.15"
            :max="1"
            :step="0.05"
            :model-value="settings.barWidth"
            @update:model-value="(value: number) => updateProp('barWidth', value)"
          />
          <PreviewSlider
            title="Ribbon Height"
            :min="0.04"
            :max="0.5"
            :step="0.01"
            :model-value="settings.ribbonHeight"
            @update:model-value="(value: number) => updateProp('ribbonHeight', value)"
          />
          <PreviewSlider
            title="Spread"
            :min="0"
            :max="0.25"
            :step="0.005"
            :model-value="settings.spread"
            @update:model-value="(value: number) => updateProp('spread', value)"
          />
          <PreviewSlider
            title="Amplitude"
            :min="0"
            :max="0.25"
            :step="0.005"
            :model-value="settings.amplitude"
            @update:model-value="(value: number) => updateProp('amplitude', value)"
          />
          <PreviewSlider
            title="Frequency"
            :min="0.2"
            :max="3"
            :step="0.05"
            :model-value="settings.frequency"
            @update:model-value="(value: number) => updateProp('frequency', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="-2"
            :max="2"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Perspective"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.perspective"
            @update:model-value="(value: number) => updateProp('perspective', value)"
          />
          <PreviewSlider
            title="Curve"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.curve"
            @update:model-value="(value: number) => updateProp('curve', value)"
          />
          <PreviewSlider
            title="Blur"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.blur"
            @update:model-value="(value: number) => updateProp('blur', value)"
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
            title="Brightness"
            :min="0.3"
            :max="2.5"
            :step="0.05"
            :model-value="settings.brightness"
            @update:model-value="(value: number) => updateProp('brightness', value)"
          />
          <PreviewSlider
            title="Position"
            :min="0"
            :max="1"
            :step="0.01"
            :model-value="settings.position"
            @update:model-value="(value: number) => updateProp('position', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="-180"
            :max="180"
            :step="1"
            value-unit="°"
            :model-value="settings.rotation"
            @update:model-value="(value: number) => updateProp('rotation', value)"
          />
          <PreviewSlider
            title="Slices"
            :min="0"
            :max="14"
            :step="1"
            :model-value="settings.slices"
            @update:model-value="(value: number) => updateProp('slices', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.2"
            :step="0.01"
            :model-value="settings.grain"
            @update:model-value="(value: number) => updateProp('grain', value)"
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
        <CodeExample :code-object="slicedWaves" component-name="SlicedWaves" />
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
import { slicedWaves } from '@/constants/code/Backgrounds/slicedWavesCode';
import SlicedWaves from '@/content/Backgrounds/SlicedWaves/SlicedWaves.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/SlicedWaves';

const propData: PropRow[] = [
  { name: 'color1', type: 'string', default: "'#ffd9a8'", description: 'First color of the light.' },
  { name: 'color2', type: 'string', default: "'#42b883'", description: 'Second color of the light.' },
  { name: 'color3', type: 'string', default: "'#5b8cff'", description: 'Third color of the light.' },
  { name: 'ribbons', type: 'number', default: '3', description: 'Number of waves of light, from 1 to 6.' },
  {
    name: 'spacing',
    type: 'number',
    default: '28',
    description: 'Distance between the bars in the middle of the view, in px.'
  },
  { name: 'barWidth', type: 'number', default: '0.5', description: 'Width of each bar, as a share of the spacing.' },
  {
    name: 'ribbonHeight',
    type: 'number',
    default: '0.26',
    description: 'Height of each wave, as a fraction of the view height.'
  },
  {
    name: 'spread',
    type: 'number',
    default: '0.1',
    description: 'Vertical distance between the waves, as a fraction of the view height.'
  },
  {
    name: 'amplitude',
    type: 'number',
    default: '0.1',
    description: 'How far the waves rise and fall, as a fraction of the view height.'
  },
  { name: 'frequency', type: 'number', default: '1', description: 'How many waves fit across the view.' },
  { name: 'speed', type: 'number', default: '1', description: 'Animation speed. Negative values reverse the waves.' },
  {
    name: 'perspective',
    type: 'number',
    default: '0.45',
    description: 'How much the strip of bars turns away from you, from 0 to 1.'
  },
  { name: 'curve', type: 'number', default: '0.5', description: 'How much the strip bends in depth, from 0 to 1.' },
  {
    name: 'blur',
    type: 'number',
    default: '0.6',
    description: 'Depth of field. Bars away from the focus soften, and the focus follows the cursor.'
  },
  { name: 'glow', type: 'number', default: '1', description: 'Strength of the soft light around each bar.' },
  {
    name: 'brightness',
    type: 'number',
    default: '1.25',
    description: 'Overall brightness. Where waves overlap, the light burns to white.'
  },
  {
    name: 'position',
    type: 'number',
    default: '0.78',
    description: 'Vertical position of the waves, from 0 at the top to 1 at the bottom.'
  },
  { name: 'rotation', type: 'number', default: '0', description: 'Rotation of the whole effect, in degrees.' },
  {
    name: 'slices',
    type: 'number',
    default: '0',
    description: 'Cuts the bars into segments like an LED display. 0 keeps them solid.'
  },
  { name: 'grain', type: 'number', default: '0.08', description: 'Strength of the film grain.' },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Pulls the focus to the bars under the cursor and lights them up.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Grows the bars in across the view on mount.' },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the bars as colored ink for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
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
</script>
