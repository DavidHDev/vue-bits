<template>
  <ComponentPropsProvider
    :props="props"
    :default-props="DEFAULT_PROPS"
    :reset-props="resetProps"
    :has-changes="hasChanges"
    :demo-only-props="['preset', 'layout', 'lineColor', 'accentColor']"
    :computed-props="computedProps"
  >
    <TabsLayout>
      <template #preview>
        <div class="demo-container relative overflow-hidden" style="height: 500px; padding: 0">
          <MagnetLines
            :key="rerenderKey"
            v-bind="settings"
            :line-color="colors.lineColor"
            :accent-color="colors.accentColor"
            :container-size="square ? SQUARE_SIZE : undefined"
          />
          <BackgroundContent v-if="!square" headline="Every line turns to follow your cursor" />
          <RefreshButton @click="forceRerender" />
        </div>

        <Customize>
          <PreviewSelect
            title="Preset"
            :options="PRESET_OPTIONS"
            :model-value="props.preset"
            @update:model-value="applyPreset"
          />
          <PreviewSelect
            title="Layout"
            :options="LAYOUT_OPTIONS"
            :model-value="props.layout"
            @update:model-value="value => updateProp('layout', String(value))"
          />
          <PreviewSelect
            title="Mode"
            :options="MODE_OPTIONS"
            :model-value="settings.mode"
            @update:model-value="value => updateProp('mode', String(value))"
          />
          <PreviewSelect
            title="Shape"
            :options="SHAPE_OPTIONS"
            :model-value="settings.shape"
            @update:model-value="value => updateProp('shape', String(value))"
          />
          <PreviewColorPickerCustom
            title="Line Color"
            :color="line"
            @change="(value: string) => updateProp('lineColor', value)"
          />
          <PreviewColorPickerCustom
            title="Accent Color"
            :color="accent || line"
            @change="(value: string) => updateProp('accentColor', value)"
          />
          <PreviewSlider
            title="Spacing"
            :min="12"
            :max="80"
            :step="1"
            value-unit="px"
            :model-value="settings.spacing"
            @update:model-value="value => updateProp('spacing', value)"
          />
          <PreviewSlider
            title="Line Width"
            :min="0.5"
            :max="8"
            :step="0.5"
            value-unit="px"
            :model-value="settings.lineWidth"
            @update:model-value="value => updateProp('lineWidth', value)"
          />
          <PreviewSlider
            title="Line Length"
            :min="4"
            :max="60"
            :step="1"
            value-unit="px"
            :model-value="settings.lineHeight"
            @update:model-value="value => updateProp('lineHeight', value)"
          />
          <PreviewSlider
            title="Base Angle"
            :min="-180"
            :max="180"
            :step="5"
            value-unit="°"
            :model-value="settings.baseAngle"
            @update:model-value="value => updateProp('baseAngle', value)"
          />
          <PreviewSlider
            title="Radius"
            :min="40"
            :max="500"
            :step="10"
            value-unit="px"
            :model-value="settings.radius"
            @update:model-value="value => updateProp('radius', value)"
          />
          <PreviewSlider
            title="Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.fade"
            @update:model-value="value => updateProp('fade', value)"
          />
          <PreviewSlider
            title="Edge Fade"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.edgeFade"
            @update:model-value="value => updateProp('edgeFade', value)"
          />
          <PreviewSlider
            title="Stretch"
            :min="0"
            :max="2"
            :step="0.05"
            :model-value="settings.stretch"
            @update:model-value="value => updateProp('stretch', value)"
          />
          <PreviewSlider
            title="Reach"
            :min="0"
            :max="400"
            :step="10"
            value-unit="px"
            :model-value="settings.reach"
            @update:model-value="value => updateProp('reach', value)"
          />
          <PreviewSlider
            title="Scatter"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.scatter"
            @update:model-value="value => updateProp('scatter', value)"
          />
          <PreviewSlider
            title="Inertia"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.inertia"
            @update:model-value="value => updateProp('inertia', value)"
          />
          <PreviewSlider
            title="Bounce"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.bounce"
            @update:model-value="value => updateProp('bounce', value)"
          />
          <PreviewSlider
            title="Ripple"
            :min="0"
            :max="1"
            :step="0.05"
            :model-value="settings.ripple"
            @update:model-value="value => updateProp('ripple', value)"
          />
          <PreviewSlider
            title="Tilt X"
            :min="-60"
            :max="60"
            :step="1"
            value-unit="°"
            :model-value="settings.tiltX"
            @update:model-value="value => updateProp('tiltX', value)"
          />
          <PreviewSlider
            title="Tilt Y"
            :min="-60"
            :max="60"
            :step="1"
            value-unit="°"
            :model-value="settings.tiltY"
            @update:model-value="value => updateProp('tiltY', value)"
          />
          <PreviewSwitch
            title="Rainbow"
            :model-value="settings.rainbow"
            @update:model-value="value => updateProp('rainbow', value)"
          />
          <PreviewSwitch
            title="Click Pulse"
            :model-value="settings.clickPulse"
            @update:model-value="value => updateProp('clickPulse', value)"
          />
          <PreviewSwitch
            title="Idle"
            :model-value="settings.idle"
            @update:model-value="value => updateProp('idle', value)"
          />
          <PreviewSwitch title="Intro" :model-value="settings.intro" @update:model-value="setIntro" />
        </Customize>

        <PropTable :data="propData" />
      </template>

      <template #code>
        <CodeExample :code-object="magnetLines" component-name="MagnetLines" />
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
import { magnetLines } from '@/constants/code/Backgrounds/magnetLinesCode';
import MagnetLines from '@/content/Backgrounds/MagnetLines/MagnetLines.vue';
import { DEFAULT_PROPS, PRESET_OPTIONS, presetProps } from './presets/MagnetLines';

