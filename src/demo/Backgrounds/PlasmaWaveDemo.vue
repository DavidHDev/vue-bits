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
          <PlasmaWave :key="rerenderKey" v-bind="settings" />
          <BackgroundContent headline="Plasma that glows and flows behind your hero." />
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
            :color="settings.colors[0]"
            @change="(value: string) => updateProp('colors', [value, settings.colors[1]])"
          />
          <PreviewColorPickerCustom
            title="Color 2"
            :color="settings.colors[1]"
            @change="(value: string) => updateProp('colors', [settings.colors[0], value])"
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
            title="Speed 1"
            :min="0"
            :max="0.2"
            :step="0.005"
            :model-value="settings.speed1"
            @update:model-value="(value: number) => updateProp('speed1', value)"
          />
          <PreviewSlider
            title="Speed 2"
            :min="0"
            :max="0.2"
            :step="0.005"
            :model-value="settings.speed2"
            @update:model-value="(value: number) => updateProp('speed2', value)"
          />
          <PreviewSlider
            title="Direction 2"
            :min="-1"
            :max="1"
            :step="0.1"
            :model-value="settings.dir2"
            @update:model-value="(value: number) => updateProp('dir2', value)"
          />
          <PreviewSlider
            title="Bend 1"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.bend1"
            @update:model-value="(value: number) => updateProp('bend1', value)"
          />
          <PreviewSlider
            title="Bend 2"
            :min="0"
            :max="3"
            :step="0.05"
            :model-value="settings.bend2"
            @update:model-value="(value: number) => updateProp('bend2', value)"
          />
          <PreviewSlider
            title="Thickness"
            :min="0.1"
            :max="0.6"
            :step="0.01"
            :model-value="settings.thickness"
            @update:model-value="(value: number) => updateProp('thickness', value)"
          />
          <PreviewSlider
            title="Focal Length"
            :min="0.3"
            :max="2"
            :step="0.05"
            :model-value="settings.focalLength"
            @update:model-value="(value: number) => updateProp('focalLength', value)"
          />
          <PreviewSlider
            title="Rotation"
            :min="0"
            :max="360"
            :step="1"
            value-unit="°"
            :model-value="settings.rotationDeg"
            @update:model-value="(value: number) => updateProp('rotationDeg', value)"
          />
          <PreviewSlider
            title="Brightness"
            :min="0.3"
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
            title="Core"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.core"
            @update:model-value="(value: number) => updateProp('core', value)"
          />
          <PreviewSlider
            title="Grain"
            :min="0"
            :max="0.15"
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
          <PreviewSlider
            title="Quality"
            :min="0.25"
            :max="1"
            :step="0.05"
            :model-value="settings.quality"
            @update:model-value="(value: number) => updateProp('quality', value)"
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
        <CodeExample :code-object="plasmaWave" component-name="PlasmaWave" />
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
import { plasmaWave } from '@/constants/code/Backgrounds/plasmaWaveCode';
import PlasmaWave from '@/content/Backgrounds/PlasmaWave/PlasmaWave.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/PlasmaWave';

const propData: PropRow[] = [
  {
    name: 'colors',
    type: '[string, string]',
    default: "['#7cff67', '#06B6D4']",
    description: 'Colors of the two waves of plasma.'
  },
  { name: 'speed', type: 'number', default: '1', description: 'Overall speed of the animation.' },
  { name: 'speed1', type: 'number', default: '0.05', description: 'How fast the first wave travels.' },
  { name: 'speed2', type: 'number', default: '0.05', description: 'How fast the second wave travels.' },
  {
    name: 'dir2',
    type: 'number',
    default: '1',
    description: 'Direction of the second wave. Use -1 to make it travel against the first.'
  },
  { name: 'bend1', type: 'number', default: '1', description: 'How far the first wave curls around its path.' },
  { name: 'bend2', type: 'number', default: '0.5', description: 'How far the second wave curls around its path.' },
  { name: 'thickness', type: 'number', default: '0.3', description: 'Thickness of the plasma ribbons.' },
  {
    name: 'focalLength',
    type: 'number',
    default: '1.25',
    description: 'Camera lens. Lower values give a wider, deeper view.'
  },
  { name: 'rotationDeg', type: 'number', default: '0', description: 'Rotation of the whole effect, in degrees.' },
  { name: 'xOffset', type: 'number', default: '0', description: 'Horizontal shift of the view, in px.' },
  { name: 'yOffset', type: 'number', default: '0', description: 'Vertical shift of the view, in px.' },
  { name: 'brightness', type: 'number', default: '1', description: 'Brightness of the plasma.' },
  { name: 'glow', type: 'number', default: '1', description: 'Strength of the soft light spilling around the plasma.' },
  {
    name: 'core',
    type: 'number',
    default: '0.6',
    description: 'How white-hot the brightest parts of the plasma get, from 0 to 1.'
  },
  { name: 'grain', type: 'number', default: '0.03', description: 'Strength of the film grain.' },
  {
    name: 'quality',
    type: 'number',
    default: '1',
    description: 'Detail of the plasma, from 0.25 to 1. Lower values render faster on slow devices.'
  },
  {
    name: 'mouseInteraction',
    type: 'boolean',
    default: 'true',
    description: 'Swells and brightens the plasma near the cursor.'
  },
  { name: 'intro', type: 'boolean', default: 'true', description: 'Unfolds the plasma and fades it in on mount.' },
  { name: 'fade', type: 'number', default: '0', description: 'Fades the edges into the page, from 0 to 1.' },
  { name: 'opacity', type: 'number', default: '1', description: 'Opacity of the whole effect.' },
  {
    name: 'lightMode',
    type: 'boolean',
    default: 'false',
    description: 'Draws the plasma as glowing glass with white cores for light backgrounds.'
  },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
  { name: 'dpr', type: 'number', default: 'auto', description: 'Maximum device pixel ratio, capped at 2.' },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' }
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
