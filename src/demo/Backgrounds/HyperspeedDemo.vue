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
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0; margin-bottom: 16px">
          <Hyperspeed v-bind="settings" :theme="theme" />
          <BackgroundContent pill-text="New Background" headline="Click & hold to see the real magic of hyperspeed!" />
        </div>

        <Customize>
          <PreviewColorList
            title="Tail Lights"
            :min="1"
            :model-value="settings.tailColors"
            @update:model-value="(value: string[]) => updateProp('tailColors', value)"
          />
          <PreviewColorList
            title="Headlights"
            :min="1"
            :model-value="settings.headColors"
            @update:model-value="(value: string[]) => updateProp('headColors', value)"
          />
          <PreviewColorList
            title="Poles"
            :min="1"
            :model-value="settings.poleColors"
            @update:model-value="(value: string[]) => updateProp('poleColors', value)"
          />
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="(value: string | number) => applyPreset(String(value))"
          />
          <PreviewColorPickerCustom
            title="Road Color"
            :color="settings.roadColor"
            @change="(value: string) => updateProp('roadColor', value)"
          />
          <PreviewColorPickerCustom
            title="Line Color"
            :color="settings.lineColor"
            @change="(value: string) => updateProp('lineColor', value)"
          />
          <PreviewSelect
            title="Curve"
            :options="CURVE_OPTIONS"
            :model-value="settings.curve"
            @update:model-value="(value: string | number) => updateProp('curve', value as Curve)"
          />
          <PreviewSlider
            title="Curvature"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.curvature"
            @update:model-value="(value: number) => updateProp('curvature', value)"
          />
          <PreviewSlider
            title="Speed"
            :min="0.1"
            :max="3"
            :step="0.05"
            :model-value="settings.speed"
            @update:model-value="(value: number) => updateProp('speed', value)"
          />
          <PreviewSlider
            title="Boost"
            :min="1"
            :max="8"
            :step="0.5"
            value-unit="×"
            :model-value="settings.boost"
            @update:model-value="(value: number) => updateProp('boost', value)"
          />
          <PreviewSlider
            title="FOV"
            :min="50"
            :max="130"
            :step="1"
            value-unit="°"
            :model-value="settings.fov"
            @update:model-value="(value: number) => updateProp('fov', value)"
          />
          <PreviewSlider
            title="Boost FOV"
            :min="50"
            :max="160"
            :step="1"
            value-unit="°"
            :model-value="settings.boostFov"
            @update:model-value="(value: number) => updateProp('boostFov', value)"
          />
          <PreviewSlider
            title="Lanes"
            :min="1"
            :max="6"
            :step="1"
            :model-value="settings.lanes"
            @update:model-value="(value: number) => updateProp('lanes', value)"
          />
          <PreviewSlider
            title="Road Width"
            :min="4"
            :max="20"
            :step="0.5"
            :model-value="settings.roadWidth"
            @update:model-value="(value: number) => updateProp('roadWidth', value)"
          />
          <PreviewSlider
            title="Median"
            :min="0"
            :max="8"
            :step="0.5"
            :model-value="settings.medianWidth"
            @update:model-value="(value: number) => updateProp('medianWidth', value)"
          />
          <PreviewSlider
            title="Density"
            :min="0"
            :max="160"
            :step="1"
            :model-value="settings.density"
            @update:model-value="(value: number) => updateProp('density', value)"
          />
          <PreviewSlider
            title="Trail Length"
            :min="0.2"
            :max="3"
            :step="0.05"
            :model-value="settings.trailLength"
            @update:model-value="(value: number) => updateProp('trailLength', value)"
          />
          <PreviewSlider
            title="Light Size"
            :min="0.3"
            :max="3"
            :step="0.05"
            :model-value="settings.lightSize"
            @update:model-value="(value: number) => updateProp('lightSize', value)"
          />
          <PreviewSlider
            title="Poles"
            :min="0"
            :max="80"
            :step="1"
            :model-value="settings.poles"
            @update:model-value="(value: number) => updateProp('poles', value)"
          />
          <PreviewSlider
            title="Dust"
            :min="0"
            :max="1500"
            :step="10"
            :model-value="settings.dust"
            @update:model-value="(value: number) => updateProp('dust', value)"
          />
          <PreviewSlider
            title="Glow"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.glow"
            @update:model-value="(value: number) => updateProp('glow', value)"
          />
          <PreviewSlider
            title="Reflections"
            :min="0"
            :max="1.5"
            :step="0.05"
            :model-value="settings.reflections"
            @update:model-value="(value: number) => updateProp('reflections', value)"
          />
          <PreviewSlider
            title="Road Opacity"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.roadOpacity"
            @update:model-value="(value: number) => updateProp('roadOpacity', value)"
          />
          <PreviewSlider
            title="Steer"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.steer"
            @update:model-value="(value: number) => updateProp('steer', value)"
          />
          <PreviewSwitch
            title="Interactive"
            :model-value="settings.interactive"
            @update:model-value="(value: boolean) => updateProp('interactive', value)"
          />
        </Customize>

        <PropTable :data="propData" />
        <Dependencies :dependency-list="['three']" />
      </template>

      <template #code>
        <CodeExample :code-object="hyperspeed" component-name="Hyperspeed" />
      </template>
    </TabsLayout>
  </ComponentPropsProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackgroundContent from '@/components/common/BackgroundContent.vue';