type Mode = 'orbit' | 'attract' | 'spiral' | 'dipole';
type Shape = 'line' | 'arrow' | 'needle';

const SQUARE_SIZE = 'min(440px, 86%)';

const LIGHT_SWAP: Record<string, string> = {
  '#efefef': '#27272a',
  '#38bdf8': '#0284c7',
  '#f43f5e': '#e11d48'
};

const DARK_SWAP: Record<string, string> = Object.fromEntries(
  Object.entries(LIGHT_SWAP).map(([dark, light]) => [light, dark])
);

const LAYOUT_OPTIONS = [
  { value: 'full', label: 'Full' },
  { value: 'square', label: 'Square' }
];

const MODE_OPTIONS = [
  { value: 'orbit', label: 'Orbit' },
  { value: 'attract', label: 'Attract' },
  { value: 'spiral', label: 'Spiral' },
  { value: 'dipole', label: 'Dipole' }
];

const SHAPE_OPTIONS = [
  { value: 'line', label: 'Line' },
  { value: 'arrow', label: 'Arrow' },
  { value: 'needle', label: 'Needle' }
];

const swapColor = (value: string | undefined, swap: Record<string, string>) => {
  if (!value) return value;
  const key = `#${String(value).replace(/^#/, '').toLowerCase()}`;
  return swap[key] ?? key;
};

const { rerenderKey, forceRerender } = useForceRerender();
const { props, defaultProps, updateProp, updateProps, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
const theme = useColorModeValue('light', 'dark');

const settings = computed(() => {
  const { preset: _preset, layout: _layout, lineColor: _lineColor, accentColor: _accentColor, ...rest } = props.value;
  void _preset;
  void _layout;
  void _lineColor;
  void _accentColor;
  return { ...rest, mode: rest.mode as Mode, shape: rest.shape as Shape };
});

const swap = computed(() => (theme.value === 'light' ? LIGHT_SWAP : DARK_SWAP));
const line = computed(() => swapColor(props.value.lineColor || defaultProps.value.lineColor, swap.value) as string);
const accent = computed(() => swapColor(props.value.accentColor, swap.value));
const square = computed(() => props.value.layout === 'square');
const colors = computed(() => ({ lineColor: line.value, ...(accent.value ? { accentColor: accent.value } : {}) }));
const computedProps = computed(() => ({ ...colors.value, ...(square.value ? { containerSize: SQUARE_SIZE } : {}) }));

const applyPreset = (option: string | number) => {
  const value = String(option);
  updateProps({ ...presetProps(value, { defaults: defaultProps.value }), preset: value });
  forceRerender();
};

const setIntro = (value: boolean) => {
  updateProp('intro', value);
  forceRerender();
};

const propData: PropRow[] = [
  {
    name: 'spacing',
    type: 'number',
    default: '30',
    description: 'Distance between lines in px. The grid fills the area with as many lines as fit.'
  },
  { name: 'rows', type: 'number', default: '-', description: 'Exact number of rows. Overrides spacing.' },
  { name: 'columns', type: 'number', default: '-', description: 'Exact number of columns. Overrides spacing.' },
  {
    name: 'containerSize',
    type: 'number | string',
    default: '-',
    description:
      'Draws a square field of this width instead of filling the parent. Numbers are in px; strings take any CSS length.'
  },
  { name: 'lineColor', type: 'string', default: "'#efefef'", description: 'Color of the lines.' },
  {
    name: 'accentColor',
    type: 'string',
    default: '-',
    description: 'Color lines take on near the cursor. Compass needles use it for their north half.'
  },
  {
    name: 'lineWidth',
    type: 'number | string',
    default: '2',
    description: 'Thickness of each line. Numbers are in px; strings take any CSS length.'
  },
  {
    name: 'lineHeight',
    type: 'number | string',
    default: '18',
    description: 'Length of each line. Numbers are in px; strings take any CSS length.'
  },
  {
    name: 'baseAngle',
    type: 'number',
    default: '-10',
    description: 'Resting angle of the lines in degrees, used before the intro and outside the reach.'
  },
  {
    name: 'mode',
    type: "'orbit' | 'attract' | 'spiral' | 'dipole'",
    default: "'orbit'",
    description:
      'Shape of the field: rings around the cursor, lines aiming at it, a vortex, or a bar magnet that turns with your movement.'
  },
  {
    name: 'shape',
    type: "'line' | 'arrow' | 'needle'",
    default: "'line'",
    description: 'Draws each line as a rounded bar, an arrow showing the field direction, or a two-tone compass needle.'
  },
  {
    name: 'rainbow',
    type: 'boolean',
    default: 'false',
    description: 'Colors every line by the direction it points, so the field becomes a color wheel.'
  },
  {
    name: 'radius',
    type: 'number',
    default: '200',
    description: 'Size of the area around the cursor where lines are brightest and longest, in px.'
  },
  {
    name: 'fade',
    type: 'number',
    default: '0.65',
    description: 'How much lines dim away from the cursor, from 0 to 1. 0 keeps every line at full strength.'
  },
  {
    name: 'edgeFade',
    type: 'number',
    default: '0',
    description: 'Fades the edges into the page, from 0 to 1.'
  },
  {
    name: 'stretch',
    type: 'number',
    default: '0.4',
    description: 'How much lines grow near the cursor, from 0 to 2.'
  },
  {
    name: 'reach',
    type: 'number',
    default: '0',
    description:
      'Distance in px within which lines follow the cursor. Lines farther out settle back to their resting angle. 0 means every line follows.'
  },
  {
    name: 'scatter',
    type: 'number',
    default: '0',
    description:
      'Randomizes the resting angle of each line, from 0 to 1, like loose iron filings. Pairs well with reach.'
  },
  {
    name: 'inertia',
    type: 'number',
    default: '0.35',
    description: 'How slowly the lines swing into place, from 0 to 1. 0 snaps them instantly.'
  },
  {
    name: 'bounce',
    type: 'number',
    default: '0.3',
    description: 'How much the lines overshoot and wobble as they settle, from 0 to 1.'
  },
  {
    name: 'ripple',
    type: 'number',
    default: '0.3',
    description: 'Delays lines by their distance from the cursor so movement ripples outward, from 0 to 1.'
  },
  {
    name: 'clickPulse',
    type: 'boolean',
    default: 'true',
    description: 'Clicking sends a ring that spins the lines as it travels outward.'
  },
  {
    name: 'intro',
    type: 'boolean',
    default: 'true',
    description: 'Lines fade in from the center and swing into place when the field mounts.'
  },
  {
    name: 'idle',
    type: 'boolean',
    default: 'false',
    description: 'Moves the field on its own when the cursor is away.'
  },
  {
    name: 'tiltX',
    type: 'number',
    default: '0',
    description:
      'Tilts the field back in 3D around the horizontal axis, in degrees. A full-size field stretches to the horizon.'
  },
  {
    name: 'tiltY',
    type: 'number',
    default: '0',
    description: 'Tilts the field in 3D around the vertical axis, in degrees.'
  },
  {
    name: 'maxDevicePixelRatio',
    type: 'number',
    default: '2',
    description: 'Highest pixel ratio the canvas renders at.'
  },
  { name: 'className', type: 'string', default: "''", description: 'Extra class names for the container.' },
  { name: 'style', type: 'CSSProperties', default: '-', description: 'Inline styles for the container.' }
];
</script>