import CodeExample from '@/components/common/CodeExample.vue';
import Customize from '@/components/common/Customize.vue';
import Dependencies from '@/components/common/Dependencies.vue';
import PreviewColorList from '@/components/common/PreviewColorList.vue';
import PreviewColorPickerCustom from '@/components/common/PreviewColorPickerCustom.vue';
import PreviewSelect from '@/components/common/PreviewSelect.vue';
import PreviewSlider from '@/components/common/PreviewSlider.vue';
import PreviewSwitch from '@/components/common/PreviewSwitch.vue';
import PropTable, { type PropRow } from '@/components/common/PropTable.vue';
import TabsLayout from '@/components/common/TabsLayout.vue';
import ComponentPropsProvider from '@/components/context/ComponentPropsProvider.vue';
import { useComponentProps } from '@/composables/useComponentProps';
import { useColorModeValue } from '@/composables/useTheme';
import { hyperspeed } from '@/constants/code/Backgrounds/hyperspeedCode';
import Hyperspeed from '@/content/Backgrounds/Hyperspeed/Hyperspeed.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/Hyperspeed';

type Curve = (typeof DEFAULT_PROPS)['curve'];

const CURVE_OPTIONS = [
  { value: 'straight', label: 'Straight' },
  { value: 'gentle', label: 'Gentle' },
  { value: 'winding', label: 'Winding' },
  { value: 'hills', label: 'Hills' },
  { value: 'racing', label: 'Racing' },
  { value: 'deep', label: 'Deep' }
];

const propData: PropRow[] = [
  {
    name: 'tailColors',
    type: 'string[]',
    default: '-',
    description: 'Colors of the lights moving away on the left road. Defaults to greens.'
  },
  {
    name: 'headColors',
    type: 'string[]',
    default: '-',
    description: 'Colors of the oncoming lights on the right road. Defaults to cyan and deep blues.'
  },
  {
    name: 'poleColors',
    type: 'string[]',
    default: '-',
    description: 'Colors of the light poles along both shoulders.'
  },
  {
    name: 'curve',
    type: "'straight' | 'gentle' | 'winding' | 'hills' | 'racing' | 'deep'",
    default: "'winding'",
    description: 'Shape of the road. Switching between curves morphs the road smoothly.'
  },
  {
    name: 'curvature',
    type: 'number',
    default: '1',
    description: 'How strongly the road bends. 0 is straight.'
  },
  {
    name: 'speed',
    type: 'number',
    default: '1',
    description: 'Cruising speed of the traffic, poles and road markings.'
  },
  {
    name: 'boost',
    type: 'number',
    default: '3',
    description:
      'Speed multiplier while the pointer is held down. The lights stretch into longer trails as it kicks in.'
  },
  {
    name: 'fov',
    type: 'number',
    default: '90',
    description: 'Camera field of view in degrees.'
  },
  {
    name: 'boostFov',
    type: 'number',
    default: '130',
    description: 'Field of view while boosting. The camera springs between the two for a punchy warp.'
  },
  {
    name: 'lanes',
    type: 'number',
    default: '3',
    description: 'Lanes on each side of the road.'
  },
  {
    name: 'roadWidth',
    type: 'number',
    default: '10',
    description: 'Width of each side of the road.'
  },
  {
    name: 'medianWidth',
    type: 'number',
    default: '2',
    description: 'Width of the strip between the two sides.'
  },
  {
    name: 'density',
    type: 'number',
    default: '40',
    description: 'Cars on each side of the road, up to 160.'
  },
  {
    name: 'trailLength',
    type: 'number',
    default: '1',
    description: 'Length of the light trails.'
  },
  {
    name: 'lightSize',
    type: 'number',
    default: '1',
    description: 'Thickness of the light trails.'
  },
  {
    name: 'poles',
    type: 'number',
    default: '20',
    description: 'Light poles on each shoulder, up to 80. 0 removes them.'
  },
  {
    name: 'poleHeight',
    type: 'number',
    default: '1',
    description: 'Height of the light poles.'
  },
  {
    name: 'dust',
    type: 'number',
    default: '100',
    description: 'Speed streaks flying past in the air, up to 1500. They stretch into warp lines while boosting.'
  },
  {
    name: 'glow',
    type: 'number',
    default: '0.6',
    description: 'Soft bloom around every light. Dense traffic glows brighter. 0 turns it off.'
  },
  {
    name: 'reflections',
    type: 'number',
    default: '0.5',
    description: 'How much the lights reflect on the road, like wet asphalt at night.'
  },
  {
    name: 'roadOpacity',
    type: 'number',
    default: '0.1',
    description:
      'Opacity of the road and its markings. Lower it to let your page show through under the traffic. Reflections fade with it.'
  },
  {
    name: 'steer',
    type: 'number',
    default: '0.35',
    description: 'How far the camera drifts and turns toward the pointer.'
  },
  {
    name: 'roadColor',
    type: 'string',
    default: '-',
    description:
      'Color of the asphalt. The median strip takes a slightly lighter shade. Follows the theme when not set.'
  },
  {
    name: 'lineColor',
    type: 'string',
    default: '-',
    description: 'Color of the lane markings. Follows the theme when not set.'
  },
  {
    name: 'background',
    type: 'string',
    default: '-',
    description:
      'Color behind the road, which the road fades into. Leave it unset to keep the canvas transparent so your page shows through.'
  },
  {
    name: 'theme',
    type: "'dark' | 'light'",
    default: "'dark'",
    description: 'Dark renders glowing light trails. Light renders crisp colored trails on a pale road.'
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'true',
    description: 'Click and hold to boost, and let the camera follow the pointer.'
  },
  {
    name: 'boosting',
    type: 'boolean',
    default: 'false',
    description: 'Turns the boost on from your own code, for example while something loads.'
  },
  {
    name: 'onBoostStart',
    type: '() => void',
    default: '-',
    description: 'Called when the user starts boosting.'
  },
  {
    name: 'onBoostEnd',
    type: '() => void',
    default: '-',
    description: 'Called when the user lets go.'
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Extra class names for the container.'
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '-',
    description: 'Inline styles for the container.'
  }
];

const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue<'light' | 'dark'>('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, ...rest } = props.value;
  void _preset;
  return rest;
});

const applyPreset = (value: string) => {
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
};
</script>
